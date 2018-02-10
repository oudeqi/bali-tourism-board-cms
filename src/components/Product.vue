<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select v-model="value" placeholder="请选择" size="medium">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" plain round @click="newsAdd">
        <i class="el-icon-plus"></i>
        添加商品
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="title" label="商品标题" width="250"></el-table-column>
        <el-table-column prop="date" label="发布日期" width="180"></el-table-column>
        <el-table-column prop="cacategoryt" label="分类" width="180"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="detail" type="text" size="small">详细</el-button>
            <el-button @click="recommend" type="text" size="small">添加到推荐</el-button>
            <el-button @click="setDisable" type="danger" size="mini">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager">
      <el-pagination
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'Product',
  data () {
    return {
      tableData: [{
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '住宿'
      }, {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '景点'
      }, {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '餐饮'
      }, {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '旅游'
      }, {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '运输'
      }],
      options: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '景点'
      }, {
        value: '2',
        label: '餐饮'
      }, {
        value: '3',
        label: '旅游'
      }, {
        value: '4',
        label: '住宿'
      }, {
        value: '5',
        label: '运输'
      }],
      value: '0'
    }
  },
  methods: {
    detail () {
      router.push({
        path: '/product/detail/' + 'zxczxczxc',
        query: {
          type: 1
        }
      })
    },
    setDisable () {
      this.$confirm('此操作将会禁用该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {})
    },
    recommend () {
      this.$confirm('此操作会将商品添加到推荐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '添加推荐成功!'
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter{
    display: flex;
    align-items: center;
    .el-breadcrumb{
      flex-grow: 1;
    }
  }
  .table-list{
    margin-top: 20px;
  }
  .pager{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
</style>
