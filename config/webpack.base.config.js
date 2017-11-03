var path = require('path')
var glob = require('glob')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HTMLWebpackPlugin = require('html-webpack-plugin')
var autoprefixer = require('autoprefixer')

var extractCSSPlugin = new ExtractTextPlugin('css/[name].[contenthash:6].CSSStyles.css') // 分离 CSS 文件
var extractLessPlugin = new ExtractTextPlugin('css/[name].[contenthash:6].LessStyles.css') // 分离 less 文件

// 因为是多页应用，所以需要根据页面的个数配置入口和模板数
var htmlTemplates = [], entries = {}
var pages = glob.sync('../src/containers/*/', { cwd: __dirname })
pages.forEach((page) => {
  var chunkName = path.basename(page) // 获取containers里面的每个页面的文件夹名称(即模块名称)
  // 配置各个单页的 html-webpack-plugin
  var htmlTemplate = new HTMLWebpackPlugin({
    template: path.resolve(__dirname, '../src/template.html'),
    chunks: ['vendor', chunkName],
    filename: `${chunkName}.html`
  })
  htmlTemplates.push(htmlTemplate)
  // 配置各个单页的入口
  entries[chunkName] = path.resolve(__dirname, page)
})
entries.vendor = ['babel-polyfill', 'react', 'react-dom', 'store', 'prop-types'] // 配置公共 chunk

module.exports = {
  // 打包入口
  entry: entries,
  // 打包输出配置
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name].[hash:6].js'
  },
  // 模块解析配置
  resolve: {
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      assets: path.resolve(__dirname, '../src/assets'),
      pages: path.resolve(__dirname, '../src/containers')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  // loaders
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader?cacheDirectory'
      }, 
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: extractCSSPlugin.extract({
          fallback: 'style-loader?singleton',
          use: [
            'css-loader?minimize',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()]
              }
            }
          ]
        })
      }, 
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: extractLessPlugin.extract({
          fallback: 'style-loader?singleton',
          use: [
            'css-loader?minimize',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer()]
              }
            },
            'less-loader'
          ]
        })
      }, 
      {
        test: /\.(jpeg|jpg|png|bmp|gif|ico)$/,
        exclude: /node_modules/,
        use: 'url-loader?limit=1000&name=assets/imgs/[name].[hash:8].[ext]&publicPath=/'
      }, 
      {
        test: /\.(woff|woff2|svg|ttf|eot)$/,
        exclude: /node_modules/,
        use: 'url-loader?limit=1000&name=assets/fonts/[name].[hash:8].[ext]&publicPath=/'
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: { loader: 'html-loader', options: {minimize: true, attrs: ['img:src', 'link:href']} }
      }
    ]
  },
  // plugins
  plugins: [
    extractCSSPlugin, // CSS 文件分离出的样式
    extractLessPlugin, // less 文件分离出的样式
    ...htmlTemplates, // HTML 模板引入
    new webpack.BannerPlugin('copyright by ArthurTsang1@github.com'), // 打包后的文件头部加上 banner
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(process.env.NODE_ENV), // 定义自己代码中方便使用的环境变量
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) // 定义库所依赖的环境变量
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(), // webpack3 的一个优化插件，可提升运行性能，如果不是webpack3，则注释掉这个插件
    new webpack.optimize.CommonsChunkPlugin({ // 提取公共 chunk
      name: 'vendor',
      minChunks: Infinity
    })
  ],
  // watch: true, // 设置为 true 后，build 时每当文件变化，就会立刻自动打包更新的部分
  devtool: 'cheap-module-source-map' // 开启 source map
}
