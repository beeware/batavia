var path = require('path')
var webpack = require('webpack')

var cachingDisabled = process.env.DISABLE_WEBPACK_CACHE !== undefined

var javascriptLoaders = [{ loader: 'cache-loader' }, { loader: 'babel-loader' }]

if (cachingDisabled) {
    console.log('Caching is disabled.')
    javascriptLoaders.shift()
} else {
    console.log('Caching is enabled.')
}

// exports file
module.exports = {
    entry: {
        'batavia': './batavia/batavia.js'
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        library: 'batavia',
        libraryTarget: 'umd'
    },
    target: 'web',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: { symlinks: false },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: javascriptLoaders,
                exclude: '/node_modules/'
            }
        ]
    }
}
