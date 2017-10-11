const {join, resolve} = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const vendorStyles = require("./vendor.style").default;
const vendorScripts = require("./vendor.scripts").default;
const aliases = require("./webpack.frontend.aliases").default;
const Hashids = require('hashids');

const entry = process.env.TEMP_NAME ? {bundle: process.env.TEMP_NAME} : {
    bundle: [
        join(__dirname, '..', 'client', 'index.tsx')
    ],
    vendor: vendorScripts,
    style: join(__dirname, '..', 'styles', 'index.ts'),

    // Styles
    base: [resolve(__dirname, '..', 'styles', 'base.scss'), ...vendorStyles],
    block: resolve(__dirname, '..', 'styles', 'block.scss'),
    components: resolve(__dirname, '..', 'styles', 'components.scss'),
    section: resolve(__dirname, '..', 'styles', 'section.scss'),
};

function isVendor({ resource }) {
    return resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/);
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
            parallel: {
                cache: true,
                workers: true
            },
            uglifyOptions: {
                ecma: 8,
                warnings: false,
                mangle: {
                    safari10: true,
                },
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
        new ManifestPlugin({
            fileName: process.env.BACKEND === 'false' ? "manifest.json" : "../server/manifest.json"
        })
    ]
};
