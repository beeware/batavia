var webpack = require('webpack');

module.exports = {
    entry: {
        "batavia": "./batavia/batavia.js",
        "batavia.min": "./batavia/batavia.js"
    },
    devtool: 'source-map',
    output: {
        path: __dirname,
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
            }
        ]
    },
    // eslint: {
    //     configFile: './.eslintrc',
    //     failOnWarning: false,
    //     failOnError: true
    // }
}