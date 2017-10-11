const {join, resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
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
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(false),
                NODE_ENV: JSON.stringify('development'),
                ASSETS: JSON.stringify({})
            }
        }),
        new WebpackErrorNotificationPlugin(),
        new ExtractTextPlugin("../public/style/[name].css"),
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