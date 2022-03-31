const path = require('path')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'))

// 路由 应用联邦名 页面路径名称
// 修改应用名称
module.exports = function updateAppName () {
  fs.rename('../src/views', `../src/${config.name}Views`, () => {})
  fs.readFile('../src/router/index.js', 'utf-8', (err, s) => {
    if (err) {
      return
    }
    fs.writeFileSync('../src/router/index.js', s.replace(/\/views\//g, `/${config.name}Views/`))
  })
  fs.readFile('../src/vue.config.js', 'utf-8', (err, s) => {
    if (err) {
      return
    }
    fs.writeFileSync('../src/vue.config.js', s.replace(/name:.+/, `name: '${config.name}'`))
  })
}
