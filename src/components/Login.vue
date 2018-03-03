<template>
  <el-container>
    <el-header>
      <h1>
        <a href="javascript:void(0);">Bali Tourism Board CMS</a>
      </h1>
    </el-header>
    <el-main>
      <div @keyup.13="handleKeyUp">
        <el-form :label-position="'right'" label-width="80px" :model="loginDate">
          <el-form-item label="账号">
            <el-input v-model="loginDate.name" placeholder="用户名 / 邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="loginDate.password" auto-complete="off" placeholder="请输入密码"></el-input>
            <p class="forget">
              <!--<a href="javascript:void(0);">忘记密码?</a>-->
            </p>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" type="primary" @click="submitForm()">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>

import { VERSION } from '../config.js'
import { trim } from 'lodash'
import router from '../router'
import Qs from 'qs'

export default {
  name: 'Login',
  data () {
    return {
      loginDate: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    handleKeyUp (e) {
      if (e.target.type === 'password') {
        this.submitForm()
      }
    },
    submitForm () {
      if (!this.loginDate.name) {
        this.$message.error('请输入用户名，或者邮箱！')
        return false
      }
      if (!this.loginDate.password) {
        this.$message.error('请输入密码！')
        return false
      }
      let formData = new FormData()
      formData.append('name', trim(this.loginDate.name))
      formData.append('password', this.loginDate.password)
      this.$axios.post('/manager/signin', formData).then(res => {
        if (parseInt(res.data.code) === 206) {
          this.$message.error('账户或者密码错误')
        } else {
          if (window.localStorage) {
            let userInfo = {
              createTime: res.data.data.user.create_time,
              lastLogin: res.data.data.user.last_login,
              id: res.data.data.user.id,
              type: res.data.data.user.is_admin ? 'admin' : 'user',
              name: res.data.data.user.name || res.data.data.user.email,
              password: res.data.data.user.password,
              loginTime: new Date().getTime(),
              v: VERSION
            }
            window.localStorage.setItem('userInfo', Qs.stringify(userInfo))
            if (userInfo.type === 'admin') {
              router.push({name: 'AdminIndex'})
            } else {
              router.push({name: 'UserIndex'})
            }
          } else {
            alert('浏览器版本过低')
          }
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .el-header{
    background-color: #409EFF;
    color: #fff;
    text-align: center;
    line-height: 60px;
    h1 a{
      color: #fff;
    }
  }

  .el-main {
    background-color: #fff;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-form{
    width: 350px;
    padding-bottom: 150px;
    .forget{
      line-height: 1.3;
      font-size: 13px;
      text-align: right;
      padding-top: 10px;
      padding-right: 10px;
      a{
        color: #666;
        &:hover{
          color: #F56C6C;
          text-decoration: underline;
        }
      }
    }
  }

</style>
