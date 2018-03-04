<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Settings</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/about-bali' }">About Bali</el-breadcrumb-item>
      <el-breadcrumb-item>Add</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warpper">
      <el-form label-position="right" label-width="150px" :model="formData" ref="form">
        <el-form-item label="Title">
          <el-input v-model="formData.title" name="title" placeholder="Please enter the title"></el-input>
        </el-form-item>
        <el-form-item>
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
        <el-form-item>Recommended Size：1080*1920</el-form-item>
        <el-form-item>
          <div v-show="hasCropPic">
            <div id="cropper-container" class="cropper-container"></div>
            <el-button @click="handleCropPicView" size="small">View the cutting results</el-button>
          </div>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" placeholder="Please edit the description" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload">OK</el-button>
          <el-button @click="cancel">Cancel</el-button>
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
export default {
  name: 'AboutBaliAdd',
  data () {
    return {
      clicked: false,
      hasCropPic: false,
      cropImgDialogVisible: false,
      cropper: null,
      formData: {
        title: '',
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
      this.$message.warning('Only one file can be selected')
    },
    submitUpload (e) {
      e.preventDefault()
      if (this.formData.title.length > 50) {
        this.$message.error('The title limit is within 50 words')
        return false
      }
      if (this.formData.description.length > 500) {
        this.$message.error('The description limit is within 500 words')
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
          formData.append('title', this.formData.title)
          formData.append('description', this.formData.description)
          formData.append('picture', blob)
          this.$axios.post('/aboutbali', formData).then(res => {
            this.clicked = false
            if (parseInt(res.data.code) === 200) {
              this.$alert('Create success', 'Info', {
                confirmButtonText: 'OK',
                callback: action => {
                  this.formData.title = ''
                  this.formData.description = ''
                  this.$refs.upload.clearFiles()
                  this.hasCropPic = false
                }
              })
            } else {
              this.$message.error('Create an error')
            }
          }).catch((e) => {
            this.clicked = false
            this.$message.error('Network connection error')
          })
        })
      } else {
        this.$message.error('Please add a picture that needs to be uploaded')
      }
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
