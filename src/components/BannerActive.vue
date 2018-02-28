<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>生效的广告列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--<el-button type="primary" size="small" plain round @click="dialogVisible = true">保存</el-button>-->
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="#ID"></el-table-column>
        <el-table-column label="图片" min-width="100">
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
            <el-button @click="largePic(scope.row)" type="text" size="small">浏览大图</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="cancel(scope.row)" type="text" size="small">取消启用</el-button>
            <el-button class="sort" @click="sort(scope.row)" icon="el-icon-sort" type="success" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  name: 'BannerActive',
  data () {
    return {
      formData: {
        url: ''
      },
      picView: null,
      tableData: [],
      centerDialogVisible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$axios.get('/advertise/list', {
        params: {
          is_select: true
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          let arr = res.data.data.advertise_list
          arr.sort(function (a, b) {
            return a.select_index < b.select_index
          })
          this.tableData = arr
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    sort (item) {
      this.$confirm('确定要修改顺序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', true)
        let index = parseInt(this.tableData[0].select_index) + 1
        formData.append('select_index', index)
        this.$axios.put(`/advertise?id=${item.id}&select_index=${index}&is_select=true`, formData).then(res => {
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
    cancel (item) {
      this.$confirm('此操作将修改生效的横排广告图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', false)
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
    largePic (item) {
      this.centerDialogVisible = true
      this.picView = item.picture
    },
    detail (item) {
      router.push({
        path: '/banner/details/' + item.id,
        query: {
          type: 2
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
  .sort {
    font-size: 15px;
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
