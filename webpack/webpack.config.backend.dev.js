const {join, resolve} = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const aliases = require("./webpack.backend.aliases").default;

const entry = {
    index: [
        "babel-polyfill",
        join(__dirname, '../server', 'index'),
    ]
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
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'server'),
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