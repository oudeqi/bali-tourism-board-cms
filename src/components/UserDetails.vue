<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="120px" :disabled="false">
        <el-form-item label="用户ID">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="注册类型">
          <el-input disabled v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input disabled v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input disabled v-model="form.phone"></el-input>
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
  name: 'UserDetail',
  data () {
    return {
      form: {
        id: '',
        name: '',
        phone: '',
        password: '',
        type: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$axios.get('/user', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res)
          this.form.id = res.data.data.user.id
          this.form.type = res.data.data.user.signup_type
          this.form.name = res.data.data.user.name
          this.form.password = res.data.data.user.password
          this.form.phone = res.data.data.user.phone
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
