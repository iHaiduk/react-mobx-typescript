const {join, resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const vendorStyles = require("./vendor.style").default;
const nodeExternals = require('webpack-node-externals');
const aliases = require("./webpack.backend.aliases").default;

const entry = {
    index: [
        "babel-polyfill",
        join(__dirname, '../server', 'index'),
    ],

    // Styles
    base: [resolve(__dirname, '..', 'styles', 'base.scss'), ...vendorStyles],
    block: resolve(__dirname, '..', 'styles', 'block.scss'),
    components: resolve(__dirname, '..', 'styles', 'components.scss'),
    section: resolve(__dirname, '..', 'styles', 'section.scss'),
};

module.exports = {
    devtool: 'sourcemap',
    target: 'node',
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
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
        extensions: [ ".js", ".ts", ".tsx"],
        descriptionFiles: ['package.json'],
        moduleExtensions: ['-loader'],
        alias: aliases
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.css$/,
                use: "source-map-loader",
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader", options: {
                                sourceMap: true,
                                localIdentName: '[local]'
                            }
                        }
                    ]
                })
            },
            {
                enforce: 'pre',
                test: /\.s[ac]ss$/,
                use: "source-map-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                use:
                    ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader", options: {
                                    sourceMap: true,
                                    modules: true,
                                    importLoaders: 3,
                                    localIdentName: '[local]'
                                }
                            },
                            'group-css-media-queries-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    plugins: (loader) => [
                                        require('autoprefixer')({
                                            browsers: [
                                                'last 2 versions',
                                                '> 1%',
                                                'android 4',
                                                'iOS 9',
                                            ],
                                            cascade: false
                                        })
                                    ]
                                }
                            },
                            {
                                loader: "sass-loader", options: {
                                    sourceMap: true,
                                    modules: true,
                                }
                            }
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
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: '/node_modules/'
            },
            {
                enforce: 'pre',
                test: /\.ts(x?)$/,
                use: "source-map-loader",
                exclude: '/node_modules/'
            },
            {
                test: /\.ts(x?)$/,
                use: [
                    {loader: 'awesome-typescript-loader'}
                ],
                exclude: [/node_modules/],
                include: [
                    resolve(__dirname, '..', 'route'),
                    resolve(__dirname, '..', 'static'),
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
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         BROWSER: JSON.stringify(false),
        //         NODE_ENV: JSON.stringify('development'),
        //         ASSETS: JSON.stringify({})
        //     }
        // }),
        new WebpackErrorNotificationPlugin(),
        new ExtractTextPlugin("../public/style/[name].css"),
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'server',
            // Host that will be used in `server` mode to start HTTP server.
            analyzerHost: '0.0.0.0',
            // Port that will be used in `server` mode to start HTTP server.
            analyzerPort: 8002,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
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