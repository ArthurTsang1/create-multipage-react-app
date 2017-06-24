var path = require('path')
var webpack = require('webpack')

var commonConfig = require('./webpack.base.config')

var plugins = [
  new webpack.HotModuleReplacementPlugin() // dev-server 的模块热更新插件
]

var devServer = {
  historyApiFallback: true,
  hot: true, // 模块热更新
  stats: 'errors-only', // 只在报错时输出信息
  contentBase: path.resolve(__dirname, '../build'), // dev-server 根目录
  compress: true, // 开启 gzip 压缩,
  inline: true, // 是否以在页面直接插入代码的形式启动dev-server
  port: 8080,
  overlay: { // 当有编译错误或者警告的时候显示一个全屏 overlay
    errors: true,
    warnings: true
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      secure: false
    }
  }
}

var devConfig = {
  devServer,
  plugins: [...commonConfig.plugins, ...plugins]
}

var config = Object.assign(
  {},
  commonConfig,
  devConfig
)

module.exports = config