<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>生效的广告列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="dialogVisible = true">保存</el-button>
    </div>
    <div class="table-list">
      <el-table :data="items" stripe style="width: 100%">
        <el-table-column prop="id" label="#ID" width="100"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="booking" label="跳转链接"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.is_select ? '已启用' : '未启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">浏览大图</el-button>
            <el-button @click="cancel(scope.row)" type="text" size="small">取消启用</el-button>
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
export default {
  name: 'BannerActive',
  data () {
    return {
      formData: {
        url: ''
      },
      picView: null,
      items: [],
      centerDialogVisible: false
    }
  },
  mounted () {
    this.getBannerList()
  },
  methods: {
    getBannerList () {
      this.$axios.get('/advertise/list').then(res => {
        if (parseInt(res.data.code) === 200) {
          this.items = res.data.data.advertise_list
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    cancel () {
      this.$confirm('此操作将修改生效的横排广告图以及顺序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {})
    },
    detail (item) {
      console.log(item)
      this.centerDialogVisible = true
      this.picView = item.picture
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
  .pic-view{
    max-height: 100px;
    display: block;
  }
  .pic-view--lg{
    height: 400px;
    img{
      max-height: 100%;
      display: block;
    }
  }
</style>
