const {join, resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const vendorStyles = require("./vendor.style").default;
const vendorScripts = require("./vendor.scripts").default;
const bundleScripts = require("./vendor.scripts").bundle;
const aliases = require("./webpack.frontend.aliases").default;

const entry = process.env.TEMP_NAME ? {bundle: process.env.TEMP_NAME} : {
    bundle: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        join(__dirname, '..', 'client', 'index.tsx')
    ].concat(bundleScripts),
    vendor: vendorScripts,
    style: [join(__dirname, '..', 'styles', 'index.ts'), join(__dirname, '..', 'utils', 'rBem.tsx')],

    // Styles
    base: [resolve(__dirname, '..', 'styles', 'base.scss'), ...vendorStyles],
    block: resolve(__dirname, '..', 'styles', 'block.scss'),
    components: resolve(__dirname, '..', 'styles', 'components.scss'),
    section: resolve(__dirname, '..', 'styles', 'section.scss'),
};

function isVendor({ resource }) {
    return resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.js$/);
}

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: entry,
    target: 'web',
    output: {
        path: resolve(__dirname, process.env.TEMP_DIR || '../dist/public'),
        filename: '[name].js',
        publicPath: '/',
        chunkFilename: '[name]-[id].js',
        libraryTarget: 'umd'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [".ts", ".tsx", ".js", '.scss', '.css'],
        descriptionFiles: ['package.json'],
        moduleExtensions: ['-loader'],
        alias: aliases,
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    },
    module: {
        loaders: [
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
                use: "source-map-loader",
                exclude: /node_modules|styles/,
            },
            {
                enforce: 'pre',
                test: /\.ts(x?)$/,
                use: "source-map-loader",
                exclude: /node_modules|styles/,
            },
            {
                test: /\.ts(x?)$/,
                use: [
                    {loader: 'react-hot-loader/webpack'},
                    {loader: 'awesome-typescript-loader'}
                ],
                include: [
                    resolve(__dirname, '..', 'client'),
                    resolve(__dirname, '..', 'route'),
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'static'),
                    resolve(__dirname, '..', 'styles'),
                    resolve(__dirname, '..', 'view'),
                    resolve(__dirname, '..', 'utils')
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new WebpackErrorNotificationPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new ExtractTextPlugin("style/[name].css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor,
            filename: 'vendor.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'style',
            chunks: ['style'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bundle',
            chunks: ['bundle'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'server',
            // Host that will be used in `server` mode to start HTTP server.
            analyzerHost: '0.0.0.0',
            // Port that will be used in `server` mode to start HTTP server.
            analyzerPort: 8001,
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
    devServer: {
        hot: true,
        proxy: process.env.BACKEND === 'false' ? undefined : {
            '*': 'http://0.0.0.0:' + (process.env.PORT || 1337),
            ws: true
        },

        contentBase: process.env.BACKEND === 'false' ? __dirname : resolve(__dirname, 'dist', 'public'),
        publicPath: '/',
        host: "0.0.0.0",

        port: 3000,
        historyApiFallback: true,
        stats: {
            colors: true,
            chunks: false,
        },
        compress: true,
        disableHostCheck: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        open: false
    },
};
