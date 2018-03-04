<template>
  <div class="form-warpper">
    <h1>merchant Info</h1>
    <el-form label-position="right" :model="formData" label-width="120px" :disabled="false" ref="form">
      <el-form-item label="ID">
        <el-input disabled v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item label="Registration time">
        <el-input disabled v-model="formData.createTime"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input disabled v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input disabled v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="back" size="small">Back</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import router from '../router'
import Qs from 'qs'
export default {
  name: 'ResellerInfo',
  data () {
    return {
      formData: {
        id: '',
        createTime: '',
        email: '',
        password: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    back () {
      router.go(-1)
    },
    getDetails () {
      let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
      this.formData.id = userInfo.id
      this.formData.createTime = userInfo.createTime
      this.formData.email = userInfo.name
      this.formData.password = userInfo.password
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-warpper{
    width: 600px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
