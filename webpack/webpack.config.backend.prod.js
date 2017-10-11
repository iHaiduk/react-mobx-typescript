const {join, resolve} = require('path');
const {readFileSync} = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const aliases = require("./webpack.backend.aliases").default;
const vendorStyles = require("./vendor.style").default;
const Hashids = require('hashids');

const entry = {
    index: [
        "babel-polyfill",
        join(__dirname, '../server', 'index'),
    ],
    base: [resolve(__dirname, '..', 'styles', 'base.scss'), ...vendorStyles],
    block: resolve(__dirname, '..', 'styles', 'block.scss'),
    components: resolve(__dirname, '..', 'styles', 'components.scss'),
    section: resolve(__dirname, '..', 'styles', 'section.scss'),
};

const preAssets = JSON.parse(readFileSync(resolve(__dirname, "..", "dist", "server", "manifest.json"), "utf-8"));
let assets = {};
Object.keys(preAssets).forEach((value) => {
    if (
        value === "base.css" ||
        value === "block.css" ||
        value === "bundle.js" ||
        value === "components.css" ||
        value === "font.css" ||
        value === "section.css" ||
        value === "style.js" ||
        value === "vendor.js"
    ) {
        assets[value] = preAssets[value];
    }
});

module.exports = {
    devtool: false,
    target: 'node',
    watch: false,
    entry: entry,
    output: {
        path: join(__dirname, '../dist/server'),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },
    externals: [nodeExternals()],
    resolve: {
        modules: ['node_modules'],
        extensions: [".js", ".ts", ".tsx"],
        descriptionFiles: ['package.json'],
        moduleExtensions: ['-loader'],
        alias: aliases
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader?sourceMap=false",
                    use: [
                        {
                            loader: "css-loader", options: {
                                sourceMap: false,
                                minimize: true,
                                localIdentName: '[local]',
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                plugins: (loader) => [
                                    require('autoprefixer')({
                                        browsers: [
                                            'last 2 versions',
                                            '> 1%',
                                            'android 4',
                                            'iOS 9',
                                        ],
                                        cascade: false
                                    }),
                                    require('cssnano')({
                                        preset: 'advanced',
                                    })
                                ]
                            }
                        },
                    ]
                })
            },
            {
                test: /\.s[ac]ss$/,
                use:
                    ExtractTextPlugin.extract({
                        fallback: "style-loader?sourceMap=false",
                        use: [
                            {
                                loader: "css-loader", options: {
                                    sourceMap: false,
                                    modules: true,
                                    importLoaders: 3,
                                    minimize: true,
                                    localIdentName: '[local]',
                                    getLocalIdent: (context, localIdentName, localName) => {
                                        const hashids = new Hashids(localName);
                                        const lngt = localName.length;
                                        return hashids.encode(lngt, lngt, lngt).replace(/^\d/ig, "_" + hashids.encode(1));
                                    }
                                }
                            },
                            'group-css-media-queries-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: false,
                                    plugins: () => [require('autoprefixer')({
                                        browsers: [
                                            'last 2 versions',
                                            '> 1%',
                                            'android 4',
                                            'iOS 9',
                                        ],
                                        cascade: false
                                    })]
                                }
                            },
                            {
                                loader: "sass-loader", options: {
                                    sourceMap: false,
                                    modules: true,
                                }
                            },
                        ]
                    })

            },
            {
                test: /\.ts(x?)$/,
                use: [
                    {loader: 'awesome-typescript-loader'}
                ],
                exclude: [/node_modules/],
                include: [
                    resolve(__dirname, '..', 'route'),
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'server'),
                    resolve(__dirname, '..', 'styles'),
                    resolve(__dirname, '..', 'view'),
                    resolve(__dirname, '..', 'utils'),
                ],
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin(['./dist/server/', './.gulp/styleTemp/'], {
            root: resolve(__dirname, '..'),
            verbose: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(false),
                NODE_ENV: JSON.stringify('production'),
                ASSETS: JSON.stringify(assets)
            }
        }),
        new ExtractTextPlugin("../../.gulp/styleTemp/[name].[chunkhash:4].css"),
        new UglifyJSPlugin({
            parallel: {
                cache: true,
                workers: true
            },
            uglifyOptions: {
                ecma: 8,
                warnings: false,
                output: {
                    beautify: false,
                    keep_quoted_props: true,
                    shebang: false
                },
                compress: {
                    properties: true,
                    dead_code: true,
                    drop_debugger: true,
                    unsafe_math: true,
                    conditionals: true,
                    loops: true,
                    if_return: true,
                    inline: true,
                    collapse_vars: true,
                    reduce_vars: true,
                    drop_console: true,
                    passes: 5,
                    keep_infinity: true,
                }
            },
        }),
    ],
    node: {
        console: false,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    }
};