const gulp = require('gulp');
const {exec} = require('child_process');
const webpack = require("webpack");
const {readdirSync, writeFile, readFileSync, writeFileSync, existsSync, statSync} = require('fs');
const {resolve} = require('path');
const nodemon = require('gulp-nodemon');
const svgo = require('gulp-svgo');
const mkdir = require('mkdirp-sync');
const tinypng = require('gulp-tiny').default;
const deletefile = require('gulp-delete-file');
const webp = require('gulp-webp');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const aliases = require("./webpack/webpack.frontend.aliases").default;

let style_js_remove = [];
let styles_entry = {};
const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

readdirSync(resolve(__dirname, "styles")).forEach(file => {
    if (/scss$/i.test(file)) {
        const name = file.replace(/\.scss$/i, '');
        style_js_remove.push(name);
        styles_entry[name] = (resolve(__dirname, 'styles', name + '.scss'));
    }
});

gulp.task('------Development------');

gulp.task('run-backend', () => {
    try {
        // gulp.watch('./dist/public/*.svg', {ignoreInitial: false}, ['svgoDev']);

        return nodemon({
            script: './dist/server/index.js',
            ext: 'js',
            watch: ['./dist/server/'],
            env: {
                'STATIC_PATH': 'dist/public'
            },
            ignore: [
                'node_modules',
                'client',
                'webpack',
                '.gulp',
            ]
        });

    } catch (err) {
        console.error(err)
    }
});

