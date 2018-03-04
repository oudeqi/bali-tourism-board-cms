<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reseller' }">Merchant List</el-breadcrumb-item>
      <el-breadcrumb-item>Merchant Details</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="160px" :disabled="false">
        <el-form-item label="Merchant ID">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input disabled v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input disabled v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input disabled v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Phone number">
          <el-input disabled v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="Account creation time">
          <el-input disabled v-model="form.createDate"></el-input>
        </el-form-item>
        <el-form-item label="Recent active time">
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
