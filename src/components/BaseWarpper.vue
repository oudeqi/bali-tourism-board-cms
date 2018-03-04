<template>
  <el-container>
    <el-header>
      <h1>
        <a href="javascript:void(0);">Bali Tourism Board CMS</a>
      </h1>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.name || 'nameless'}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="userInfo.type === 'user'" command="info">Profiles</el-dropdown-item>
          <el-dropdown-item command="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="260px">
        <el-menu v-if="userInfo.type === 'admin'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/admin">
            <i class="el-icon-setting"></i><span slot="title">Homepage</span>
          </el-menu-item>
          <el-menu-item index="/launch">
            <i class="el-icon-setting"></i><span slot="title">Splash Screen Management</span>
          </el-menu-item>
          <el-submenu index="/banner">
            <template slot="title">
              <i class="el-icon-setting"></i><span>Banner Management</span>
            </template>
            <el-menu-item index="/banner/list">Banner List</el-menu-item>
            <el-menu-item index="/banner/active">Active Banner</el-menu-item>
          </el-submenu>
          <el-submenu index="/news">
            <template slot="title">
              <i class="el-icon-setting"></i><span>News Management</span>
            </template>
            <el-menu-item index="/news/list">News List</el-menu-item>
            <el-menu-item index="/news/top">Recommended News</el-menu-item>
          </el-submenu>
          <el-menu-item index="/user">
            <i class="el-icon-setting"></i><span slot="title">User Management</span>
          </el-menu-item>
          <el-menu-item index="/reseller">
            <i class="el-icon-setting"></i><span slot="title">Merchant Management</span>
          </el-menu-item>
          <el-submenu index="/product">
            <template slot="title">
              <i class="el-icon-setting"></i><span>Product Management</span>
            </template>
            <el-menu-item index="/product/list">Product List</el-menu-item>
            <el-menu-item index="/product/recommend">Recommended Product</el-menu-item>
            <el-menu-item index="/product/forbidden">Blacklist Product</el-menu-item>
          </el-submenu>
          <el-submenu index="/about-us">
            <template slot="title">
              <i class="el-icon-setting"></i><span>App Settings</span>
            </template>
            <el-menu-item index="/about-us">About Us</el-menu-item>
            <el-menu-item index="/tos">Terms of Service</el-menu-item>
            <el-menu-item index="/privacy-policy">Privacy Policy</el-menu-item>
            <el-menu-item index="/about-bali">About Bali</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-menu v-if="userInfo.type === 'user'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/busi">
            <i class="el-icon-setting"></i><span slot="title">Homepage</span>
          </el-menu-item>
          <el-submenu index="/goods">
            <template slot="title">
              <i class="el-icon-setting"></i><span>Product Management</span>
            </template>
            <el-menu-item index="/goods/list">Product List</el-menu-item>
            <el-menu-item index="/goods/off-the-shelf">Under The Shelves</el-menu-item>
            <el-menu-item index="/goods/top">Recommended Product</el-menu-item>
            <el-menu-item index="/goods/be-banned">Blacklist Product</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import router from '../router'
import Qs from 'qs'
import { VERSION, LOGIN_LIFE_TIME } from '../config.js'
export default {
  name: 'Container',
  data () {
    return {
      userInfo: {},
      currPath: this.$route.fullPath
    }
  },
  beforeRouteEnter (to, from, next) {
    if (window.localStorage.getItem('userInfo')) {
      next(vm => {
        const userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
        const nowTime = new Date().getTime()
        vm.userInfo = userInfo
        if (!userInfo.v || parseInt(userInfo.v) < VERSION || nowTime > parseInt(userInfo.loginTime) + LOGIN_LIFE_TIME) {
          vm.$alert('Login status information expired, please log in again', 'Info', {
            confirmButtonText: 'OK',
            callback: action => {
              router.push({name: 'Login'})
            }
          })
        }
      })
    } else {
      router.push({name: 'Login'})
    }
  },
  methods: {
    handleOpen (index) {
      // console.log('handleOpen', index)
    },
    handleClose (index) {
      // console.log('handleClose', index)
    },
    handleSelect (index) {
      // console.log('handleSelect', index)
      // console.log(this.$route.fullPath)
    },
    handleCommand (command) {
      switch (command) {
        case 'logout':
          this.$confirm('Are you sure you want to quit logon?', 'Prompt', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            window.localStorage.clear()
            router.push({name: 'Login'})
          }).catch(() => {})
          break
        case 'info':
          router.push({name: 'ResellerInfo'})
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-container{
    display: flex;
    height: 100%;
  }

  .el-header{
    background-color: #409EFF;
    color: #fff;
    text-align: left;
    line-height: 60px;
    h1{
      float: left;
      a{
        color: #fff;
      }
    }
    .el-dropdown{
      float: right;
      color: #fff;
      .el-dropdown-link{
        cursor: pointer;
      }
    }
  }
  .el-dropdown-menu {
    min-width: 100px;
  }
  .el-aside{
    background: #545c64;
    flex-shrink: 0;
  }

  .el-menu{
    border-right: none;
  }

</style>
