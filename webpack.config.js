var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var cachingDisabled = process.env.DISABLE_WEBPACK_CACHE !== undefined;

var javascriptLoaders = [{ loader: 'cache-loader' }, { loader: 'babel-loader' }];

if (cachingDisabled) {
    console.log('Caching is disabled.');
    javascriptLoaders.shift()
} else {
    console.log('Caching is enabled.')
}

var commonConfig = merge([
    {
        entry: {
            'batavia': './batavia/batavia.js'
        },
        output: {
            path: path.join(__dirname, './dist'),
            filename: '[name].js',
            library: 'batavia',
            libraryTarget: 'umd',
            globalObject: "typeof self !== 'undefined' ? self : this" // Workaround for webpack issue #6526
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        target: 'web',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        resolve: {symlinks: false},
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
]);

var productionConfig = merge([
    {
        output: {
            sourceMapFilename: '[name].js.map'
        },
        devtool: 'eval-source-map'
    }
]);
var developmentConfig = merge([
    {
        entry: {
            'codemirror': [
                './node_modules/codemirror/lib/codemirror.js',
                './node_modules/codemirror/lib/codemirror.css',
                './node_modules/codemirror/mode/python/python.js'
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        'css-loader'
                    ]
                }
            ]
        }
    }
]);

module.exports = function(env, argv) {

    var config =
        argv.mode === "production" ? productionConfig : developmentConfig;

    return merge([commonConfig, config]);
};
