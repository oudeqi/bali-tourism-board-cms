<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
      <!-- :to="{ path: '/news' }"-->
      <el-breadcrumb-item>News Details</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="formData" label-width="150px" :disabled="false" ref="form">
        <el-form-item label="News ID" required>
          <el-input disabled v-model="formData.id" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="News Title" required>
          <el-input v-model="formData.name" placeholder="Title maximal 50 characters"></el-input>
        </el-form-item>
        <el-form-item label="sub-title">
          <el-input type="textarea" v-model="formData.subtitle" placeholder="optional"></el-input>
        </el-form-item>
        <el-form-item label="Upload Image" required>
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
          <el-button type="primary" @click="submitUpload" size="small">Modify</el-button>
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
import router from '../router'
import Cropper from 'cropperjs'
import {isUrl} from '../utils'
export default {
  name: 'NewsDetail',
  data () {
    return {
      type: this.$route.query.type + '',
      clicked: false,
      cropper: null,
      hasCropPic: false,
      cropImgDialogVisible: false,
      fileList: [],
      formData: {
        id: this.$route.params.id,
        top: '',
        name: '',
        subtitle: '',
        picture: '',
        booking: '',
        description: ''
      }
    }
  },
  computed: {
    routeName () {
      return this.type === '1' ? 'News List' : this.type === '2' ? 'Recommended News' : this.type === '3' ? '删除的新闻' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'NewsList' : this.type === '2' ? 'TopNews' : this.type === '3' ? 'DeletedNews' : ''
    }
  },
  mounted () {
    this.getDetails()
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
    getDetails () {
      this.$axios.get('/news', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res.data.data.news)
          this.formData.name = res.data.data.news.name
          this.formData.top = res.data.data.news.top
          this.formData.subtitle = res.data.data.news.subtitle
          this.formData.booking = res.data.data.news.booking
          this.formData.description = res.data.data.news.body
          this.fileList = [{name: 'news.jpeg', url: res.data.data.news.picture}]
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('Network connection error')
      })
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
      if (this.$refs.form.$el.picture.files.length === 0 && this.fileList.length === 0) {
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
          formData.append('name', this.formData.name)
          formData.append('top', this.formData.top)
          formData.append('subtitle', this.formData.subtitle)
          formData.append('picture', blob)
          formData.append('booking', this.formData.booking)
          formData.append('body', this.formData.description)
          this.$axios.put('/news', formData).then(res => {
            this.clicked = false
            if (parseInt(res.data.code) === 200) {
              this.$message({
                type: 'success',
                message: 'Amend the news success'
              })
            } else {
              this.$message.error('Amend the news error')
            }
          }).catch((e) => {
            this.clicked = false
            this.$message.error('Network connection error')
          })
        })
      } else if (this.fileList.length === 1) {
        if (this.clicked) {
          return false
        }
        this.clicked = true
        let formData = new FormData()
        formData.append('id', this.formData.id)
        formData.append('name', this.formData.name)
        formData.append('top', this.formData.top)
        formData.append('subtitle', this.formData.subtitle)
        formData.append('picture', this.fileList[0].url)
        formData.append('booking', this.formData.booking)
        formData.append('body', this.formData.description)
        this.$axios.put('/news', formData).then(res => {
          this.clicked = false
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Amend the news success'
            })
          } else {
            this.$message.error('Amend the news error')
          }
        }).catch((e) => {
          this.clicked = false
          this.$message.error('Network connection error')
        })
      } else {
        this.$message.error('Please add a picture that needs to be uploaded')
      }
    },
    back () {
      router.go(-1)
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
</style>
