<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/news/list' }">News List</el-breadcrumb-item>
      <el-breadcrumb-item>Create News</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="formData" label-width="150px" ref="form">
        <el-form-item label="News Title" required>
          <el-input v-model="formData.name" placeholder="Title maximal 50 characters"></el-input>
        </el-form-item>
        <el-form-item label="sub-title">
          <el-input type="textarea" v-model="formData.subtitle" placeholder="optional"></el-input>
        </el-form-item>
        <el-form-item label="Upload Image" required>
          <el-upload
            ref="upload"
            action="http://47.88.216.48/bali/v1/advertise"
            list-type="picture-card"
            name="picture"
            accept="image/*"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :before-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>Recommended Size：1440*700</el-form-item>
        <el-form-item>
          <div v-show="hasCropPic">
            <div id="cropper-container" class="cropper-container"></div>
            <el-button @click="handleCropPicView" size="small">View the cutting results</el-button>
          </div>
        </el-form-item>
        <el-form-item label="Video Link" required>
          <el-input v-model="formData.booking" placeholder="Please input valid video link"></el-input>
        </el-form-item>
        <el-form-item label="Content" required>
          <el-input type="textarea" placeholder="Please input news content" v-model="formData.description" :autosize="{ minRows: 12, maxRows: 24}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">Save</el-button>
          <el-button @click="cancel" size="small">Cancel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="Picture preview" :visible.sync="cropImgDialogVisible" width="50%" center>
      <div class="pic-view--lg" id="crop-pic-view"></div>
    </el-dialog>
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
      hasCropPic: false,
      cropImgDialogVisible: false,
      formData: {
        name: '',
        subtitle: '',
        booking: '',
        description: ''
      }
    }
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
          aspectRatio: 720 / 350,
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
      this.$message.warning('Only one file can be selected')
    },
    submitUpload (e) {
      e.preventDefault()
      if (!this.formData.name) {
        this.$message.error('Please enter news headlines')
        return false
      }
      if (this.formData.name.length > 50) {
        this.$message.error('News headlines are limited to 50 words')
        return false
      }
      if (this.formData.subtitle && this.formData.subtitle.length > 50) {
        this.$message.error('The subtitle is limited to 50 words')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 0) {
        this.$message.error('Please choose the news picture')
        return false
      }
      if (!this.formData.booking || !isUrl(this.formData.booking)) {
        this.$message.error('Please fill in the correct video address')
        return false
      }
      if (!this.formData.description) {
        this.$message.error('Please edit the news content')
        return false
      }
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
        formData.append('name', this.formData.name)
        formData.append('subtitle', this.formData.subtitle)
        formData.append('picture', blob)
        formData.append('booking', this.formData.booking)
        formData.append('body', this.formData.description)
        this.$axios.post('/news', formData).then(res => {
          this.clicked = false
          if (parseInt(res.data.code) === 200) {
            this.$alert('Add news success', 'Info', {
              confirmButtonText: 'OK',
              callback: action => {
                this.formData.name = ''
                this.formData.subtitle = ''
                this.formData.booking = ''
                this.formData.description = ''
                this.$refs.upload.clearFiles()
                this.hasCropPic = false
              }
            })
          } else {
            this.$message.error('Adding news errors')
          }
        }).catch((e) => {
          this.clicked = false
          this.$message.error('Network connection error')
        })
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
.pic-view--lg{
  min-height: 200px;
  text-align: center;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
