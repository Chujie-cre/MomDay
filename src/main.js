import './assets/main.css'
import 'animate.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'

// 导入页面组件
import Home from './htmlview/Home.vue'
import Celebration from './htmlview/Celebration.vue'

// 创建路由
const routes = [
  { path: '/', component: Home },
  { path: '/celebration', component: Celebration }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 创建应用并挂载
const app = createApp(App)
app.use(router)
app.mount('#app')
