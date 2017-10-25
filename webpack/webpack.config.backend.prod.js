const {join, resolve} = require('path');
const {readFileSync} = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
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
                test: /\.(woff|ttf|eot|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: '[sha512:hash:base64:7].[ext]',
                    publicPath: function(url) {
                        return url.replace('../public/fonts/', '/fonts/')
                    },
                    outputPath: '../public/fonts/'
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[sha512:hash:base64:7].[ext]',
                            publicPath: function(url) {
                                return url.replace('../public/images/', '/images/')
                            },
                            outputPath: '../public/images/'
                        }
                    }
                ]
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
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                ecma: 8,
                ie8: false,
                warnings: false,
                output: {
                    beautify: false,
                    keep_quoted_props: true,
                    shebang: false,
                    comments: false,
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
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'static',
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: '../stats/reportBackend.html',
            // Module sizes to show in report by default.
            // Should be one of `stat`, `parsed` or `gzip`.
            // See "Definitions" section for more information.
            defaultSizes: 'parsed',
            // Automatically open report in default browser
            openAnalyzer: false,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        })
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