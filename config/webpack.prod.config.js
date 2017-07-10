var path = require('path')
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

var commonConfig = require('./webpack.base.config')

var plugins = [
  new ParallelUglifyPlugin({    // 最紧凑的输出
    cacheDir: path.resolve(__dirname, '../uglifyCache'),
    uglifyJS: {
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }
  })
]

var prodConfig = {
  plugins: [...plugins, ...commonConfig.plugins]
}

var config = Object.assign(
  {},
  commonConfig,
  prodConfig
)

module.exports = config