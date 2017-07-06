const webpack = require('webpack');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'app': [
      'react-hot-loader/patch',
      './src/index.jsx'
    ]
  },
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/,
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
