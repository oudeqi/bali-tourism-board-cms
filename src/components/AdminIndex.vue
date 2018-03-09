<template>
  <div>
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
              format="yyyy - WW week"
              placeholder="Select week">
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
              placeholder="Select Year">
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
          text: 'User Registration Type Statistics',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: ['facebook registered user', 'phone number registered user', 'email address registered user']
        },
        series: [
          {
            name: 'Statistics',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              {value: 0, name: 'facebook registered user'},
              {value: 0, name: 'phone number registered user'},
              {value: 0, name: 'email address registered user'}
            ]
          }
        ]
      })
    },
    initBarChart () {
      this.myBarChart = this.$echarts.init(document.getElementById('barChart'))
      this.myBarChart.setOption({
        title: {
          text: 'Statistics',
          x: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['Total User', 'Total Merchant', 'Total Products', 'product click number', 'banner click number', 'Total News', 'news click number']
        },
        yAxis: {},
        series: [{
          name: 'Statistics',
          type: 'bar'
        }]
      })
    },
    initDayChart () {
      let {markPoint, markLine} = {
        markPoint: {
          data: [
            {type: 'max', name: 'Maximum Value'},
            {type: 'min', name: 'Minimum Value'}
          ]
        },
        markLine: {
          data: [
            {type: 'average', name: 'Average Value'}
          ]
        }
      }
      this.myDayChart = this.$echarts.init(document.getElementById('dayChart'))
      this.myDayChart.setOption({
        title: {
          text: 'Daily Statistics',
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
          data: ['DAU', 'Daily New User', 'Daily App Startup']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisTick: {show: false},
          data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          {
            name: 'DAU',
            type: 'bar',
            barGap: 0,
            markPoint: markPoint,
            markLine: markLine
          },
          {
            name: 'Daily New User',
            type: 'bar',
            markPoint: markPoint,
            markLine: markLine
          },
          {
            name: 'Daily App Startup',
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
          text: 'MAU',
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
          data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'MAU',
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
                {value: hp.signup_facebook, name: 'facebook registered user'},
                {value: hp.signup_phone, name: 'phone number registered user'},
                {value: hp.signup_email, name: 'email address registered user'}
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
        this.$message.error('Network Connection Error!')
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
              },
              {
                data: hp.app_startup_daily
              }
            ]
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.myDayChart.hideLoading()
        this.$message.error('Network Connection Error!')
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
        this.$message.error('Network Connection Error!')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
