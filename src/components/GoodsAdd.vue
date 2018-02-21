<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">商品列表</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="formData" label-width="120px" :disabled="false" ref="form">
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
          <el-button type="primary" @click="onSubmit" size="small">提交</el-button>
          <el-button @click="cancel" size="small">返回上一级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import {isUrl} from '../utils'
export default {
  name: 'GoodsAdd',
  data () {
    return {
      type: this.$route.query.type + '',
      clicked: false,
      formData: {
        name: '',
        phone: '',
        price: '',
        booking: '',
        video: '',
        description: ''
      },
      goodsType: 'attraction',
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
      return this.type === '1' ? '商品列表' : this.type === '2' ? '下架的商品' : this.type === '3' ? '被禁用的商品' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'Goods' : this.type === '2' ? 'OffTheShelf' : this.type === '3' ? 'BeBanned' : ''
    }
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
    onSubmit (e) {
      e.preventDefault()
      if (!this.formData.name) {
        this.$message.error('请输入新闻标题')
        return false
      }
      if (this.formData.name.length > 50) {
        this.$message.error('新闻标题限制在50个字以内')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 0) {
        this.$message.error('请选择商品头图')
        return false
      }
      if (!this.formData.price) {
        this.$message.error('请填写商品价格')
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
      if (this.clicked) {
        return false
      }
      this.clicked = true
      let formData = new FormData()
      formData.append('name', this.formData.name)
      formData.append('commodity_type', this.goodsType)
      formData.append('picture', this.$refs.form.$el.picture.files[0])
      formData.append('phone', this.formData.phone)
      formData.append('price', this.formData.price)
      formData.append('booking', this.formData.booking)
      formData.append('video', this.formData.video)
      formData.append('description', this.formData.description)
      this.$axios.post('/commodity', formData).then(res => {
        this.clicked = false
        if (parseInt(res.data.code) === 200) {
          this.$message({
            type: 'success',
            message: '添加商品成功!'
          })
        } else {
          this.$message.error('添加商品发生错误！')
        }
      }).catch((e) => {
        this.clicked = false
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
