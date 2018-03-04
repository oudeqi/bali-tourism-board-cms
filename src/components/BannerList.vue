<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Home</el-breadcrumb-item>
        <el-breadcrumb-item>Banner List</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="addBanner">
        <i class="el-icon-plus"></i>
        Create
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#ID" width="120"></el-table-column>
        <el-table-column label="Image">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column label="Status" width="100" align="center">
          <template slot-scope="scope">
            <span :class="{selected: scope.row.is_select}">{{scope.row.is_select ? 'Enabled' : 'Disabled'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clicks" label="Clicks" align="center"></el-table-column>
        <el-table-column prop="booking" label="Link"></el-table-column>
        <el-table-column label="Operate" width="280">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text" size="small">Delete</el-button>
            <el-button @click="largePic(scope.row)" type="text" size="small">View</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">Details</el-button>
            <el-button v-if="!scope.row.is_select" @click="setActive(scope.row)" type="text" size="small">Enable</el-button>
            <el-button v-if="scope.row.is_select" @click="cancel(scope.row)" type="text" size="small">Disable</el-button>
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
    <el-dialog title="Picture Preview" :visible.sync="centerDialogVisible" width="50%" center>
      <div class="pic-view--lg">
        <img :src="picView" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'BannerList',
  data () {
    return {
      clicked: false,
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      tableData: [],
      formData: {
        url: ''
      },
      picView: null,
      centerDialogVisible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    addBanner () {
      router.push({name: 'BannerAdd'})
    },
    getList () {
      this.$axios.get('/advertise/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res)
          this.tableData = res.data.data.advertise_list.data
          this.page_index = res.data.data.advertise_list.page_index
          this.page_next = res.data.data.advertise_list.page_next
          this.page_total = res.data.data.advertise_list.page_total
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('Network connection error')
      })
    },
    handleCurrentChange (val) {
      this.getList()
    },
    cancel (item) {
      this.$confirm('This operation will change effective advertising, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('top', false)
        this.$axios.put(`/advertise?id=${item.id}&is_select=false`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation'
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
    setActive (item) {
      this.$confirm('This operation will change effective advertising picture, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', true)
        this.$axios.put(`/advertise?id=${item.id}&is_select=true`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation'
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
    del (item) {
      console.log(item)
      this.$confirm('Are you sure you want to delete this picture?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/advertise', {
          params: {
            id: item.id
          }
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation'
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
    largePic (item) {
      this.centerDialogVisible = true
      this.picView = item.picture
    },
    detail (item) {
      router.push({
        path: '/banner/details/' + item.id,
        query: {
          type: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .selected{
    color: #67c23a;
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
  .pic-view{
    max-height: 50px;
    display: block;
  }
  .pic-view--lg{
    height: 300px;
    text-align: center;
    img{
      max-height: 100%;
      max-width: 100%;
    }
  }
</style>
