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
    <!-- TODO -->
    <el-row :gutter="20">
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-1">
          <h2>facebook注册用户量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-2">
          <h2>手机号码注册量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-3">
          <h2>邮箱用户注册数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-4">
          <h2>轮播图点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-1">
          <h2>商家点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-2">
          <h2>商品点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-3">
          <h2>新闻点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-4">
          <h2>轮播图点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-1">
          <h2>日活跃用户数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-2">
          <h2>月活跃用户数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-3">
          <h2>每日新增用户</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-4">
          <h2>每日app启动数</h2>
          <p>10000</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-1">
          <h2>商家总数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-2">
          <h2>用户总数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-3">
          <h2>商品总数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-4">
          <h2>新闻总数</h2>
          <p>10000</p>
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
      myBarChart: null,
      myPieChart: null,
      myDayChart: null,
      myMonthChart: null,
      week: new Date(),
      year: new Date()
    }
  },
  mounted () {
    window.addEventListener('resize', this.resizeHandler, false)
    this.getDetail()
    this.drawBarChart()
    this.drawPieChart()
    this.drawDayChart()
    this.drawMonthChart()
  },
  beforeDestroy () {
    if (this.myBarChart) {
      this.myBarChart.dispose()
    }
    if (this.myPieChart) {
      this.myPieChart.dispose()
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
      console.log(date)
      console.log(this.week)
    },
    yearChangeHandler (date) {
      console.log(date)
      console.log(this.year)
    },
    drawBarChart () {
      this.myBarChart = this.$echarts.init(document.getElementById('barChart'))
      this.myBarChart.setOption({
        title: {
          text: '各项指标统计',
          x: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['轮播图点击量', '商家点击量', '商品点击量', '新闻点击量', '商家总数', '用户总数', '商品总数', '新闻总数']
        },
        yAxis: {},
        series: [{
          name: '统计',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 20, 15]
        }]
      })
    },
    drawPieChart () {
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
              {value: 234, name: 'facebook用户'},
              {value: 135, name: '手机号码用户'},
              {value: 1548, name: 'email用户'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    drawDayChart () {
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
          data: ['活跃用户', '新增用户', 'app启动数']
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
            data: [320, 332, 301, 334, 390, 50, 80],
            markPoint: markPoint,
            markLine: markLine
          },
          {
            name: '新增用户',
            type: 'bar',
            data: [220, 182, 191, 234, 290, 70, 90],
            markPoint: markPoint,
            markLine: markLine
          },
          {
            name: 'app启动数',
            type: 'bar',
            data: [150, 232, 201, 154, 190, 20, 220],
            markPoint: markPoint,
            markLine: markLine
          }
        ]
      })
    },
    drawMonthChart () {
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
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90]
          }
        ]
      })
    },
    getDetail () {
      this.$axios.get('/homepage/admin').then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
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
