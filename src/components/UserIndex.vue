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
    this.initBarChart()
    this.getDetail()
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
    initBarChart () {
      this.myBarChart = this.$echarts.init(document.getElementById('barChart'))
      this.myBarChart.setOption({
        title: {
          text: 'Statistics',
          x: 'center'
        },
        tooltip: {},
        xAxis: {
          data: ['Total Products', 'product click number']
        },
        yAxis: {},
        series: [{
          name: 'Statistics',
          type: 'bar',
          data: []
        }]
      })
      this.myBarChart.showLoading()
    },
    getDetail () {
      this.$axios.get('/homepage/merchant', {
        params: {
          type: 1
        }
      }).then(res => {
        this.myBarChart.hideLoading()
        if (parseInt(res.data.code) === 200) {
          let hp = res.data.data.homepage
          this.myBarChart.setOption({
            xAxis: {
            },
            series: [{
              name: 'Statistics',
              type: 'bar',
              data: [
                {label: {show: true}, value: hp.commodity_total},
                {label: {show: true}, value: hp.commodity_clicks}
              ]
            }]
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.myBarChart.hideLoading()
        this.$message.error('Network Connection Error!')
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
