// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import Qs from 'qs'
import { BASE_URL } from './config.js'
import 'cropperjs/dist/cropper.css'

// echarts
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
Vue.prototype.$echarts = echarts

// axios.defaults.headers.put['Content-Type'] = 'multipart/form-data'
let instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
})
instance.interceptors.request.use(function (config) {
  let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
  if (config.url.indexOf('signin') !== -1) {
    return config
  }
  userInfo.loginTime = new Date().getTime()
  window.localStorage.setItem('userInfo', Qs.stringify(userInfo))
  let [name, password] = ['', '']
  if (userInfo.type === 'admin') {
    name = 'admin_name'
    password = 'admin_password'
  } else if (userInfo.type === 'user') {
    name = 'merchant_email'
    password = 'merchant_password'
  } else {
    alert('Unknown Role Type')
  }
  if (config.method === 'post') {
    config.data.append(name, userInfo.name)
    config.data.append(password, userInfo.password)
  } else {
    if (config.params) {
      config.params[name] = userInfo.name
      config.params[password] = userInfo.password
    } else {
      config.params = {}
      config.params[name] = userInfo.name
      config.params[password] = userInfo.password
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

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
