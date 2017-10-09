const {join, resolve} = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const vendorScripts = require("./vendor.scripts").default;
const aliases = require("./webpack.frontend.aliases").default;

const entry = process.env.TEMP_NAME ? {bundle: process.env.TEMP_NAME} : {
    bundle: [
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
                test: /\.ts(x?)$/,
                use: [
                    {loader: 'awesome-typescript-loader'}
                ],
                include: [
                    resolve(__dirname, '..', 'client'),
                    resolve(__dirname, '..', 'store'),
                    resolve(__dirname, '..', 'src'),
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
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor,
            filename: '[name].[chunkhash:4].js'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('production')
            }
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
