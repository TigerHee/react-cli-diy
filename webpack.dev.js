const webpack = require('webpack');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: { // 内置开发服务器配置
    port: 3000,
    progress: true,
    contentBase: './dist',
    open: true,
    proxy: {
      //设置开发时接口代理地址
    }
  },
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    poll: 1000,              // 每秒监听1000次
    aggregateTimeout: 300,   // 防抖，当第一个文件更改，会在重新构建前增加延迟
    ignored: /node_modules/  // 排除一些巨大的文件夹，
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('DEV')
    })
  ]
})