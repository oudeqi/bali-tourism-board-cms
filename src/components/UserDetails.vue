<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="120px" :disabled="false">
        <el-form-item label="用户名">
          <el-input disabled v-model="form.date"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-input disabled v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="绑定邮箱">
          <el-input disabled v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input disabled v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="最近活跃时间">
          <el-input disabled v-model="form.lastActive"></el-input>
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
        date: '2016-05-02',
        username: '罗玉凤',
        email: '65456@qq.com',
        phone: '15665254412',
        lastActive: '2016-05-02'
      }
    }
  },
  methods: {
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
