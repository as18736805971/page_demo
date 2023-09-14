const { defineConfig } = require('@vue/cli-service')
const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const CopyWebpackPlugin = require('copy-webpack-plugin')

const Timestamp = new Date().getTime()

module.exports = defineConfig({
  publicPath: '/',                  // 部署应用包时的基本 URL /admin 打包后文件路径会增加/admin
  outputDir: 'dist',                // build 时生成的生产环境构建文件的目录
  assetsDir: 'static',              // build 时放置生成的静态资源 (js、css、img、fonts)目录
  indexPath: 'index.html',          // build 时指定生成的 index.html 的输出路径
  transpileDependencies: true,      // 忽略所有 node_modules 中的文件
  lintOnSave: false,                // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  productionSourceMap: false,
  configureWebpack: {
    name: '演示项目',                 // 页面名称
    resolve: {
      alias: {
        '@': resolve('src')      // 文件快捷路径
      }
    },
    output: {
      filename: 'static/js/[name].' + Timestamp + '.js',
      chunkFilename: 'static/js/[name].' + Timestamp + '.js'
    }
  }
})
