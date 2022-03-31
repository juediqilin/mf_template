const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './package.json'), 'utf-8'))
const files = require('./loadFile')(`./src/${config.name}Views`, {})

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    plugins: [
      new webpack.container.ModuleFederationPlugin({
        name: 'app',
        filename: 'remoteEntry.js',
        exposes: {
          ...files
        },
        remotes: {},
        shared: {
          vue: {
            singleton: true
          },
          vuex: {
            singleton: true
          },
          'vue-router': {
            singleton: true
          }
        }
      })
    ]
  },
  chainWebpack (config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})
