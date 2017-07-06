const webpack = require('webpack');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    'app': [
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
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
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
