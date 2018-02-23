<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/news/list' }">新闻列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="formData" label-width="100px" ref="form">
        <el-form-item label="新闻标题" required>
          <el-input v-model="formData.name" placeholder="新闻标题限制在50个字以内"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input type="textarea" v-model="formData.subtitle" placeholder="副标题选填"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" required>
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
        <el-form-item>最佳图片建议尺寸为：490*260</el-form-item>
        <el-form-item label="视频地址" required>
          <el-input v-model="formData.booking" placeholder="请填写有效的视频地址"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" required>
          <el-input type="textarea" placeholder="请编辑新闻内容" v-model="formData.body" :autosize="{ minRows: 12, maxRows: 24}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">立即创建</el-button>
          <el-button @click="cancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="cropper-container">
        <img id="image" src="../assets/1.jpg">
      </div>
      <el-button @click="handleCrop" size="small">裁剪结果</el-button>
      <div id="res"></div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import router from '../router'
import {isUrl} from '../utils'
export default {
  name: 'NewsAdd',
  data () {
    return {
      clicked: false,
      cropper: null,
      formData: {
        name: '',
        subtitle: '',
        picture: '',
        url: '',
        description: ''
      }
    }
  },
  mounted () {
    let image = document.getElementById('image')
    this.cropper = new Cropper(image, {
      aspectRatio: 16 / 9,
      autoCropArea: 0.75,
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      /* ready () {
        let clone = this.cloneNode()
        clone.className = ''
        document.getElementById('res').innerHTML = ''
        document.getElementById('res').appendChild(clone.cloneNode())
      }, */
      crop (e) {
        console.log(e.detail.x)
        console.log(e.detail.y)
        console.log(e.detail.width)
        console.log(e.detail.height)
        console.log(e.detail.rotate)
        console.log(e.detail.scaleX)
        console.log(e.detail.scaleY)
      }
    })
  },
  methods: {
    handleCrop () {
      let croppedCanvas = this.cropper.getCroppedCanvas({
        width: 600,
        minWidth: 400,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'medium'
      })
      let img = document.createElement('img')
      img.src = croppedCanvas.toDataURL('image/jpeg')
      let res = document.getElementById('res')
      res.innerHTML = ''
      res.appendChild(img)
      // https://www.cnblogs.com/jyuf/p/7251591.html
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
      if (!this.formData.name) {
        this.$message.error('请输入新闻标题')
        return false
      }
      if (this.formData.name.length > 50) {
        this.$message.error('新闻标题限制在50个字以内')
        return false
      }
      if (this.formData.subtitle && this.formData.subtitle.length > 50) {
        this.$message.error('副标题限制在50个字以内')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 0) {
        this.$message.error('请选择新闻图片，此图片将显示在新闻列表页')
        return false
      }
      if (!this.formData.booking || !isUrl(this.formData.booking)) {
        this.$message.error('请填写正确的视频地址')
        return false
      }
      if (!this.formData.body) {
        this.$message.error('请编辑新闻内容！')
        return false
      }
      if (this.clicked) {
        return false
      }
      this.clicked = true
      let formData = new FormData()
      formData.append('name', this.formData.name)
      formData.append('subtitle', this.formData.subtitle)
      formData.append('picture', this.$refs.form.$el.picture.files[0])
      formData.append('booking', this.formData.url)
      formData.append('body', this.formData.description)
      this.$axios.post('/news', formData).then(res => {
        this.clicked = false
        if (parseInt(res.data.code) === 200) {
          this.$message({
            type: 'success',
            message: '添加新闻成功!'
          })
        } else {
          this.$message.error('添加新闻发生错误！')
        }
      }).catch((e) => {
        this.clicked = false
        this.$message.error('网络连接错误！')
      })
    },
    cancel () {
      router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-warpper{
  margin-top: 40px;
  width: 600px;
}
.cropper-container {
  max-width: 640px;
}
img {
  max-width: 100%;
}
</style>
