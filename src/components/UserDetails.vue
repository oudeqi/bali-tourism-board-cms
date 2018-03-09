<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">User List</el-breadcrumb-item>
      <el-breadcrumb-item>User Details</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="150px" :disabled="false">
        <el-form-item label="User ID">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="Register Type">
          <el-input disabled v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="User Name">
          <el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input disabled v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number">
          <el-input disabled v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="Recent login Time">
          <el-input disabled v-model="form.lastLogin"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit" size="small">立即修改</el-button>-->
          <el-button @click="cancel" size="small">Back</el-button>
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
        type: '',
        lastLogin: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$axios.get('/user/admin', {
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
          if (res.data.data.user.last_login) {
            this.form.lastLogin = new Date(parseInt(res.data.data.user.last_login) * 1000).toString()
          } else {
            this.form.lastLogin = ''
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('Network connection error')
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
