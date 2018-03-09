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
        <el-form-item label="Account creation time">
          <el-input disabled v-model="form.createDate"></el-input>
        </el-form-item>
        <el-form-item label="Recent active time">
          <el-input disabled v-model="form.lastLogin"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input disabled v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Nickname">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="Phone number">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">Modify</el-button>
          <el-button @click="cancel" size="small">Back</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { isEmail } from '../utils'
export default {
  name: 'ResellerDetails',
  data () {
    return {
      clicked: false,
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
          if (res.data.data.user.create_time) {
            this.form.createDate = new Date(parseInt(res.data.data.user.create_time) * 1000).toString()
          } else {
            this.form.createDate = ''
          }
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
    onSubmit (e) {
      e.preventDefault()
      if (!this.form.password) {
        this.$message.error('Please enter the password')
        return false
      }
      if (!/[0-9A-Za-z_]{6,18}$/.test(this.form.password)) {
        this.$message.error('A password is a combination of 6 to 18 letters, or numbers, or underlines.')
        return false
      }
      if (!isEmail(this.form.email)) {
        this.$message.error('Mailbox format error')
        return false
      }
      if (this.clicked) {
        return false
      }
      this.clicked = true
      let formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('name', this.form.name)
      formData.append('password', this.form.password)
      formData.append('phone', this.form.phone)
      formData.append('email', this.form.email)
      this.$axios.put('/manager', formData).then(res => {
        this.clicked = false
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          this.$message({
            type: 'success',
            message: 'Amend the success'
          })
        } else {
          this.$message.error('Amend a error')
        }
      }).catch((e) => {
        this.clicked = false
        this.$message.error('Network connection error')
      })
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
