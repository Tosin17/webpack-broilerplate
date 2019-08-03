const path = require('path');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: {
        // Path in entry are always relative paths towards where webpack is run from
        // main can also point to mulitiple locations in an array ['./location1', './location2]
        // NOTE! `babel-polyfill` is an npm package. Also it has to be loaded in the browser before your code
        // IMPORTANT! Instead of importing the whole `babel-polyfill` lib, you can import only the polyfill you need
        // E.g `core-js/fn/promise`,, assuming that's what you are using
        main: ['babel-polyfill', './src/index.ts']
    },
    output: {
        // [name] resolves to `main`
        filename: '[name]-bundle.js',
        // Path in output always has to be absolute
        path: path.resolve(__dirname, 'dist'),
        // `/` is good for how `main-bundle.js` is used in our index.html
        // If we used it as `js/main-bundle.js`, then publicPath will be `/js`
        publicPath: '/',
    },
    mode: 'production',
    devServer: {
        // Serve files from dist
        contentBase: 'dist'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    // Separate vendor code like Angular, React, Lodash etc from your app.js which changes frequently.
    // Cache vender code
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    // Within the modules apply the following rules to manipulate the files
    module: {
        // We can have many rules, hence an array of object literal configs.
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader'],
                exclude: /node_modules/
            },
            {
                // CSS Loading Rule
                // IMPORTANT! Don't quote your regex. /\.scss$/ !== '/\.scss$/'
                test: /\.scss$/,
                // Note the order of the loaders: sass-loader` --> `css-loader` --> `style-loader`
                use: [
                    // Extracts css from each module and merge into single separate file
                    { loader: MiniCssExtractPlugin.loader },
                    // Load css files
                    { loader: 'css-loader' },
                    // Add browser prefixes for cross-browser issues -- Uses Autoprefixer (See postcss.config.js)
                    { loader: 'postcss-loader' },
                    // Convert sass files to css using `node-sass` -- be sure to install `node-sass`
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    // Loads extracted html string as a separate file and using the same html file name
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].html'
                        }
                    },
                    // Extracts html as a string
                    { loader: 'extract-loader' },
                    // Load and parses html file
                    {
                        loader: 'html-loader',
                        options: {
                            // Watch out for images and use appropriate loader
                            attrs: ['img:src']
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                // For images, USE the config below
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // Create directory `images` and name image
                            // E.g 'images/[name]-[hash].[ext]' - directory/imageName-hash.imageExtension
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    // Loaders are effective on 1 file at a time, while plugins affect the whole bundle
    plugins: [
        // Minimises and removes duplicate css from extracted files
        new OptimizeCssAssetsPlugin(),
        // Extracts css from each module and merge into single separate file. 
        // It creates a css folder and puts the file there
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash].css'
        }),
        // Make env. var available within modules, so that libraries within our modules can access env var
        // And strip off there extra load
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        // Uglify / mangle your JS
        new UglifyJSPlugin(),
        // Gzip the files loaded by webpack
        new CompressionPlugin({
            algorithm: 'brotliCompress',
        })
    ]
}