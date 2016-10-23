const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: 'app.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist/example')
  },
  resolve: {
    root: __dirname,
    extensions: ['', '.ts', '.js', '.json']
  },
  resolveLoader: {
    modulesDirectories: ["node_modules"]
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      inject: 'body'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader' },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(html|json)$/,
        exclude: /node_modules/,
        loader: 'raw'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: '\.jpg$',
        exclude: /node_modules/,
        loader: 'file'
      },
      {
        test: '\.png$',
        exclude: /node_modules/,
        loader: 'url'
      }
    ]
  }
}