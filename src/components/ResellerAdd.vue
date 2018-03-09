<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reseller' }">Merchant List</el-breadcrumb-item>
      <el-breadcrumb-item>Add Merchant</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="form" label-width="150px">
        <el-form-item label="Nickname">
          <el-input v-model="form.name" placeholder="Please fill in the nickname"></el-input>
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="form.email" placeholder="The mailbox is the account registered by the merchant"></el-input>
        </el-form-item>
        <el-form-item label="Phone number">
          <el-input v-model="form.phone" placeholder="Please fill in the effective way of contact"></el-input>
        </el-form-item>
        <el-form-item label="Password" required>
          <el-input v-model="form.password" placeholder="Please fill in a combination of 6 to 18 letters, or numbers, or underlines."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">Add</el-button>
          <el-button @click="cancel" size="small">Back</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { debounce } from 'lodash'
import { isEmail, isPassword } from '../utils'
export default {
  name: 'ResellerAdd',
  data () {
    return {
      clicked: false,
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
        this.$message.error('Limited to 10 words')
        return false
      }
      if (!this.form.email) {
        this.$message.error('The email is a required field')
        return false
      }
      if (!isEmail(this.form.email)) {
        this.$message.error('Mailbox format error')
        return false
      }
      /* if (this.form.phone && !/^\d{11}$/.test(this.form.phone)) {
        this.$message.error('Mobile phone number format error')
        return false
      } */
      if (!this.form.password) {
        this.$message.error('The password is required')
        return false
      }
      if (!isPassword(this.form.password)) {
        this.$message.error('A password is a combination of 6 to 18 letters, or numbers, or underlines.')
        return false
      }
      if (this.clicked) {
        return false
      }
      this.clicked = true
      let formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('email', this.form.email)
      formData.append('phone', this.form.phone)
      formData.append('password', this.form.password)
      this.$axios.post('/manager/signup', formData).then(res => {
        this.clicked = false
        if (parseInt(res.data.code) === 200) {
          this.$message({
            message: 'Add success',
            type: 'success'
          })
        } else if (parseInt(res.data.code) === 201) {
          this.$message.error('Mailbox has been occupied')
        }
      }).catch((e) => {
        this.clicked = false
        this.$message.error('Network connection error')
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
