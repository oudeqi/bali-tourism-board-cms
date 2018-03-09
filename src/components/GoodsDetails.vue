<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>Product Details</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="formData" label-width="150px" :disabled="false" ref="form">
        <el-form-item label="Product ID">
          <el-input disabled v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="Click Number">
          <el-input disabled v-model="formData.clicks"></el-input>
        </el-form-item>
        <el-form-item label="Recommended">
          <el-radio disabled v-model="formData.top" :label="true">true</el-radio>
          <el-radio disabled v-model="formData.top" :label="false">false</el-radio>
        </el-form-item>
        <el-form-item label="Block">
          <el-radio disabled v-model="formData.disabled" :label="true">true</el-radio>
          <el-radio disabled v-model="formData.disabled" :label="false">false</el-radio>
        </el-form-item>
        <el-form-item label="Product Title" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="Product Type">
          <el-select v-model="goodsType" size="medium">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Product Image" required>
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
            <el-button @click="handleCropPicView" size="small">View the cutting results</el-button>
          </div>
        </el-form-item>
        <el-form-item label="Price" required>
          <el-input v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="Business Hours" required>
          <el-time-picker
            class="service-time"
            is-range
            v-model="formData.serviceTime"
            format="hh:mm A"
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
            placeholder="Choice of time range"
            :editable="false"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="Location" required>
          <div style="display: none;">
            <el-input v-model="formData.location"></el-input>
            <el-input v-model="formData.longitude"></el-input>
            <el-input v-model="formData.latitude"></el-input>
          </div>
          <div class="map" id="map"></div>
        </el-form-item>
        <el-form-item label="Contact">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Website Link" required>
          <el-input v-model="formData.booking"></el-input>
        </el-form-item>
        <el-form-item label="Video Link">
          <el-input v-model="formData.video"></el-input>
        </el-form-item>
        <el-form-item label="Product Description" required>
          <el-input type="textarea" placeholder="Please edit the description" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">modify</el-button>
          <el-button @click="cancel" size="small">Back to previous page</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="Picture preview" :visible.sync="cropImgDialogVisible" width="50%" center>
      <div class="pic-view--lg" id="crop-pic-view"></div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import Cropper from 'cropperjs'
