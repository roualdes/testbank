const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');
const defaultInclude = [ SRC_DIR ];

module.exports = {
  devtool: 'source-map',
  entry: {
    'app': [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/index.js'
    ]
  },
  output: {
      path: OUTPUT_DIR,
      publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.css$/, use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
        }), include: defaultInclude },
        { test: /\.less$/, use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                { loader: 'css-loader', options: { modules: true } },
                { loader: 'less-loader' }
            ]
        }), include: defaultInclude },
        { test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&' +
                  'includePaths[]=' +
                (encodeURIComponent(
                    path.resolve(process.cwd(), './node_modules'))
                ) +
                  '&includePaths[]=' +
               (encodeURIComponent(
                   path.resolve( process.cwd(),
                                 './node_modules/grommet/node_modules'))
               ) },
        { test: /\.yaml$/,
          include: path.resolve(process.cwd(), './data'),
          loader: 'yaml-loader',
        }
    ]
  },
    target: 'electron-renderer',
    devServer: {
        contentBase: OUTPUT_DIR,
        stats: {
            colors: true,
            chunks: false,
            children: false
        }
    }
};
