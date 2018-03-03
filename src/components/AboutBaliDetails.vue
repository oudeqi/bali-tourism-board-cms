<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/about-bali' }">关于巴厘岛</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warpper">
      <el-form label-position="right" label-width="120px" :model="formData" ref="form" :disabled="false">
        <el-form-item label="ID">
          <el-input disabled v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formData.title" name="title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="http://47.88.216.48/bali/v1/advertise"
            list-type="picture-card"
            name="picture"
            accept="image/*"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :before-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>最佳图片建议尺寸为：1080*1920</el-form-item>
        <el-form-item>
          <div v-show="hasCropPic">
            <div id="cropper-container" class="cropper-container"></div>
            <el-button @click="handleCropPicView" size="small">查看裁剪结果</el-button>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" placeholder="请编辑描述" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload">确认修改</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="图片预览" :visible.sync="cropImgDialogVisible" width="50%" center>
      <div class="pic-view--lg" id="crop-pic-view"></div>
    </el-dialog>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import router from '../router'
export default {
  name: 'AboutBaliDetails',
  data () {
    return {
      clicked: false,
      hasCropPic: false,
      cropImgDialogVisible: false,
      cropper: null,
      fileList: [],
      formData: {
        id: this.$route.params.id,
        title: '',
        description: ''
      }
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    handleChange (file) {
      if (file) {
        let image = document.createElement('img')
        image.id = 'crop-pic'
        let picBlob = this.$refs.form.$el.picture.files[0]
        image.src = window.URL.createObjectURL(picBlob)
        let cropperContainer = document.querySelector('#cropper-container')
        cropperContainer.innerHTML = ''
        cropperContainer.appendChild(image)
        this.hasCropPic = true
        this.cropper = new Cropper(image, {
          aspectRatio: 1080 / 1920,
          autoCropArea: 0.75,
          dragMode: 'move',
          cropBoxMovable: false,
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false
        })
      }
    },
    handleRemove () {
      if (this.cropper) {
        this.cropper.destroy()
        document.querySelector('#cropper-container').innerHTML = ''
        this.hasCropPic = false
      }
    },
    handleCropPicView () {
      this.cropImgDialogVisible = true
      let croppedCanvas = this.cropper.getCroppedCanvas({
        width: 600,
        minWidth: 400,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'medium'
      })
      this.$nextTick(function () {
        let img = document.createElement('img')
        img.style.width = '100%'
        img.src = croppedCanvas.toDataURL('image/jpeg')
        let res = document.getElementById('crop-pic-view')
        res.innerHTML = ''
        res.appendChild(img)
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    submitUpload (e) {
      e.preventDefault()
      if (this.formData.title.length > 50) {
        this.$message.error('标题长度不能超过50字')
        return false
      }
      if (this.formData.description.length > 500) {
        this.$message.error('描述长度不能超过500字')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 1) {
        if (this.clicked) {
          return false
        }
        this.clicked = true
        let croppedCanvas = this.cropper.getCroppedCanvas({
          width: 600,
          minWidth: 400,
          fillColor: '#fff',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'medium'
        })
        croppedCanvas.toBlob(blob => {
          let formData = new FormData()
          formData.append('id', this.formData.id)
          formData.append('title', this.formData.title)
          formData.append('description', this.formData.description)
          formData.append('picture', blob)
          this.$axios.put('/aboutbali', formData).then(res => {
            this.clicked = false
            if (parseInt(res.data.code) === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            } else {
              this.$message.error('修改发生错误！')
            }
          }).catch((e) => {
            this.clicked = false
            this.$message.error('网络连接错误！')
          })
        })
      } else if (this.fileList.length === 1) {
        if (this.clicked) {
          return false
        }
        this.clicked = true
        let formData = new FormData()
        formData.append('id', this.formData.id)
        formData.append('title', this.formData.title)
        formData.append('description', this.formData.description)
        formData.append('picture', this.fileList[0].url)
        this.$axios.put('/aboutbali', formData).then(res => {
          this.clicked = false
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          } else {
            this.$message.error('修改发生错误！')
          }
        }).catch((e) => {
          this.clicked = false
          this.$message.error('网络连接错误！')
        })
      } else {
        this.$message.error('请添加需要上传的图片！')
      }
    },
    getDetail () {
      this.$axios.get('/aboutbali', {
        params: {
          id: this.formData.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res.data.data.aboutbali)
          this.formData.title = res.data.data.aboutbali.title
          this.formData.description = res.data.data.aboutbali.description
          this.fileList = [{name: 'aboutbali.jpeg', url: res.data.data.aboutbali.picture}]
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
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
  .warpper{
    margin-top: 20px;
    padding-top: 10px;
    width: 640px;
  }
</style>
