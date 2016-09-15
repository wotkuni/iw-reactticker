const path = require('path');
const src = path.join(__dirname, 'src/');
const webpack = require('webpack');

module.exports = {
  entry: './src/app.jsx',
  output: {
    path: './dist',
    filename: 'ticker.min.js'
  },
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: src
      }
    ]
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // }),
  ]
};
