<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>横拍广告列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="dialogVisible = true">
        <i class="el-icon-plus"></i>
        添加备选
      </el-button>
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
            <el-button @click="setActive(scope.row)" type="text" size="small">启用</el-button>
            <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加备选轮播图" :visible.sync="dialogVisible" width="40%" :before-close="handleDialogClose">
      <el-form label-position="left" label-width="80px" :model="formData" ref="form">
        <el-form-item label="链接地址">
          <el-input v-model="formData.url" name="booking" placeholder="请输入点击横排图片跳转的地址 http://"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="http://47.88.216.48/bali/v1/advertise"
            list-type="picture-card"
            name="picture"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>最佳图片建议尺寸为：1440*700</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitUpload">确 定</el-button>
          </span>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="centerDialogVisible" width="50%" center>
      <div class="pic-view--lg">
        <img :src="picView" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BannerList',
  data () {
    return {
      formData: {
        url: ''
      },
      picView: null,
      items: [],
      dialogVisible: false,
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
    handleDialogClose (done) {
      done()
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type.toLowerCase() === 'image/jpeg'
      const isPng = file.type.toLowerCase() === 'image/png'
      if (!isJPG && !isPng) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      return isJPG || isPng
    },
    submitUpload (e) {
      e.preventDefault()
      if (this.formData.url && !/^(ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(this.formData.url)) {
        this.$message.error('请输入正确的网址')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 1) {
        let formData = new FormData()
        formData.append('booking', this.formData.url)
        formData.append('picture', this.$refs.form.$el.picture.files[0])
        this.$axios.post('/advertise', formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '上传横拍图片成功!'
            })
          } else {
            this.$message.error('上传横拍图片发生错误！')
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      } else {
        this.$message.error('请添加需要上传的图片！')
      }
    },
    setActive () {
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
            this.getBannerList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
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
