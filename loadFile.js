const fs = require('fs')
let str = ''
const files = {}
/**
* @name  loadFile
* @description  用于读取需要导出的指定目录文件
* @param path  目录地址
* */
module.exports = function loadFile (path) {
  const dir = fs.readdirSync(path)
  str = str || path
  dir.forEach(d => {
    if (!/\.vue$/.test(d)) {
      loadFile(`${path}/${d}`, files)
    } else {
      files[`.${path}/${d}`.replace(str, '')] = `${path}/${d}`
    }
  })
  return files
}
