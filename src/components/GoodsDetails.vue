<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="formData" label-width="120px" :disabled="false" ref="form">
        <el-form-item label="商品ID">
          <el-input disabled v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="点击量">
          <el-input disabled v-model="formData.clicks"></el-input>
        </el-form-item>
        <el-form-item label="是否被推荐">
          <el-radio disabled v-model="formData.top" :label="true">被推荐</el-radio>
          <el-radio disabled v-model="formData.top" :label="false">未被推荐</el-radio>
        </el-form-item>
        <el-form-item label="是否被禁用">
          <el-radio disabled v-model="formData.disabled" :label="true">被禁用</el-radio>
          <el-radio disabled v-model="formData.disabled" :label="false">未被禁用</el-radio>
        </el-form-item>
        <el-form-item label="商品标题" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="goodsType" placeholder="请选择" size="medium">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品头图" required>
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
        <el-form-item>
          <div v-show="hasCropPic">
            <div id="cropper-container" class="cropper-container"></div>
            <el-button @click="handleCropPicView" size="small">查看裁剪结果</el-button>
          </div>
        </el-form-item>
        <el-form-item label="商品价格" required>
          <el-input v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" required>
          <el-time-picker
            class="service-time"
            is-range
            v-model="formData.serviceTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="商品定位" required>
          <div style="display: none;">
            <el-input v-model="formData.location"></el-input>
            <el-input v-model="formData.longitude"></el-input>
            <el-input v-model="formData.latitude"></el-input>
          </div>
          <div class="map" id="map"></div>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="商品链接">
          <el-input v-model="formData.booking"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="formData.video"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" required>
          <el-input type="textarea" placeholder="请编辑商品描述" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">立即修改</el-button>
          <el-button @click="cancel" size="small">返回上一级</el-button>
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
import { isUrl, loadScript } from '../utils'
import { GOOGLE_MAP_URL, GOOGLE_BASE_URL, GOOGLE_MAP_INIT_ZOOM } from '../config.js'
import Cropper from 'cropperjs'
import axios from 'axios'
export default {
  name: 'GoodsDetails',
  data () {
    return {
      map: null,
      marker: null,
      infoWindow: null,
      type: this.$route.query.type + '',
      clicked: false,
      cropper: null,
      hasCropPic: false,
      cropImgDialogVisible: false,
      formData: {
        id: this.$route.params.id,
        serviceTime: [null, null],
        clicks: '',
        top: false,
        disabled: false,
        name: '',
        price: '',
        location: '',
        longitude: '',
        latitude: '',
        phone: '',
        booking: '',
        video: '',
        description: ''
      },
      fileList: [],
      goodsType: '',
      options: [{
        value: 'attraction',
        label: '景点'
      }, {
        value: 'restaurant',
        label: '餐饮'
      }, {
        value: 'tour',
        label: '旅游'
      }, {
        value: 'transport',
        label: '运输'
      }]
    }
  },
  computed: {
    postServiceTime: {
      get: function () {
        const fmtTime = function (val) {
          return val < 10 ? '0' + val : val
        }
        let st = this.formData.serviceTime
        let start = fmtTime(st[0].getHours()) + ':' + fmtTime(st[0].getMinutes()) + ':' + fmtTime(st[0].getSeconds())
        let end = fmtTime(st[1].getHours()) + ':' + fmtTime(st[1].getMinutes()) + ':' + fmtTime(st[1].getSeconds())
        return start + '-' + end
      },
      set: function (newValue) {
        let t = newValue.split('-')
        this.formData.serviceTime = [new Date('2016-09-10 ' + t[0]), new Date('2016-09-10 ' + t[1])]
      }
    },
    routeName () {
      return this.type === '1' ? '商品列表' : this.type === '2' ? '下架的商品' : this.type === '3' ? '被推荐的商品' : '被禁用的商品'
    },
    routeCode () {
      return this.type === '1' ? 'Goods' : this.type === '2' ? 'OffTheShelf' : this.type === '3' ? 'BeBanned' : ''
    }
  },
  beforeDestroy () {
    window.google.maps.event.clearInstanceListeners(window)
    window.google.maps.event.clearInstanceListeners(document)
    // window.google.maps.event.clearInstanceListeners(document.getElementById('map'))
    this.map = null
    this.marker = null
    this.infoWindow = null
  },
  mounted () {
    this.getDetails((lat, lng, loc) => {
      loadScript(GOOGLE_MAP_URL, () => {
        this.map = new window.google.maps.Map(document.getElementById('map'))
        this.marker = new window.google.maps.Marker({
          map: this.map
        })
        this.infoWindow = new window.google.maps.InfoWindow({map: this.map})
        if (!lat || !lng || !loc) {
          // 没有设置地理位置，默认显示当前位置
          if (navigator.geolocation) {
            this.showCurrPos()
          } else {
            this.$message.error('Error: Your browser doesn\'t support geolocation.')
          }
        } else {
          let pos = {
            lat: Number(lat),
            lng: Number(lng)
          }
          this.map.setCenter(pos)
          this.map.setZoom(GOOGLE_MAP_INIT_ZOOM)
          this.marker.setPosition(pos)
          this.infoWindow.open(this.marker.get('map'), this.marker)
          this.infoWindow.setContent(loc)
        }
        this.map.addListener('click', (e) => {
          let latLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          }
          this.formData.latitude = latLng.lat
          this.formData.longitude = latLng.lng
          this.formData.location = ''
          this.map.panTo(latLng)
          this.marker.setPosition(latLng)
          this.infoWindow.open(this.marker.get('map'), this.marker)
          this.infoWindow.setContent('')
          let latlngStr = e.latLng.lat() + ',' + e.latLng.lng()
          axios.get(GOOGLE_BASE_URL, {
            params: {
              latlng: latlngStr
            }
          }).then((res) => {
            if (res.data.results.length !== 0) {
              this.infoWindow.setContent(res.data.results[0].formatted_address)
              this.formData.location = res.data.results[0].formatted_address
            } else {
              this.infoWindow.setContent('Location not found.')
            }
          }).catch(() => {
            this.$message.error('网络连接错误！')
          })
        })
      })
    })
  },
  methods: {
    showCurrPos () {
      navigator.geolocation.getCurrentPosition((position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.map.setCenter(pos)
        this.map.setZoom(GOOGLE_MAP_INIT_ZOOM)
        this.marker.setPosition(pos)
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.$message.error('PERMISSION_DENIED')
            console.log('')
            break
          case error.POSITION_UNAVAILABLE:
            this.$message.error('POSITION_UNAVAILABLE')
            break
          case error.TIMEOUT:
            this.$message.error('TIMEOUT')
            break
          case error.UNKNOWN_ERROR:
            this.$message.error('UNKNOWN_ERROR')
            break
        }
      })
    },
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
    getDetails (cb) {
      this.$axios.get('/commodity', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res.data.data.commodity)
          this.formData.clicks = res.data.data.commodity.clicks
          this.formData.top = res.data.data.commodity.top
          this.formData.disabled = res.data.data.commodity.disabled
          this.formData.name = res.data.data.commodity.name
          this.goodsType = res.data.data.commodity.commodity_type
          this.fileList = [{name: 'goods.jpeg', url: res.data.data.commodity.picture}]
          this.formData.phone = res.data.data.commodity.phone
          this.formData.price = res.data.data.commodity.price
          this.formData.booking = res.data.data.commodity.booking
          this.formData.video = res.data.data.commodity.video
          this.formData.description = res.data.data.commodity.description
          this.formData.location = res.data.data.commodity.location
          this.formData.longitude = res.data.data.commodity.longitude
          this.formData.latitude = res.data.data.commodity.latitude
          this.postServiceTime = res.data.data.commodity.ServiceTime
          cb(res.data.data.commodity.latitude, res.data.data.commodity.longitude, res.data.data.commodity.location)
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
      if (this.$refs.form.$el.picture.files.length === 0 && this.fileList.length === 0) {
        this.$message.error('请选择商品头图')
        return false
      }
      if (!this.formData.price) {
        this.$message.error('请填写商品价格')
        return false
      }
      if (!this.formData.location) {
        this.$message.error('请选择地理位置')
        return false
      }
      if (!this.formData.booking || !isUrl(this.formData.booking)) {
        this.$message.error('请填写商品链接')
        return false
      }
      if (!this.formData.description) {
        this.$message.error('请编辑商品描述')
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
          formData.append('commodity_type', this.goodsType)
          formData.append('picture', blob)
          formData.append('location', this.formData.location)
          formData.append('longitude', this.formData.longitude)
          formData.append('latitude', this.formData.latitude)
          formData.append('service_time', this.postServiceTime)
          formData.append('phone', this.formData.phone)
          formData.append('price', this.formData.price)
          formData.append('booking', this.formData.booking)
          formData.append('video', this.formData.video)
          formData.append('description', this.formData.description)
          this.$axios.put('/commodity', formData).then(res => {
            this.clicked = false
            if (parseInt(res.data.code) === 200) {
              this.$message({
                type: 'success',
                message: '修改商品成功!'
              })
            } else {
              this.$message.error('修改商品发生错误！')
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
        formData.append('commodity_type', this.goodsType)
        formData.append('picture', this.fileList[0].url)
        formData.append('location', this.formData.location)
        formData.append('longitude', this.formData.longitude)
        formData.append('latitude', this.formData.latitude)
        formData.append('service_time', this.postServiceTime)
        formData.append('phone', this.formData.phone)
        formData.append('price', this.formData.price)
        formData.append('booking', this.formData.booking)
        formData.append('video', this.formData.video)
        formData.append('description', this.formData.description)
        this.$axios.put('/commodity', formData).then(res => {
          this.clicked = false
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '修改商品成功!'
            })
          } else {
            this.$message.error('修改商品发生错误！')
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
  .service-time{
    width: 100% !important;
  }
  .map{
    height: 400px;
    background-color: #ddd;
  }
  .form-warpper{
    margin-top: 40px;
    width: 600px;
  }
</style>
