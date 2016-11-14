var webpack = require('webpack');

module.exports = {
    entry: {
        "batavia": "./batavia/batavia.js",
        "batavia.min": "./batavia/batavia.js"
    },
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
    // module: {
    //     loaders: [
    //         { test: /\.css$/, loader: "style!css" }
    //     ]
    // }
};