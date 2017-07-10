var express = require('express')
var app = express()
var router = require('./routers')
var path = require('path')
var bodyParser = require('body-parser')

// 配置静态资源
app.use('/static', express.static(path.resolve(__dirname, '../assets')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// 配置路由
router(app)

// 启动服务
app.listen(3000, function () {
  console.log('Express is listening port 3000')
})