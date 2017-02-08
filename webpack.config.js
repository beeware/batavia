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
            include: /\.min\.js$/
            // minimize: true,
            // sourceMap: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
}