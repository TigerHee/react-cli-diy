# react-cli-diy

从0开始构建一个自己的React脚手架

## 项目使用：
```
git clone git@github.com:TigerHee/react-cli-diy.git

cd react-cli-diy

npm install

开发模式启动：
npm run dev

生产打包：
npm run build
```
## 实现步骤：

首先在新建一个项目目录，在此目录内执行`npm init`初始化项目环境。

创建webpack配置文件：

 - webpack.config.js  //公共配置
 - webpack.prod.js    //生产环境配置
 - webpack.dev.js     //开发环境配置

创建public目录存放html模版文件。

创建src目录存放前端项目所需资源。

安装webpack相关依赖：

`npm i webpack webpack-cli webpack-merge -D`

修改webpack.config.js文件：
```
module.exports = {
  entry: './src/index.js',  // 入口
  output: {                 // 出口
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
}
```
使用webpack-merge包merge公共配置文件分别到生产和开发配置文件：

```
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')

module.exports = merge(baseConfig, {
  // 各自单独的配置
})
```

安装本地服务及使用html模版相关依赖：

`npm i webpack-dev-server html-webpack-plugin -D`

公共配置内使用`html-webpack-plugin`来使用index.html模版：

```
plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    hash: true,                       // 添加hash值解决缓存问题
    minify: {                         // 对打包的html模板进行压缩
      removeAttributeQuotes: true,    // 删除属性双引号
      collapseWhitespace: true        // 折叠空行变成一行
    }
  }),
]
```
开发模式需要使用到开发服务器：

```
devServer: { // 内置开发服务器配置
  port: 3000,
  progress: true,
  contentBase: './dist',
  open: true,
  proxy: {
    //设置开发时接口代理地址
  }
},
```

配置好上诉基本配置之后在`package.json`内设置启动脚本：

```
"scripts": {
  "build": "webpack  --config webpack.prod.js",
  "dev": "webpack-dev-server --config webpack.dev.js"
},
```

接下来在公共配置里设置处理css与less：

```
rules:[
  {
    test: /\.(css|less)$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'less-loader'
    ]
  },
]
```
postcss-loader处理兼容前缀需要一个单独的配置文件postcss.config.js。

如上述配置处理css的话，样式文件被插入到html模版内，我们想抽离css文件，通过link方式引入：

`npm i mini-css-extract-plugin -D`

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

{
  module:{
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css',
    }),
  ]
}
```

此时在执行`npm run build`的时候发现，每次打包上次的打包结果都沉积在哪里需要先清除：

`npm i clean-webpack-plugin -D`

修改生产环境配置：

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins:[
  //每次打包前删除清空dist
  new CleanWebpackPlugin(),
]

```

用了`mini-css-extract-plugin`抽离css为link需使用`optimize-css-assets-webpack-plugin`进行压缩css,使用此方法压缩了css需要`uglifyjs-webpack-plugin`压缩js：

`npm i optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D`

```
optimization: {              // 优化项
  minimizer: [
    new UglifyJsPlugin({     // 优化js
      cache: true,           // 是否缓存
      parallel: true,        // 是否并发打包
    }),
    new OptimizeCSSAssetsPlugin({})    // css 的优化
  ]
},
```

在公共配置里设置处理js与jsx：

`npm i babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D`

再加上React的babel：

`npm i @babel/preset-react -D`

```
{
  test: /\.(js|jsx)$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ],
      plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
      ]
    }
  },
  exclude: /node_modules/
},
```

项目添加React相关依赖：

`npm i react react-dom -S`

在index.js内书写React代码，嗯~~~，可以运行。

再在公共配置里加上图片处理：

`npm i file-loader url-loader -D`

```
{
  test: /\.(png|jpg|gif)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 200 * 1024,          // 小于200k变成base64
    }
  }
}
```
在less内加个background-image试试，ok。

开发模式需要监听更改热更新：

```
watch: true,
watchOptions: {
  poll: 1000,              // 每秒监听1000次
  aggregateTimeout: 300,   // 防抖，当第一个文件更改，会在重新构建前增加延迟
  ignored: /node_modules/  // 可以排除一些巨大的文件夹，
},
```

最后`npm run build`和`npm run dev`都可以完美运行了，脚手架构建成功。