import 'normalize.css'
import 'font-awesome/scss/font-awesome.scss'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import '../theme/index.css'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'

import App from './App'
import VueCodeMirror from 'vue-codemirror'
import axios from './http'
// 引入echarts
import echarts from 'echarts'
import  'echarts/theme/shine.js'

// 全局挂载axios
Vue.prototype.$axios = axios

Vue.prototype.$echarts = echarts

Vue.use(ElementUI)

Vue.use(VueCodeMirror)

Vue.config.productionTip = false

Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  ...App,
}).$mount('#app')