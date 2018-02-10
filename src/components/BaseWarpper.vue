<template>
  <el-container>
    <el-header>
      <h1>
        <a href="javascript:void(0);">Bali Tourism Board CMS</a>
      </h1>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.name}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="userInfo.type === 'user'" command="setting">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <el-menu v-if="userInfo.type === 'admin'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/a">
            <i class="el-icon-setting"></i><span slot="title">超管首页</span>
          </el-menu-item>
          <el-menu-item index="/launch">
            <i class="el-icon-setting"></i><span slot="title">启动页</span>
          </el-menu-item>
          <el-menu-item index="/banner">
            <i class="el-icon-setting"></i><span slot="title">横拍广告</span>
          </el-menu-item>
          <el-submenu index="/news">
            <template slot="title">
              <i class="el-icon-setting"></i><span>新闻管理</span>
            </template>
            <el-menu-item index="/news">新闻列表</el-menu-item>
            <el-menu-item index="/top-news">置顶的新闻</el-menu-item>
            <el-menu-item index="/deleted-news">删除的新闻</el-menu-item>
          </el-submenu>
          <el-menu-item index="/user">
            <i class="el-icon-setting"></i><span slot="title">用户管理（用户收藏的商品入口）</span>
          </el-menu-item>
          <el-menu-item index="/reseller">
            <i class="el-icon-setting"></i><span slot="title">商家管理</span>
          </el-menu-item>
          <el-submenu index="/product">
            <template slot="title">
              <i class="el-icon-setting"></i><span>商品管理</span>
            </template>
            <el-menu-item index="/product">商品列表</el-menu-item>
            <el-menu-item index="/recommend">推荐的商品</el-menu-item>
            <el-menu-item index="/forbidden">禁用的商品</el-menu-item>
          </el-submenu>
          <el-submenu index="/about-us">
            <template slot="title">
              <i class="el-icon-setting"></i><span>界面设置</span>
            </template>
            <el-menu-item index="/about-us">关于我们</el-menu-item>
            <el-menu-item index="/about-bali">关于巴厘岛</el-menu-item>
            <el-menu-item index="/tos">服务条款</el-menu-item>
            <el-menu-item index="/privacy-policy">隐私政策</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-menu v-if="userInfo.type === 'user'" :default-active="currPath" @open="handleOpen" @close="handleClose" @select="handleSelect" :router="true" background-color="#545c64"
                 text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="/b">
            <i class="el-icon-setting"></i><span slot="title">商家首页</span>
          </el-menu-item>
          <el-submenu index="/goods">
            <template slot="title">
              <i class="el-icon-setting"></i><span>商品管理</span>
            </template>
            <el-menu-item index="/goods">商品列表</el-menu-item>
            <el-menu-item index="/off-the-shelf">下架的商品</el-menu-item>
            <el-menu-item index="/be-banned">被禁用的商品</el-menu-item>
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
export default {
  name: 'Container',
  data () {
    return {
      userInfo: {},
      currPath: this.$route.fullPath
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter userInfo', Qs.parse(window.localStorage.getItem('userInfo')))
    if (window.localStorage.getItem('userInfo')) {
      let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
      next(vm => {
        vm.userInfo = userInfo
      })
    } else {
      router.push({name: 'Login'})
    }
  },
  methods: {
    handleOpen (index) {
      console.log('handleOpen', index)
    },
    handleClose (index) {
      console.log('handleClose', index)
    },
    handleSelect (index) {
      console.log('handleSelect', index)
      console.log(this.$route.fullPath)
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
        case 'setting':
          this.$message('click on item ' + command)
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

  .el-aside{
    background: #545c64;
  }

  .el-menu{
    border-right: none;
  }

</style>
