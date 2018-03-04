<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Home</el-breadcrumb-item>
        <el-breadcrumb-item>News List</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="newsAdd">
        <i class="el-icon-plus"></i>
        Create News
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#ID"></el-table-column>
        <el-table-column prop="name" label="News Title"></el-table-column>
        <el-table-column label="News Image">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="clicks" label="Clicks" align="center"></el-table-column>
        <el-table-column label="Operate" width="400">
          <template slot-scope="scope">
            <el-button @click="drop(scope.row)" type="danger" size="mini">Delete</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">Details</el-button>
            <el-button v-if="!scope.row.top" @click="top(scope.row)" type="text" size="small">Add to Recommended</el-button>
            <el-button v-if="scope.row.top" @click="cancelTop(scope.row)" type="text" size="small">Remove from Recommended</el-button>
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
  name: 'NewsList',
  data () {
    return {
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      tableData: []
    }
  },
  filters: {
    timeFormat: function (value) {
      let utc = moment.utc(new Date(value))
      return utc.get('year') + '-' + (parseInt(utc.get('month')) + 1) + '-' + utc.get('date')
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    newsAdd () {
      router.push({name: 'NewsAdd'})
    },
    handleCurrentChange (val) {
      this.getList()
    },
    getList () {
      this.$axios.get('/news/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index
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
        this.$message.error('Network connection error')
      })
    },
    detail (item) {
      router.push({
        path: '/news/detail/' + item.id,
        query: {
          type: 1
        }
      })
    },
    cancelTop (item) {
      this.$confirm('This operation will cancel top news, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('top', true)
        this.$axios.put(`/news?id=${item.id}&top=false`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
        })
      }).catch(() => {})
    },
    top (item) {
      this.$confirm('This operation will top the news, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('top', true)
        this.$axios.put(`/news?id=${item.id}&top=true`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
        })
      }).catch(() => {})
    },
    drop (item) {
      this.$confirm('This operation will delete the news, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/news', {
          params: {
            id: item.id
          }
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Delete success'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
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
