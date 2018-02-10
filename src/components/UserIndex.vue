<template>
  <div>
    <h1>商家首页统计</h1>
    <el-row :gutter="20">
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-1">
          <h2>商品总数</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-2">
          <h2>商家点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
      <el-col :sm="12" :md="6">
        <div class="grid-content bg-3">
          <h2>商品点击量</h2>
          <p>10000</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UserIndex'
}
</script>

<style lang="scss" scoped>
  .tit{
    text-align: center;
  }
  .el-col{
    margin-top: 20px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    text-align: center;
    padding: 10px 0;
    color: #fff;
    p{
      font-size: 16px;
      margin-top: 10px;
      padding-bottom: 5px;
    }
  }
  .bg-1{
    background-color: #67C23A;
  }
  .bg-2{
    background-color: #E6A23C;
  }
  .bg-3{
    background-color: #F56C6C;
  }
  .bg-4{
    background-color: #409EFF;
  }
</style>
