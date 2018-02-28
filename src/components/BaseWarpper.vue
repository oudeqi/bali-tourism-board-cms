<template>
  <el-container>
    <el-header>
      <h1>
        <a href="javascript:void(0);">Bali Tourism Board CMS</a>
      </h1>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.name || '无名商户'}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="userInfo.type === 'user'" command="info">商户信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="260px">
        <el-menu v-if="userInfo.type === 'admin'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/admin">
            <i class="el-icon-setting"></i><span slot="title">超管首页</span>
          </el-menu-item>
          <el-menu-item index="/launch">
            <i class="el-icon-setting"></i><span slot="title">启动页</span>
          </el-menu-item>
          <el-submenu index="/banner">
            <template slot="title">
              <i class="el-icon-setting"></i><span>横拍广告</span>
            </template>
            <el-menu-item index="/banner/list">横拍广告列表</el-menu-item>
            <el-menu-item index="/banner/active">生效的横拍广告</el-menu-item>
          </el-submenu>
          <el-submenu index="/news">
            <template slot="title">
              <i class="el-icon-setting"></i><span>新闻管理</span>
            </template>
            <el-menu-item index="/news/list">新闻列表</el-menu-item>
            <el-menu-item index="/news/top">置顶的新闻</el-menu-item>
            <!--<el-menu-item index="/news/deleted">删除的新闻</el-menu-item>-->
          </el-submenu>
          <el-menu-item index="/user">
            <i class="el-icon-setting"></i><span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/reseller">
            <i class="el-icon-setting"></i><span slot="title">商户管理</span>
          </el-menu-item>
          <el-submenu index="/product">
            <template slot="title">
              <i class="el-icon-setting"></i><span>商品管理</span>
            </template>
            <el-menu-item index="/product/list">商品列表</el-menu-item>
            <el-menu-item index="/product/recommend">推荐的商品</el-menu-item>
            <el-menu-item index="/product/forbidden">禁用的商品</el-menu-item>
          </el-submenu>
          <el-submenu index="/about-us">
            <template slot="title">
              <i class="el-icon-setting"></i><span>界面设置</span>
            </template>
            <el-menu-item index="/about-us">关于我们</el-menu-item>
            <el-menu-item index="/tos">服务条款</el-menu-item>
            <el-menu-item index="/privacy-policy">隐私政策</el-menu-item>
            <el-menu-item index="/about-bali">关于巴厘岛</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-menu v-if="userInfo.type === 'user'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/busi">
            <i class="el-icon-setting"></i><span slot="title">商家首页</span>
          </el-menu-item>
          <el-submenu index="/goods">
            <template slot="title">
              <i class="el-icon-setting"></i><span>商品管理</span>
            </template>
            <el-menu-item index="/goods/list">商品列表</el-menu-item>
            <el-menu-item index="/goods/off-the-shelf">下架的商品</el-menu-item>
            <el-menu-item index="/goods/top">被推荐的商品</el-menu-item>
            <el-menu-item index="/goods/be-banned">被禁用的商品</el-menu-item>
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
          vm.$alert('登录状态信息过期,请重新登录', '消息', {
            confirmButtonText: '确定',
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
          this.$confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
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
  }

  .el-menu{
    border-right: none;
  }

</style>
