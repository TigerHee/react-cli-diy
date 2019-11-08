const webpack = require('webpack');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins:[
    //每次打包前删除清空dist
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('PROD')
    })
  ]
})