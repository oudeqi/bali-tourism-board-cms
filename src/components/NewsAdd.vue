<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/news' }">新闻列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="form" label-width="80px">
        <el-form-item label="新闻标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="新闻概要">
          <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容">
          <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 12, maxRows: 24}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">立即创建</el-button>
          <el-button @click="cancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'NewsAdd',
  data () {
    return {
      form: {
        title: '',
        desc: '',
        content: ''
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
