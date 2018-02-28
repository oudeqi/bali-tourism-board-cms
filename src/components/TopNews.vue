<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>置顶的新闻</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="发布日期" width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.create_time | timeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="新闻标题"></el-table-column>
        <el-table-column label="新闻头图">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">详细</el-button>
            <el-button @click="cancelTop(scope.row)" type="text" size="small">取消置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager">
      <el-pagination
        layout="prev, pager, next"
        :page-count="page_total" :page-size="page_size" :current-page.sync="page_index"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import router from '../router'
import moment from 'moment'
export default {
  name: 'TopNews',
  data () {
    return {
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  filters: {
    timeFormat: function (value) {
      let utc = moment.utc(new Date(value))
      return utc.get('year') + '-' + utc.get('month') + '-' + utc.get('date')
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.getList()
    },
    getList () {
      this.$axios.get('/news/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index,
          top: true
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          this.tableData = res.data.data.news_list.data
          this.page_index = res.data.data.news_list.page_index
          this.page_next = res.data.data.news_list.page_next
          this.page_total = res.data.data.news_list.page_total
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    detail (item) {
      router.push({
        path: '/news/detail/' + item.id,
        query: {
          type: 2
        }
      })
    },
    cancelTop (item) {
      this.$confirm('此操作将取消新闻置顶, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('top', true)
        this.$axios.put(`/news?id=${item.id}&top=false`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .pic-view{
    max-height: 50px;
    display: block;
  }
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
