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
        <el-form-item label="是否推荐">
          <el-radio disabled v-model="formData.top" :label="true">推荐</el-radio>
          <el-radio disabled v-model="formData.top" :label="false">不推荐</el-radio>
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
              :before-upload="beforeAvatarUpload"
              :on-exceed="handleExceed">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" required>
          <el-input v-model="formData.price"></el-input>
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
  name: 'GoodsDetails',
  data () {
    return {
      type: this.$route.query.type + '',
      formData: {
        id: this.$route.params.id,
        clicks: '',
        top: false,
        name: '',
        phone: '',
        price: '',
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
    routeName () {
      return this.type === '1' ? '商品列表' : this.type === '2' ? '下架的商品' : this.type === '3' ? '被推荐的商品' : '被禁用的商品'
    },
    routeCode () {
      return this.type === '1' ? 'Goods' : this.type === '2' ? 'OffTheShelf' : this.type === '3' ? 'BeBanned' : ''
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
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
    onSubmit () {},
    getDetail () {
      this.$axios.get('/commodity', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res.data.data.commodity)
          this.formData.clicks = res.data.data.commodity.clicks
          this.formData.top = res.data.data.commodity.top
          this.formData.name = res.data.data.commodity.name
          this.goodsType = res.data.data.commodity.commodity_type
          this.fileList = [{name: 'goods.jpeg', url: res.data.data.commodity.picture}]
          this.formData.phone = res.data.data.commodity.phone
          this.formData.price = res.data.data.commodity.price
          this.formData.booking = res.data.data.commodity.booking
          this.formData.video = res.data.data.commodity.video
          this.formData.description = res.data.data.commodity.description
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
</style>
