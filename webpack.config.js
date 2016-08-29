const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/ticker.jsx',
  // entry: [
  //   'webpack-dev-server/client?http://localhost:3000',
  //   'webpack/hot/only-dev-server',
  //   './src/ticker.jsx'
  // ],
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
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src')
        // query: {
        //   presets: ['es2015', 'react']
        // }
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
