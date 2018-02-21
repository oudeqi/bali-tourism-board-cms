<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reseller' }">商家列表</el-breadcrumb-item>
      <el-breadcrumb-item>商家详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="120px" :disabled="false">
        <el-form-item label="商家ID">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input disabled v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input disabled v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input disabled v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号创建时间">
          <el-input disabled v-model="form.createDate"></el-input>
        </el-form-item>
        <el-form-item label="最近活跃时间">
          <el-input disabled v-model="form.lastLogin"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit" size="small">立即修改</el-button>-->
          <el-button @click="cancel" size="small">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'ResellerDetails',
  data () {
    return {
      form: {
        id: '',
        name: '',
        password: '',
        email: '',
        phone: '',
        createDate: '',
        lastLogin: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$axios.get('/manager', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res)
          this.form.id = res.data.data.user.id
          this.form.name = res.data.data.user.name
          this.form.password = res.data.data.user.password
          this.form.email = res.data.data.user.email
          this.form.phone = res.data.data.user.phone
          this.form.createDate = res.data.data.user.create_time
          this.form.lastLogin = res.data.data.user.last_login
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    onSubmit () {},
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
