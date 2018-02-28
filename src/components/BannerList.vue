<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>横拍广告列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="addBanner">
        <i class="el-icon-plus"></i>
        添加备选
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#ID" width="120"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="booking" label="跳转链接"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span :class="{selected: scope.row.is_select}">{{scope.row.is_select ? '已启用' : '未启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
            <el-button @click="largePic(scope.row)" type="text" size="small">浏览大图</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">详情</el-button>
            <el-button v-if="!scope.row.is_select" @click="setActive(scope.row)" type="text" size="small">启用</el-button>
            <el-button v-if="scope.row.is_select" @click="cancel(scope.row)" type="text" size="small">取消启用</el-button>
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
    <el-dialog title="图片预览" :visible.sync="centerDialogVisible" width="50%" center>
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
        this.$message.error('网络连接错误！')
      })
    },
    handleCurrentChange (val) {
      this.getList()
    },
    cancel (item) {
      this.$confirm('此操作将修改生效的横排广告图以及顺序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('top', false)
        this.$axios.put(`/advertise?id=${item.id}&is_select=false`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      }).catch(() => {})
    },
    setActive (item) {
      this.$confirm('此操作将修改生效的横排广告图以及顺序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', true)
        this.$axios.put(`/advertise?id=${item.id}&is_select=true`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      }).catch(() => {})
    },
    del (item) {
      console.log(item)
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
