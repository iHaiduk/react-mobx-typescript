const {join, resolve} = require('path');
const webpack = require('webpack');
const vendorScripts = require("./vendor.scripts").default;
const aliases = require("./webpack.frontend.aliases").default;

const entry = process.env.TEMP_NAME ? {bundle: process.env.TEMP_NAME} : {
    bundle: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        join(__dirname, '..', 'client', 'index.tsx')
    ],
    vendor: vendorScripts,
    // style: './styles/index.ts',
};

function isVendor({ resource }) {
    return resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/);
}

module.exports = {
    devtool: 'sourcemap',
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
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'src')
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor,
            filename: 'vendor.js'
        })
    ],
    devServer: {
        hot: true,
        proxy: {
            '*': 'http://0.0.0.0:' + (process.env.PORT || 1337),
            ws: true
        },

        contentBase: resolve(__dirname, 'dist', 'public'),
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
