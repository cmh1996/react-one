const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.jsx'),
    // 将 第三方依赖 单独打包
    vendor: [
      'react', 
      'react-dom',
      "react-router-dom", 
      "socket.io-client", 
      'es6-promise', 
      'whatwg-fetch',
      "utf8",
      "base-64",
      "jsonp",
      "jsonwebtoken",
      "mobx",
      "mobx-react",
      "react-addons-pure-render-mixin",
    ]
  },

  output: {
        path: __dirname + "/build",
        filename: '[name].[hash:8].bundle.js',
        chunkFilename: '[name]-[id].[hash:8].bundle.js',
  },

  resolve:{
      extensions:['.js','.jsx']
  },

  module: {
      rules:[
          { 
              test: /\.(js|jsx)$/, 
              exclude: /node_modules/, 
              use: {loader:'babel-loader'}
          },
          { 
              test: /\.less$/, 
              exclude: /node_modules/, 
              use:ExtractTextPlugin.extract({
                use:['css-loader','postcss-loader','less-loader'],
                fallback:'style-loader'
              })
          },
          { 
              test: /\.css$/, 
              exclude: /(node_modules)/, 
              use:ExtractTextPlugin.extract({
                use:['css-loader','postcss-loader'],
                fallback:'style-loader'
              })
          },
          { 
              test:/\.(png|gif|jpg|jpeg|bmp)$/i, 
              loader:'url-loader?limit=5000' 
          }, 
          { 
              test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
               loader:'url-loader?limit=5000'
           }
      ]
  },

  plugins: [
    //Bundle大小分析界面
    new BundleAnalyzerPlugin(),
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by chambers1996@foxmail.com."),
    // html 模板插件
    new HtmlWebpackPlugin({
        template: __dirname + '/src/index.tmpl.html'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV || 'production')
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].[hash:8].js',
      minChunks:Infinity,
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),
    
    new webpack.optimize.UglifyJsPlugin({
        uglifyOptions:{
          ie8:false,
          output:{
            comments:false,
            beautify:false
          },
          mangle:{
            keep_fnames:true
          },
          compress: {
            drop_console:true,
            warnings: false
          }
        }
    }),
    
    // 分离CSS和JS文件
    new ExtractTextPlugin({
      filename:'[name].[hash:8].css',
      allChunks:true,
      ignoreOrder:true
    }), 

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
  ]
}