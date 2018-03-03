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
      <el-form label-position="right" :model="formData" label-width="120px" :disabled="false">
        <el-form-item label="商品ID">
          <el-input disabled v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item label="点击量">
          <el-input disabled v-model="formData.clicks"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-radio disabled v-model="formData.top" :label="true">推荐</el-radio>
          <el-radio disabled v-model="formData.top" :label="false">不推荐</el-radio>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-radio disabled v-model="formData.disabled" :label="true">禁用</el-radio>
          <el-radio disabled v-model="formData.disabled" :label="false">不禁用</el-radio>
        </el-form-item>
        <el-form-item label="商户ID">
          <el-input disabled v-model="formData.merchantId"></el-input>
        </el-form-item>
        <el-form-item label="商品标题">
          <el-input disabled v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select disabled v-model="goodsType" placeholder="请选择" size="medium">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品头图">
          <img v-if="formData.picture" class="pic-view" :src="formData.picture" alt="">
          <span class="no-pic" v-else>无商品头图</span>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input disabled v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="营业时间">
          <el-time-picker
            class="service-time"
            is-range
            disabled
            v-model="formData.serviceTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input disabled v-model="formData.location"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input disabled v-model="formData.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input disabled v-model="formData.latitude"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input disabled v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="商品链接">
          <el-input disabled v-model="formData.booking"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input disabled v-model="formData.video"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input disabled type="textarea" placeholder="请编辑商品描述" v-model="formData.description" :autosize="{ minRows: 5, maxRows: 12}"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit" size="small">立即修改</el-button>-->
          <el-button @click="cancel" size="small">返回上一级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'ProductDetails',
  data () {
    return {
      type: this.$route.query.type + '',
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
      return this.type === '1' ? '商品列表' : this.type === '2' ? '推荐的商品' : this.type === '3' ? '禁用的商品' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'Product' : this.type === '2' ? 'Recommend' : this.type === '3' ? 'Forbidden' : ''
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    onSubmit () {},
    getDetails () {
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
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
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
</style>
