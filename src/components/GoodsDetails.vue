<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
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
  name: 'GoodsDetails',
  data () {
    return {
      type: this.$route.query.type + '',
      form: {
        title: '七天连锁',
        date: '2016-05-02',
        desc: '300元一晚',
        cacategoryt: '住宿'
      }
    }
  },
  computed: {
    routeName () {
      return this.type === '1' ? '商品列表' : this.type === '2' ? '下架的商品' : this.type === '3' ? '被禁用的商品' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'Goods' : this.type === '2' ? 'OffTheShelf' : this.type === '3' ? 'BeBanned' : ''
    }
  },
  methods: {
    onSubmit () {},
    back () {
      // router.push({name: this.routeCode})
      router.go(-1)
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