gulp.task('autoTypedStyle', (callback) => {
    return webpack({
        devtool: false,
        entry: styles_entry,
        output: {
            path: resolve(__dirname, '.gulp/style'),
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.js', '.scss', '.css'],
            moduleExtensions: ['-loader'],
            alias: aliases
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use:
                        ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: [
                                {
                                    loader: "css-loader", options: {
                                        sourceMap: false,
                                        modules: true,
                                        importLoaders: 1,
                                        localIdentName: '[local]',
                                        minimize: true
                                    }
                                },
                                {
                                    loader: "sass-loader", options: {
                                        sourceMap: false,
                                        modules: true,
                                    }
                                }
                            ]
                        })

                },
                { test: /\.(woff|ttf|eot|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'base64-font-loader' },
                { test: /\.(png|jpg|jpeg|gif)$/, use: [{ loader: 'url-loader' }] }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    BROWSER: JSON.stringify(true),
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.NamedModulesPlugin(),
            new ExtractTextPlugin("[name].css")
        ],
    }, function (err, stats) {

        try {
            (stats.compilation.errors || []).forEach((error) => {
                console.error(error);
            });
            let template = "";
            let valueStyles = [];
            style_js_remove.forEach((name) => {
                if (name === "base" || name === "font") return;
                const str = readFileSync(resolve(__dirname, '.gulp/style', name + '.css'), 'utf8');
                const regex = /\.([a-zA-Z_][\w-_]*[^\.\s\{#:\,;])/gmi;
                let m;
                let clases = [];

                let _template = `export interface I${name[0].toUpperCase() + name.slice(1)} {\n`;
                while ((m = regex.exec(str)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    clases.push(m[1].replace(">", ""))
                }
                clases = (clases.filter(onlyUnique));
                if (clases.length) {
                    valueStyles = [...valueStyles, ...clases];
                    clases.forEach((name) => {
                        _template += `  readonly "${name}": string;\n`
                    });
                    _template += "}\n";
                    template += _template;
                }
            });
            const regexBlock = /^(([a-z0-9]+)(-|_){0,1})+([a-z0-9]+)/i;
            const regexElement = /__([a-z0-9]+(-|_|)[a-z0-9]+)/gi;
            const regexMod = /--([a-z0-9]+(-|_|)[a-z0-9]+)/gi;
            let m;
            let valueBlocks = [];
            let valueElements = [];
            let valueMods = [];

            valueStyles.forEach((str) => {
                if ((m = regexBlock.exec(str)) !== null) {
                    valueBlocks = [...valueBlocks, '"' + m[0] + '"'];
                }
                while ((m = regexElement.exec(str)) !== null) {
                    valueElements = [...valueElements, '"' + m[1] + '"'];
                }
                while ((m = regexMod.exec(str)) !== null) {
                    valueMods = [...valueMods, '"' + m[1] + '"'];
                }
            });
            valueBlocks = (valueBlocks.filter(onlyUnique));
            valueElements = (valueElements.filter(onlyUnique));
            valueMods = (valueMods.filter(onlyUnique));

            template += "/* tslint:disable:max-line-length */\n";
            template += "export type IValueBlocks = " + (valueBlocks.length && valueBlocks.join(" | ") || '""') + ";\n";
            template += "export type IValueElements = " + (valueElements.length && valueElements.join(" | ") || '""') + ";\n";
            template += "export type IValueMods = " + (valueMods.length && valueMods.join(" | ") || '""') + ";\n";
            template += "/* tslint:enable:max-line-length */\n";

            writeFile(resolve('styles/interface.ts'), template, function (err) {
                if (err)
                    return console.log(err);

                callback();
            });
        } catch (error) {
            console.error(error);
        }
    });
});

gulp.task("routeGenerate", () => {
    const route = JSON.parse(readFileSync(resolve("route/Route.json")));
    let importBackend = '';
    let routeBackend = '';
    let routeFrontend = '';

    route.routes.forEach(({path, container, exact}) => {

        importBackend += 'import ' + container + ' from "_page/' + container + '";\n';
        routeBackend += '        <Route' + (exact === true ? ' exact={true}' : '') + ' path="' + path + '" component={' + container + '}/>\n';

        routeFrontend += 'const ' + container + ' = LazyLoadComponent(() => System.import("_page/' + container + '"), LoadingComponent, ErrorComponent);\n';

    });

    const backendTemplate = importBackend +
        'import * as React from "react";\n' +
        'import {Route, Switch} from "react-router";\n\n' +
        'export const BackendRoutes = () => (\n' +
        '    <Switch>\n' +
        routeBackend +
        '   </Switch>\n);\n\n' +
        'export default BackendRoutes;\n';

    const clientTemplate = 'import ErrorComponent from "_component/ErrorComponent";\n' +
        'import LazyLoadComponent from "_component/LazyLoadComponent";\n' +
        'import LoadingComponent from "_component/LoadingComponent";\n' +
        'import * as React from "react";\n' +
        'import {Route, Switch} from "react-router";\n' +
        'declare const System: { import: (path: string) => Promise<any>; };\n\n' +
        routeFrontend +
        '\nexport const Routes = () => (\n' +
        '   <Switch>\n' +
        routeBackend +
        '   </Switch>\n);\n\n' +
        'export default Routes;\n';

    writeFileSync(resolve("route/backendRoute.tsx"), backendTemplate);
    writeFileSync(resolve("route/clientRoute.tsx"), clientTemplate);

});

gulp.task('svgSprite', (callback) => {

    exec('./node_modules/.bin/svg-sprite-generate -d ./static/icon/ -o ./dist/public/sprite.svg', (err, stdout, stderr) => {
        if (err != null) {
            callback(err);
            console.error(err);
            return
        }
        console.info(stdout);
        console.error(stderr);
        callback(err);
    });
});

gulp.task('svgoSpr', ['svgSprite'], () => {

    return gulp.src('./dist/public/*.svg', {ignoreInitial: false})
        .pipe(svgo({
            plugins: [
                {removeAttrs: {attrs: ['class', 'viewBox']}},
                {removeUselessDefs: true},
                {removeDoctype: true},
                {removeStyleElement: true},
                {removeComments: true},
                {cleanupIDs: false},
                {removeViewBox: true},
                {removeRasterImages: true},
                {sortAttrs: true},
                {mergePaths: true},
                {removeTitle: true},
                {removeDesc: true},
                {removeScriptElement: true},
                {cleanupNumericValues: {floatPrecision: 4}},
                {addAttributesToSVGElement: {attribute: ['viewBox="0 0 24 24"']}}
            ]
        }))
        .pipe(gulp.dest('./dist/public'));
});

gulp.task('svgoDev', ['svgoSpr'], (cb) => {
    try {
        if(existsSync(resolve("static/icon", "no_svgo"))) {
            let spriteFile = readFileSync(resolve("dist/public", "sprite.svg"));
            let sprites = "";
            const svgs = readdirSync(resolve("static/icon", "no_svgo"));
            svgs.forEach((file) => {
                const _spriteFile = readFileSync(resolve("static/icon", "no_svgo", file)).toString().replace(/[\n\r]/igm, "").replace(/\s+/igm, " ");
                sprites += _spriteFile;
            });
            writeFileSync(resolve("dist/public", "sprite.svg"), sprites + spriteFile.toString());
        }
        cb();
    } catch (err) {
        console.error(err);
        cb(err);
    }
});

gulp.task("blockGenerate", (cb) => {
    const _path = resolve('./view/block');
    if(existsSync(_path)) {
        const foldres = readdirSync(_path).filter(function (file) {
            return statSync(_path + '/' + file).isDirectory();
        });

        let importBlock = '';
        let importBlockBack = '';
        let exportBlock = '';
        let letName = '';

        foldres.forEach((name) => {
            letName += "let " + name + ": any;\n";
            importBlock += '   ' + name + ' = LazyLoadComponent(() => System.import("./' + name + '"), LoadingComponent, ErrorComponent);\n';
            importBlockBack += '   ' + name + ' = require("./' + name + '").default;\n';
            exportBlock += '    ' + name + ',\n';
        });

        if (foldres.length) {

            const blockTemplate = 'import {ErrorComponent} from "_component/ErrorComponent";\n' +
                'import LazyLoadComponent from "_component/LazyLoadComponent";\n' +
                'import {LoadingComponent} from "_component/LoadingComponent";\n' +
                'declare const System: { import: (path: string) => Promise<any>; };\n\n' +
                letName +
                'if (process.env.BROWSER) {\n' +
                importBlock +
                '} else {\n' +
                importBlockBack +
                '}\n' +
                'export {\n' +
                exportBlock +
                '};\n';

            writeFileSync(resolve(_path, "index.ts"), blockTemplate);
            cb();
        }
    } else {
        cb();
    }
});

gulp.task("tinypng", (cb) => {
    const exit_path = resolve('./static/images');
    const _path = resolve('./static/original_images');
    if(existsSync(_path)) {

        if(!existsSync(_path)) mkdir(exit_path);

        return gulp.src('./static/original_images/**/*.{png,jpg,jpeg}')
            .pipe(tinypng({
                apiKeys: ['RsN84oBjmXxPkCB5s_ZlfA1fRS1U32LY', 'bN4uZbaI06-ESRiKhD6yS3P4NF9zle7W', 'durCxw2lwQgJmxvwOnpyLrMdEsNEImOY'],
                cached: true,
                size: [
                    {name: "2k", method: "fit", width: 2560, height: 1440},
                    {name: "full", method: "fit", width: 1920, height: 1080},
                    {name: "plus", method: "fit", width: 1600, height: 900},
                    {name: "hd", method: "fit", width: 1366, height: 768},
                    {name: "xga", method: "fit", width: 1024, height: 768},
                    {name: "wide", method: "fit", width: 768, height: 480},
                    {name: "half", method: "fit", width: 480, height: 320}
                ],
                exit_path
            }))
            .pipe(gulp.dest(exit_path));

    } else {
        cb();
    }
});

gulp.task("webp", ["tinypng"], () => {
    gulp.src('./static/images/**/*.{jpg,jpeg,png,gif}')
        .pipe(webp({
            method: 6,
            quality: 85
        }))
        .pipe(gulp.dest('./static/images'))
});

gulp.task('------Production------');

gulp.task('pre-build', ['routeGenerate', 'blockGenerate', 'autoTypedStyle', 'webp']);

gulp.task('cleanServer', () => {
    gulp.src(['./dist/server/**/*.*']).pipe(deletefile({
        reg: /(index\.js$)|(manifest)/ig,
        deleteMatch: false
    }))
});

gulp.task('cleanPublic', () => {
    gulp.src(['./dist/public/**/*.map', './dist/public/**/*.js']).pipe(deletefile({
        reg: new RegExp(style_js_remove.join("|"), "ig"),
        deleteMatch: true
    }))
});

gulp.task('cleanStyle', () => {
    gulp.src(['./dist/public/style/*.css']).pipe(deletefile({
        reg: new RegExp(style_js_remove.map((e)=> e + "\\.\\w+\\.css").join("|"), "ig"),
        deleteMatch: false
    }))
});

gulp.task('svgo', ['cleanPublic', 'cleanStyle', 'cleanServer'], () => {
    return gulp.run("svgoDev");
});

gulp.task('only_copy_images', ['svgo'], () => {
    return gulp.src('./static/only_copy/**/*.{png,jpg,jpeg,ico}')
        .pipe(gulp.dest('./dist/public/images'));
});

gulp.task('build', ['only_copy_images']);