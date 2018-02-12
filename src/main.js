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
instance.interceptors.request.use(function (config) {
  let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
  if (config.method === 'post') {
    config.data.append('admin_name', userInfo.name)
    config.data.append('admin_password', userInfo.password)
  } else {
    if (config.params) {
      config.params['admin_name'] = userInfo.name
      config.params['admin_password'] = userInfo.password
    } else {
      config.params = {
        admin_name: userInfo.name,
        admin_password: userInfo.password
      }
    }
  }
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
