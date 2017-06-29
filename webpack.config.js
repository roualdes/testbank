const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');
const defaultInclude = [ SRC_DIR ];
const env = process.env.NODE_ENV || 'development';

const webpackConfig = {
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
}

if (env === 'production') {
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    })
  )
}

module.exports = webpackConfig;
