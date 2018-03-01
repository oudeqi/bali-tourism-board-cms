<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
      <!-- :to="{ path: '/news' }"-->
      <el-breadcrumb-item>新闻详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="formData" label-width="100px" :disabled="false" ref="form">
        <el-form-item label="新闻ID" required>
          <el-input disabled v-model="formData.id" placeholder=""></el-input>
        </el-form-item>
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
        <el-form-item>最佳图片建议尺寸为：1440*700</el-form-item>
        <el-form-item>
          <div v-show="hasCropPic">
            <div id="cropper-container" class="cropper-container"></div>
            <el-button @click="handleCropPicView" size="small">查看裁剪结果</el-button>
          </div>
        </el-form-item>
        <el-form-item label="视频地址" required>
          <el-input v-model="formData.booking" placeholder="请填写有效的视频地址"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" required>
          <el-input type="textarea" placeholder="请编辑新闻内容" v-model="formData.description" :autosize="{ minRows: 12, maxRows: 24}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">确认修改</el-button>
          <el-button @click="cancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="图片预览" :visible.sync="cropImgDialogVisible" width="50%" center>
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
      return this.type === '1' ? '新闻列表' : this.type === '2' ? '置顶的新闻' : this.type === '3' ? '删除的新闻' : '无'
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
      this.$message.warning('当前限制选择 1 个文件')
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
        this.$message.error('网络连接错误！')
      })
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
      if (this.$refs.form.$el.picture.files.length === 0 && this.fileList.length === 0) {
        this.$message.error('请选择新闻图片，此图片将显示在新闻列表页')
        return false
      }
      if (!this.formData.booking || !isUrl(this.formData.booking)) {
        this.$message.error('请填写正确的视频地址')
        return false
      }
      if (!this.formData.description) {
        this.$message.error('请编辑新闻内容！')
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
                message: '修改新闻成功!'
              })
            } else {
              this.$message.error('修改新闻发生错误！')
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
              message: '修改新闻成功!'
            })
          } else {
            this.$message.error('修改新闻发生错误！')
          }
        }).catch((e) => {
          this.clicked = false
          this.$message.error('网络连接错误！')
        })
      } else {
        this.$message.error('请添加需要上传的图片！')
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
