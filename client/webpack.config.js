const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
                use:[{
                    loader:'style-loader'
                },{
                    loader:'css-loader',
                },{
                    loader:'postcss-loader'
                },{
                    loader:'less-loader'
                }]
            },
            { 
                test: /\.css$/, 
                exclude: /(node_modules)/, 
                use:[{
                    loader:'style-loader'
                },{
                    loader:'css-loader',
                },{
                    loader:'postcss-loader'
                }]
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
        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.tmpl.html'
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
          name: ['vendor'],
          filename: '[name].[hash:8].js',
          minChunks:Infinity,
        }),

        /*new webpack.optimize.CommonsChunkPlugin({
          children:true,
          async:true,
          minChunks:3,
        }),*/

        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV === 'dev') || 'true'))
        })
    ],

    devServer: {
        proxy: {
            '/api': {
                target: "http://localhost:3000",
                secure: false,
                changeOrigin: true
            },
            '/privateApi': {
                target: "http://localhost:3000",
                secure: true,
                changeOrigin: true
            }
        },
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        hot: true  // 使用热加载插件 HotModuleReplacementPlugin
    }
}
