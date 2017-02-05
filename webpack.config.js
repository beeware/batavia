var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "batavia": "./batavia/batavia.js",
        "batavia.min": "./batavia/batavia.js"
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, './dist'),
        filename: "[name].js",
        library: 'batavia',
        libraryTarget: 'umd'
    },
    target: 'web',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ],
    module: {
        // preLoaders: [
        //     {
        //         test: /\.js$/,
        //         loader: 'eslint',
        //         exclude: /node_modules/,
        //     }
        // ],
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                include: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
    // eslint: {
    //     configFile: './.eslintrc',
    //     failOnWarning: false,
    //     failOnError: true
    // }
}