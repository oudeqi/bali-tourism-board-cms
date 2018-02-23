<template>
  <div>
    <h1>当前启动页</h1>
    <div class="warpper">
      <div class="curr">
        <div v-for="item in items" :key="item.id" v-if="item.is_select">
          <img :src="item.picture" alt="">
          <p>{{item.description}}</p>
        </div>
        <p class="no-launch" v-if="!hasLcunch">未设置启动页</p>
      </div>
      <div class="list">
        <el-button type="text" @click="dialogVisible = true">添加备选</el-button>
        <el-dialog title="添加备选启动页" :visible.sync="dialogVisible" width="40%" :before-close="handleDialogClose">
          <el-form label-position="left" label-width="60px" :model="formData" ref="form">
            <el-form-item label="备注">
              <el-input v-model="formData.desc" placeholder="选填"></el-input>
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
            <el-form-item>最佳图片建议尺寸为：1920*1082</el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitUpload">确 定</el-button>
          </span>
        </el-dialog>
        <p class="no-launch" v-if="!hasBY">没有备用图片</p>
        <ul>
          <li v-for="item in items" :key="item.id" v-if="!item.is_select">
            <div class="pic">
              <img :src="item.picture" alt="">
            </div>
            <p>{{item.description}}</p>
            <el-button size="small" plain @click="setLaunch(item)">设为启动页</el-button>
            <el-button size="small" type="danger" plain @click="drop(item)">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Launch',
  data () {
    return {
      clicked: false,
      formData: {
        desc: ''
      },
      hasLcunch: false,
      hasBY: false,
      items: [],
      dialogVisible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$axios.get('/splash/list').then(res => {
        if (parseInt(res.data.code) === 200) {
          this.items = res.data.data.splash_list
          this.hasLcunch = this.items.some(item => item.is_select)
          this.hasBY = this.items.some(item => !item.is_select)
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
      if (this.formData.desc && this.formData.desc.length > 20) {
        this.$message.error('备注限制在20个字以内！')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 1) {
        if (this.clicked) {
          return false
        }
        this.clicked = true
        let formData = new FormData()
        formData.append('description', this.formData.desc)
        formData.append('picture', this.$refs.form.$el.picture.files[0])
        this.$axios.post('/splash', formData).then(res => {
          this.clicked = false
          if (parseInt(res.data.code) === 200) {
            this.getList()
            this.$message({
              type: 'success',
              message: '上传图片成功!'
            })
          } else {
            this.$message.error('上传图片发生错误！')
          }
        }).catch((e) => {
          this.clicked = false
          this.$message.error('网络连接错误！')
        })
      } else {
        this.$message.error('请添加需要上传的图片！')
      }
    },
    setLaunch (item) {
      this.$confirm('此操作将修改生效的启动页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', true)
        this.$axios.put(`/splash?id=${item.id}`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '设置成功!'
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
    drop (item) {
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/splash?id=${item.id}`).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
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
  .warpper{
    margin-top: 20px;
    display: flex;
  }
  .curr{
    width: 300px;
    height: auto;
    flex-shrink: 0;
    p{
      padding: 6px 0;
    }
    img{
      width: 100%;
      display: block;
      height: auto;
    }
  }
  .no-launch{
    color: #999;
  }
  .upload{
    width: 500px;
    margin-top: 40px;
  }
  .list{
    flex-grow: 1;
    margin-left: 20px;
    border-left: 1px solid #ddd;
    padding-left: 20px;
    ul{
      overflow: hidden;
    }
    li{
      width: 200px;
      margin-right: 10px;
      margin-bottom: 20px;
      float: left;
      p{
        padding: 6px 0;
      }
      img{
        width: 100%;
      }
    }
  }
</style>
