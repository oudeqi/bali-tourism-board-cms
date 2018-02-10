<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/recommend' }">推荐列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form label-position="right" :model="form" label-width="120px" :disabled="false">
        <el-form-item label="商品标题">
          <el-input disabled v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-input disabled v-model="form.cacategoryt"></el-input>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-input disabled v-model="form.date"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input disabled v-model="form.desc"></el-input>
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
  name: 'RecommendDetails',
  data () {
    return {
      form: {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '住宿'
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
