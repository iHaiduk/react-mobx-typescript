const {join, resolve} = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const vendorStyles = require("./vendor.style").default;
const vendorScripts = require("./vendor.scripts").default;
const bundleScripts = require("./vendor.scripts").bundle;
const aliases = require("./webpack.frontend.aliases").default;
const Hashids = require('hashids');

const entry = process.env.TEMP_NAME ? {bundle: process.env.TEMP_NAME} : {
    bundle: [
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
    devtool: false,
    entry: entry,
    target: 'web',
    output: {
        path: resolve(__dirname, process.env.TEMP_DIR || '../dist/public'),
        filename: '[name].[chunkhash:4].js',
        publicPath: '/',
        chunkFilename: '[id].[chunkhash:4].js',
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
                include: [
                    resolve(__dirname, '..', 'client'),
                    resolve(__dirname, '..', 'route'),
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'styles'),
                    resolve(__dirname, '..', 'view'),
                    resolve(__dirname, '..', 'utils')
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin(['./dist/public/'], {
            root: resolve(__dirname, '..'),
            verbose: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin("style/[name].[chunkhash:4].css"),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor,
            filename: '[name].[chunkhash:4].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'style',
            chunks: ['style'],
            minChunks: Infinity,
            filename: '[name].[chunkhash:4].js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bundle',
            chunks: ['bundle'],
            minChunks: Infinity,
            filename: '[name].[chunkhash:4].js'
        }),

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
        new ManifestPlugin({
            fileName: process.env.BACKEND === 'false' ? "manifest.json" : "../server/manifest.json"
        }),
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'static',
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: '../stats/reportFrontend.html',
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
    ]
};
