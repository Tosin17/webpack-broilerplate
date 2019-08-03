const path = require('path');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    mode: 'development',
    // You should comment this out if you intend running webpack in watch mode
    devServer: {
        // Serve files from dist
        contentBase: 'dist'
    },
    resolve: {
        extensions: ['.ts', '.js']
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
                    // Injects css into html files as a page level css --> Good only for dev. env.
                    { loader: 'style-loader' },
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
    // Plugins affect every file within your module
    plugins: [
        // new BundleAnalyzer()
    ]
}