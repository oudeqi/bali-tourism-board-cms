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
      <el-form label-position="right" :model="formData" label-width="150px" :disabled="false">
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
        <el-form-item label="Merchant ID">
          <el-input disabled v-model="formData.merchantId"></el-input>
        </el-form-item>
        <el-form-item label="Product Title">
          <el-input disabled v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="Product Type">
          <el-select disabled v-model="goodsType" size="medium">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Product Image">
          <img v-if="formData.picture" class="pic-view" :src="formData.picture" alt="">
          <span class="no-pic" v-else>Non commodity display pictures</span>
        </el-form-item>
        <el-form-item label="Price">
          <el-input disabled v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="Business Hours">
          <el-time-picker
            class="service-time"
            is-range
            disabled
            v-model="formData.serviceTime"
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
            placeholder="Choice of time range"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="Address">
          <el-input disabled v-model="formData.location"></el-input>
        </el-form-item>
        <el-form-item label="Longitude">
          <el-input disabled v-model="formData.longitude"></el-input>
        </el-form-item>
        <el-form-item label="Latitude">
          <el-input disabled v-model="formData.latitude"></el-input>
        </el-form-item>
        <el-form-item label="Location">
          <div class="map" id="map"></div>
        </el-form-item>
        <el-form-item label="Contact">
          <el-input disabled v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="Link">
          <el-input disabled v-model="formData.booking"></el-input>
        </el-form-item>
        <el-form-item label="Video Link">
          <el-input disabled v-model="formData.video"></el-input>
        </el-form-item>
        <el-form-item label="Product Description">
          <el-input disabled type="textarea" placeholder="Please edit the description" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit" size="small">立即修改</el-button>-->
          <el-button @click="cancel" size="small">Back to previous page</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { loadScript } from '../utils'
import { GOOGLE_MAP_URL, GOOGLE_MAP_INIT_ZOOM } from '../config.js'
export default {
  name: 'ProductDetails',
  data () {
    return {
      type: this.$route.query.type + '',
      map: null,
      marker: null,
      infoWindow: null,
      formData: {
        id: this.$route.params.id,
        serviceTime: [null, null],
        clicks: '',
        top: false,
        disabled: false,
        merchantId: '',
        name: '',
        price: '',
        location: '',
        longitude: '',
        latitude: '',
        phone: '',
        booking: '',
        video: '',
        description: '',
        picture: ''
      },
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
      return this.type === '1' ? 'Product List' : this.type === '2' ? 'Recommended Product' : this.type === '3' ? 'Blacklist Product' : 'none'
    },
    routeCode () {
      return this.type === '1' ? 'Product' : this.type === '2' ? 'Recommend' : this.type === '3' ? 'Forbidden' : ''
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
      console.log(lat, lng, typeof loc)
      loadScript(GOOGLE_MAP_URL, () => {
        this.map = new window.google.maps.Map(document.getElementById('map'))
        this.marker = new window.google.maps.Marker({
          map: this.map
        })
        this.infoWindow = new window.google.maps.InfoWindow({map: this.map})
        let pos = {
          lat: Number(lat),
          lng: Number(lng)
        }
        this.map.setCenter(pos)
        this.map.setZoom(GOOGLE_MAP_INIT_ZOOM)
        this.marker.setPosition(pos)
        this.infoWindow.open(this.marker.get('map'), this.marker)
        this.infoWindow.setContent(loc || 'No location is set')
      })
    })
  },
  methods: {
    onSubmit () {},
    getDetails (cb) {
      this.$axios.get('/commodity', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res)
          this.formData.clicks = res.data.data.commodity.clicks
          this.formData.top = res.data.data.commodity.top
          this.formData.disabled = res.data.data.commodity.disabled
          this.formData.merchantId = res.data.data.commodity.merchant_id
          this.formData.name = res.data.data.commodity.name
          this.goodsType = res.data.data.commodity.commodity_type
          this.formData.picture = res.data.data.commodity.picture
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
    back () {
      // router.push({name: this.routeCode})
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
  .service-time{
    width: 100% !important;
  }
  .pic-view {
    max-height: 150px;
  }
  .no-pic {
    color: #bbb;
  }
  .map{
    height: 400px;
    background-color: #ddd;
  }
</style>
