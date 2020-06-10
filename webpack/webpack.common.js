const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    demo: Path.resolve(__dirname, '../demos/demo.js'),
    OLATS: Path.resolve(__dirname,'../src/OLATS.js'),
    OLATSPlayer: Path.resolve(__dirname,'../src/OLATSPlayer.js'),
    OLATSPlayerUI: Path.resolve(__dirname,'../src/OLATSPlayerUI.js'),
    
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  optimization: {
    splitChunks: false
  },
  plugins: [
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
      {
        test: /worklet\.js$/,
        use: { loader: 'worklet-loader' }
      }
    ],
    
  }
};
