// 引入vue-i18n组件
import { createI18n } from 'vue-i18n'
import messages from './lang'

// 注册i8n实例并引入语言文件
const localeData = {
  legacy: false, // composition API
  locale: 'zh_CN',
  messages,
  globalInjection: true
}

// setup i18n instance with glob
export default createI18n(localeData)
