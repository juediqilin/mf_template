import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'reset.scss/reset.scss'
import './styles/index.scss'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import 'element-plus/theme-chalk/index.css'

// 时间格式化
import dayjs from 'dayjs'

// 国际化
import i18n from './i18n'

// 自定义指令
import directives from './directives'

const app = createApp(App).use(store).use(router)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale
})

// 添加插件
app.use(directives)
app.use(i18n)

// 全局变量添加
app.config.globalProperties.$moment = dayjs

app.mount('#app')
