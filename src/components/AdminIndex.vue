<template>
  <div>
    <button id="test">test</button>
    <div class="map" id="map"></div>
    <el-row :gutter="20">
      <el-col :md="24" :lg="10">
        <div class="pie-warpper" id="pieChart"></div>
      </el-col>
      <el-col :md="24" :lg="14">
        <div class="bar-warpper" id="barChart"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="date-picker-warpper">
          <div class="date-picker">
            <el-date-picker
              v-model="week"
              :editable="false"
              :clearable="false"
              @change="weekChangeHandler"
              type="week"
              size="small"
              align="right"
              format="yyyy 第 WW 周"
              placeholder="选择周">
            </el-date-picker>
          </div>
          <div class="day-warpper" id="dayChart"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="date-picker-warpper">
          <div class="date-picker">
            <el-date-picker
              v-model="year"
              :editable="false"
              :clearable="false"
              @change="yearChangeHandler"
              type="year"
              size="small"
              align="right"
              placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="month-warpper" id="monthChart"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { throttle } from 'lodash'
import axios from 'axios'
import { GOOGLE_BASE_URL } from '../config.js'
export default {
  name: 'AdminIndex',
  data () {
    return {
      myPieChart: null,
      myBarChart: null,
      myDayChart: null,
      myMonthChart: null,
      week: new Date(),
      year: new Date()
    }
  },
  computed: {
    weekStart: function () {
      let hours = this.week.getHours()
      let minutes = this.week.getMinutes()
      let seconds = this.week.getSeconds()
      let milliseconds = this.week.getMilliseconds()
      let day = this.week.getDay()
      if (day === 0) { day = 7 }
      day -= 1
      return new Date(this.week.getTime() - day * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000 - milliseconds)
    },
    yearStart: function () {
      return new Date(this.year.getFullYear(), 0, 1)
    }
  },
  mounted () {
    function initMap () {
      let center = {lat: 30.5256640607, lng: 104.0731328591}
      let map = new window.google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 16
      })
      let infoWindow = new window.google.maps.InfoWindow({map: map})
      let marker = new window.google.maps.Marker({
        position: center,
        map: map
      })
      map.addListener('click', function (e) {
        let latLng = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
        marker.setPosition(latLng)
        let latlng = e.latLng.lat() + ',' + e.latLng.lng()
        axios.get(GOOGLE_BASE_URL, {
          params: {
            latlng: latlng
          }
        }).then(function (res) {
          if (res.data.results.length !== 0) {
            infoWindow.open(marker.get('map'), marker)
            infoWindow.setContent(res.data.results[0].formatted_address)
            map.panTo(latLng)
          } else {
            infoWindow.open(marker.get('map'), marker)
            infoWindow.setContent('Location not found.')
          }
        }).catch(function (error) {
          console.log(error)
        })
      })
      document.getElementById('test').addEventListener('click', function () {
        axios.get(GOOGLE_BASE_URL, {
          params: {
            address: '成都'
          }
        }).then(function (res) {
          console.log(res.data)
          if (res.data.results.length !== 0) {
            let latLng = {
              lat: res.data.results[0].geometry.location.lat,
              lng: res.data.results[0].geometry.location.lng
            }
            marker.setPosition(latLng)
            infoWindow.open(marker.get('map'), marker)
            infoWindow.setContent(JSON.stringify(latLng))
            map.panTo(latLng)
          }
        }).catch(function (error) {
          console.log(error)
        })
      }, false)
    }
    /* var infoWindow = new window.google.maps.InfoWindow({map: map})
     if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
     var pos = {
     lat: position.coords.latitude,
     lng: position.coords.longitude
     }
     infoWindow.setPosition(pos)
     infoWindow.setContent('Location found.')
     // map.setCenter(pos)
     }, function (error) {
     console.log('Error: The Geolocation service failed.')
     switch (error.code) {
     case error.PERMISSION_DENIED:
     console.log('用户拒绝对获取地理位置的请求')
     break
     case error.POSITION_UNAVAILABLE:
     console.log('位置信息是不可用的')
     break
     case error.TIMEOUT:
     console.log('请求用户地理位置超时')
     break
     case error.UNKNOWN_ERROR:
     console.log('未知错误')
     break
     }
     })
     } else {
     console.log('Error: Your browser doesn\'t support geolocation.')
     } */
    /* function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    } */
    initMap()
    window.addEventListener('resize', this.resizeHandler, false)
    this.initPieChart()
    this.initBarChart()
    this.initDayChart()
    this.initMonthChart()
    this.getDetail()
    this.getDay()
    this.getMonth()
  },
  beforeDestroy () {
    if (this.myPieChart) {
      this.myPieChart.dispose()
    }
    if (this.myBarChart) {
      this.myBarChart.dispose()
    }
    if (this.myDayChart) {
      this.myDayChart.dispose()
    }
    if (this.myMonthChart) {
      this.myMonthChart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler, false)
    this.myBarChart = null
    this.myPieChart = null
    this.myDayChart = null
    this.myMonthChart = null
  },
  methods: {
    resizeHandler: throttle.call(this, function () {
      if (this.myBarChart) {
        this.myBarChart.resize({width: 'auto'})
      }
      if (this.myPieChart) {
        this.myPieChart.resize({width: 'auto'})
      }
      if (this.myDayChart) {
        this.myDayChart.resize({width: 'auto'})
      }
      if (this.myMonthChart) {
        this.myMonthChart.resize({width: 'auto'})
      }
    }, 200),
    weekChangeHandler (date) {
      this.getDay()
    },
    yearChangeHandler (date) {
      this.getMonth()
    },
    initPieChart () {
      this.myPieChart = this.$echarts.init(document.getElementById('pieChart'))
      this.myPieChart.setOption({
        title: {
          text: '注册类型用户统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: ['facebook用户', '手机号码用户', 'email用户']
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              {value: 0, name: 'facebook用户'},
              {value: 0, name: '手机号码用户'},
              {value: 0, name: 'email用户'}
            ]
          }
        ]
      })
    },
    initBarChart () {
      this.myBarChart = this.$echarts.init(document.getElementById('barChart'))
      this.myBarChart.setOption({
        title: {
          text: '各项指标统计',
          x: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['用户总数', '商家总数', '商品总数', '商品点击量', '轮播图点击量', '新闻总数', '新闻点击量']
        },
        yAxis: {},
        series: [{
          name: '统计',
          type: 'bar'
        }]
      })
    },
    initDayChart () {
      let {markPoint, markLine} = {
        markPoint: {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        }
      }
      this.myDayChart = this.$echarts.init(document.getElementById('dayChart'))
      this.myDayChart.setOption({
        title: {
          text: '日统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: 4,
          data: ['活跃用户', '新增用户']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisTick: {show: false},
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: '活跃用户',
            type: 'bar',
            barGap: 0,
            markPoint: markPoint,
            markLine: markLine
          },
          {
            name: '新增用户',
            type: 'bar',
            markPoint: markPoint,
            markLine: markLine
          }
        ]
      })
    },
    initMonthChart () {
      this.myMonthChart = this.$echarts.init(document.getElementById('monthChart'))
      this.myMonthChart.setOption({
        title: {
          text: '活跃用户数统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '月活跃用户数',
            type: 'line',
            stack: '总量'
          }
        ]
      })
    },
    getDetail () {
      this.$axios.get('/homepage/admin', {
        params: {
          type: 1
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          let hp = res.data.data.homepage
          this.myPieChart.setOption({
            series: [{
              data: [
                {value: hp.signup_facebook, name: 'facebook用户'},
                {value: hp.signup_phone, name: '手机号码用户'},
                {value: hp.signup_email, name: 'email用户'}
              ]
            }]
          })
          this.myBarChart.setOption({
            series: [{
              data: [
                {label: {show: true}, value: hp.user_total},
                {label: {show: true}, value: hp.merchant_total},
                {label: {show: true}, value: hp.commodity_total},
                hp.commodity_clicks,
                hp.advertise_clicks,
                {label: {show: true}, value: hp.news_total},
                hp.news_clicks
              ]
            }]
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    getDay () {
      this.myDayChart.showLoading()
      let start = this.weekStart.getTime()
      let end = start + 7 * 24 * 60 * 60 * 1000
      this.$axios.get('/homepage/admin', {
        params: {
          type: 2,
          start_time: parseInt(start / 1000),
          end_time: parseInt(end / 1000) - 1
        }
      }).then(res => {
        this.myDayChart.hideLoading()
        if (parseInt(res.data.code) === 200) {
          console.log('getDayData', res.data.data.homepage)
          let hp = res.data.data.homepage
          hp.user_active_daily.length = 7
          hp.user_new_daily.length = 7
          this.myDayChart.setOption({
            series: [
              {
                data: hp.user_active_daily
              },
              {
                data: hp.user_new_daily
              }
            ]
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.myDayChart.hideLoading()
        this.$message.error('网络连接错误！')
      })
    },
    getMonth () {
      this.myMonthChart.showLoading()
      let start = this.yearStart.getTime()
      let currYear = this.yearStart.getFullYear()
      let day = (new Date(currYear + 1, 0, 1).getTime() - start) / 24 / 60 / 60 / 1000
      let end = start + parseInt(day) * 24 * 60 * 60 * 1000
      this.$axios.get('/homepage/admin', {
        params: {
          type: 3,
          start_time: parseInt(start / 1000),
          end_time: parseInt(end / 1000) - 1
        }
      }).then(res => {
        this.myMonthChart.hideLoading()
        if (parseInt(res.data.code) === 200) {
          console.log('getMonthData', res.data.data.homepage)
          let hp = res.data.data.homepage
          hp.user_active_monthly.length = 12
          this.myMonthChart.setOption({
            series: [
              {
                data: hp.user_active_monthly
              }
            ]
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.myMonthChart.hideLoading()
        this.$message.error('网络连接错误！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .map{
    height: 500px;
    background-color: #ddd;
  }
  .el-col{
    margin-top: 40px;
  }
  .pie-warpper,
  .bar-warpper,
  .day-warpper,
  .month-warpper {
    height: 350px;
  }
  .date-picker-warpper {
    position: relative;
    .date-picker{
      text-align: right;
    }
  }
</style>
