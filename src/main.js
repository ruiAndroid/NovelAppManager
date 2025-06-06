import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'

window.global = window

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 设置默认配置
axios.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:8080`
axios.defaults.timeout = 10000

app.mount('#app') 