import { isUrl, loadScript } from '../utils'
import {
  GOOGLE_MAP_URL,
  GOOGLE_BASE_URL,
  GOOGLE_MAP_INIT_ZOOM,
  NEW_CROPPER_OPTIONS_HORIZONTAL,
  GET_CROPPED_CANVAS_OPTIONS_HORIZONTAL,
  GOOGLE_MAP_DEFAULT_LOCATION
} from '../config.js'

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
        label: 'Attraction'
      }, {
        value: 'restaurant',
        label: 'Restaurant'
      }, {
        value: 'tour',
        label: 'Tour'
      }, {
        value: 'transport',
        label: 'Transport'
      }]
    }
  },
  computed: {
    postServiceTime: {
      get: function () {
        const paddLeft0 = function (val) {
          return val < 10 ? '0' + val : val
        }
        const fmt24to12 = function (val) {
          if (val === 0) {
            val = 12
          }
          return val > 12 ? paddLeft0(val - 12) : paddLeft0(val)
        }
        const fmtAMPM = function (val) {
          return val >= 12 ? 'PM' : 'AM'
        }
        let st = this.formData.serviceTime
        if (st[0] && st[1]) {
          let start = fmt24to12(st[0].getHours()) + '.' + paddLeft0(st[0].getMinutes()) + ' ' + fmtAMPM(st[0].getHours())
          let end = fmt24to12(st[1].getHours()) + '.' + paddLeft0(st[1].getMinutes()) + ' ' + fmtAMPM(st[1].getHours())
          return start + '-' + end
        } else {
          return ''
        }
      },
      set: function (newValue) {
        // 02.20 AM-11.13 PM
        // am 12-1-2-...-11   pm 12-1-2-...-11
        // am 00-1-2-...-11   pm 12-13-14-...-23
        let t = newValue.split('-')
        if (newValue.indexOf('NaN') !== -1 || newValue.indexOf('.') === -1) {
          this.formData.serviceTime = [null, null]
          return
        }
        if (newValue.indexOf('AM') !== -1 || newValue.indexOf('PM') !== -1) {
          // 开始时间
          let startH = t[0].split(' ')[0].split('.')[0]
          let startM = t[0].split(' ')[0].split('.')[1]
          let start
          if (t[0].indexOf('AM') !== -1) {
            if (parseInt(startH) === 12) {
              start = '00:' + startM + ':00'
            } else {
              start = startH + ':' + startM + ':00'
            }
          } else {
            if (parseInt(startH) === 12) {
              start = '12:' + startM + ':00'
            } else if (parseInt(startH) >= 10) {
              start = (parseInt(startH) + 12) + ':' + startM + ':00'
            } else {
              start = (parseInt(startH[1]) + 12) + ':' + startM + ':00'
            }
          }
          // 结束时间
          let endH = t[1].split(' ')[0].split('.')[0]
          let endM = t[1].split(' ')[0].split('.')[1]
          let end
          if (t[1].indexOf('AM') !== -1) {
            if (parseInt(endH) === 12) {
              end = '00:' + endM + ':00'
            } else {
              end = endH + ':' + endM + ':00'
            }
          } else {
            if (parseInt(endH) === 12) {
              end = '12:' + endM + ':00'
            } else if (parseInt(endH) >= 10) {
              end = (parseInt(endH) + 12) + ':' + endM + ':00'
            } else {
              end = (parseInt(endH[1]) + 12) + ':' + endM + ':00'
            }
          }
          this.formData.serviceTime = [new Date('2016-09-10 ' + start), new Date('2016-09-10 ' + end)]
        } else {
          if (t.length === 2 && t[0].indexOf('NaN') === -1 && t[1].indexOf('NaN') === -1) {
            this.formData.serviceTime = [new Date('2016-09-10 ' + t[0]), new Date('2016-09-10 ' + t[1])]
          } else {
            this.formData.serviceTime = [null, null]
          }
        }
      }
    },
    routeName () {
      return this.type === '1' ? 'Product List' : this.type === '2' ? 'Under The Shelves' : this.type === '3' ? 'Recommended Product' : 'Blacklist Product'
    },
    routeCode () {
      return this.type === '1' ? 'Goods' : this.type === '2' ? 'OffTheShelf' : this.type === '3' ? 'BeBanned' : ''
    }
  },
  beforeDestroy () {
    if (window.google) {
      window.google.maps.event.clearInstanceListeners(window)
      window.google.maps.event.clearInstanceListeners(document)
      // window.google.maps.event.clearInstanceListeners(document.getElementById('map'))
    }
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
          console.log(e)
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
            console.log('clicked get location', res.data)
            if (!res.data.error_message || res.data.results.length !== 0) {
              this.infoWindow.setContent(res.data.results[0].formatted_address)
              this.formData.location = res.data.results[0].formatted_address
            } else {
              this.infoWindow.setContent('Location not found.')
            }
          }).catch(() => {
            this.$message.error('Network connection error')
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
        console.log('default LOCATION', GOOGLE_MAP_DEFAULT_LOCATION)
        this.map.setCenter(GOOGLE_MAP_DEFAULT_LOCATION)
        this.map.setZoom(GOOGLE_MAP_INIT_ZOOM)
        this.marker.setPosition(GOOGLE_MAP_DEFAULT_LOCATION)
        this.infoWindow.open(this.marker.get('map'), this.marker)
        this.infoWindow.setContent('')
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
        this.cropper = new Cropper(image, NEW_CROPPER_OPTIONS_HORIZONTAL)
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
      let croppedCanvas = this.cropper.getCroppedCanvas(GET_CROPPED_CANVAS_OPTIONS_HORIZONTAL)
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
        this.$message.error('Network connection error')
      })
    },
    submitUpload (e) {
      e.preventDefault()
      console.log(this.postServiceTime)
      console.log(this.formData.serviceTime)
      if (!this.formData.name) {
        this.$message.error('Please enter the title')
        return false
      }
      if (this.formData.name.length > 50) {
        this.$message.error('The title is limited to 50 words')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 0 && this.fileList.length === 0) {
        this.$message.error('Please choose the product image')
        return false
      }
      if (!this.formData.price) {
        this.$message.error('Please fill in the price of the goods')
        return false
      }
      if (!this.formData.location) {
        this.$message.error('Please choose geographical location')
        return false
      }
      if (!this.formData.booking) {
        this.$message.error('Please fill in the website link')
        return false
      }
      if (!isUrl(this.formData.booking)) {
        this.$message.error('website link incorrectly formatting')
        return false
      }
      if (!this.formData.description) {
        this.$message.error('Please edit the description')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 1) {
        if (this.clicked) {
          return false
        }
        this.clicked = true
        let croppedCanvas = this.cropper.getCroppedCanvas(GET_CROPPED_CANVAS_OPTIONS_HORIZONTAL)
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
                message: 'Amend the success'
              })
            } else {
              this.$message.error('Amend a error')
            }
          }).catch((e) => {
            this.clicked = false
            this.$message.error('Network connection error')
          })
        }, 'image/jpeg', 0.95)
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
              message: 'Amend the success'
            })
          } else {
            this.$message.error('Amend a error')
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
