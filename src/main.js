// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import Qs from 'qs'
import { BASE_URL } from './config.js'

let instance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000
})
// 496997374@qq.com
// .data.get('name')
instance.interceptors.request.use(function (config) {
  console.log('config', config)
  let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
  // TODO 发送get请求时，这里会报错
  config.data.append('admin_name', userInfo.name)
  config.data.append('admin_password', userInfo.password)
  return config
}, function (error) {
  return Promise.reject(error)
})
instance.interceptors.response.use(function (res) {
  return res
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$axios = instance

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
