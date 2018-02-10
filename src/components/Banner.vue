<template>
  <div>
    <h1>
      当前生效的图片
      <small>（取消勾选，进行删除）</small>
      <el-button type="danger" size="small" @click="save" plain round>保存</el-button>
    </h1>
    <div class="list">
      <ul>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <span>1</span>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <span>2</span>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <span>3</span>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
      </ul>
    </div>
    <h1>
      备选图片
      <small>（会按勾选图片的顺序排序）</small>
      <el-button type="text" @click="dialogVisible = true">添加备选</el-button>
    </h1>
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
    <div class="list">
      <ul>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <i class="el-icon-success"></i>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <i class="el-icon-success"></i>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <i class="el-icon-success"></i>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="checkbox">
            <label>
              <input type="checkbox" checked>
              <i class="el-icon-success"></i>
            </label>
          </div>
          <div class="pic">
            <button class="del" type="button" @click="del">
              <i class="el-icon-delete"></i>
            </button>
            <img src="../assets/banner-1.jpg" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  data () {
    return {
      formData: {
        url: ''
      },
      dialogVisible: false
    }
  },
  mounted () {
    this.$axios.get('/advertise/list').then(res => {
      console.log(res)
    }).catch((e) => {
      this.$message.error('网络连接错误！')
    })
  },
  methods: {
    getBannerList () {
      console.log('getBannerList')
      this.$axios.get('/advertise/list').then(res => {
        console.log(res)
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
      console.log('getBannerList')
    },
    submitForm () {},
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
    submitUpload () {
      if (this.formData.url && !/^(ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test(this.formData.url)) {
        this.$message.error('请输入正确的网址')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 1) {
        let formData = new FormData()
        formData.append('booking', this.formData.url)
        formData.append('picture', this.$refs.form.$el.picture.files[0])
        this.$axios.post('/advertise', formData).then(res => {
          console.log(res)
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
    save () {
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
    del () {
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 small{
    font-weight: normal;
  }
  .list{
    margin-bottom: 20px;
    ul{
      overflow: hidden;
      li{
        margin-top: 20px;
        width: 300px;
        height: 150px;
        float: left;
        display: flex;
        margin-right: 20px;
        .checkbox{
          width: 50px;
          height: 100%;
          flex-shrink: 0;
          background-color: #fff;
          display: flex;
          border: 1px solid #ddd;
          border-right: 0;
          align-items: center;
          justify-content: center;
          label{
            cursor: pointer;
            input[type="checkbox"]{
              display: none;
              & + i{
                color: #ddd;
                font-size: 30px;
              }
              & + span{
                color: #fff;
                border: 1px solid #ddd;
                background-color: #fff;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                text-align: center;
                line-height: 35px;
                font-size: 20px;
                display: block;
              }
            }
            input[type="checkbox"]:checked{
              & + i{
                color: #409EFF;
              }
              & + span{
                color: #fff;
                border: none;
                background-color: #409EFF;
              }
            }
          }
        }
        .pic{
          flex-grow: 1;
          position: relative;
          .del{
            position: absolute;
            top: 0;
            right: 0;
            background: transparent;
            border: none;
            border-top: none;
            border-right: none;
            color: #fbfbfb;
            padding: 6px;
            cursor: pointer;
            font-size: 20px;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
