<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="bar-warpper" id="barChart"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { throttle } from 'lodash'
export default {
  name: 'UserIndex',
  data () {
    return {
      myBarChart: null
    }
  },
  mounted () {
    // this.getDetail()
    this.drawBarChart()
    window.addEventListener('resize', this.resizeHandler, false)
  },
  beforeDestroy () {
    if (this.myBarChart) {
      this.myBarChart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler, false)
    this.myBarChart = null
  },
  methods: {
    resizeHandler: throttle.call(this, function () {
      if (this.myBarChart) {
        this.myBarChart.resize({width: 'auto'})
      }
    }, 200),
    drawBarChart () {
      this.myBarChart = this.$echarts.init(document.getElementById('barChart'))
      this.myBarChart.setOption({
        title: {
          text: '首页统计',
          x: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['商品总数', '商品点击量']
        },
        yAxis: {},
        series: [{
          name: '统计',
          type: 'bar',
          data: [20, 15]
        }]
      })
    },
    getDetail () {
      this.$axios.get('/homepage/merchant ').then(res => {
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
  .tit{
    text-align: center;
  }
  .el-col{
    margin-top: 40px;
  }
  .bar-warpper {
    height: 350px;
  }
</style>
