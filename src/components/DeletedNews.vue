<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>删除的新闻</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="发布日期" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="新闻标题" width="250"></el-table-column>
        <el-table-column prop="desc" label="新闻概要"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="detail" type="text" size="small">详细</el-button>
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
  name: 'DeletedNews',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        title: '陆基中段反导拦截试验与朝鲜半岛有关？中方回应',
        desc: '2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？'
      }, {
        date: '2016-05-04',
        title: '陆基中段反导拦截试验与朝鲜半岛有关？中方回应',
        desc: '2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？'
      }, {
        date: '2016-05-01',
        title: '陆基中段反导拦截试验与朝鲜半岛有关？中方回应',
        desc: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        title: '王小虎',
        desc: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    detail () {
      router.push({
        path: '/news/detail/' + 'zxczxczxc',
        query: {
          type: 3
        }
      })
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
