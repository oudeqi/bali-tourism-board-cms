<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reseller' }">商家列表</el-breadcrumb-item>
      <el-breadcrumb-item>注册商家</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.name" placeholder="请填入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input v-model="form.email" placeholder="邮箱是商户登录的账号"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" placeholder="请填入有效的联系方式"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="form.password" placeholder="请填入6到18位字母、或数字、或下划线的组合"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">立即创建</el-button>
          <el-button @click="cancel" size="small">返回上一级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { debounce } from 'lodash'
export default {
  name: 'ResellerAdd',
  data () {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit: debounce(function (e) {
      e.preventDefault()
      if (this.form.name && this.form.name.length > 10) {
        this.$message.error('昵称的字数过长！')
        return false
      }
      if (!this.form.email) {
        this.$message.error('邮箱是必填字段！')
        return false
      }
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.form.email)) {
        this.$message.error('邮箱格式错误！')
        return false
      }
      if (this.form.phone && !/^\d{11}$/.test(this.form.phone)) {
        this.$message.error('手机号码格式错误！')
        return false
      }
      if (!this.form.password) {
        this.$message.error('密码是必填字段！')
        return false
      }
      if (!/[0-9A-Za-z_]{6,18}$/.test(this.form.password)) {
        this.$message.error('密码是6到18位字母、或数字、或下划线的组合！')
        return false
      }
      let formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('email', this.form.email)
      formData.append('phone', this.form.phone)
      formData.append('password', this.form.password)
      this.$axios.post('/manager/signup', formData).then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          this.$message({
            message: '恭喜你，添加成功',
            type: 'success'
          })
        } else if (parseInt(res.data.code) === 201) {
          this.$message.error('邮箱已经被占用！')
        }
      }).catch((e) => {
        console.log(e)
        this.$message.error('网络连接错误！')
      })
    }),
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
  .el-form-item__label:after{
    content: "*";
  }
</style>
