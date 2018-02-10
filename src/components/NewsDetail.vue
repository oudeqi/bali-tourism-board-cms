<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span @click="back">{{routeName}}</span>
      </el-breadcrumb-item>
      <!-- :to="{ path: '/news' }"-->
      <el-breadcrumb-item>新闻详情</el-breadcrumb-item>
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
          <el-button type="primary" @click="onSubmit" size="small">立即修改</el-button>
          <el-button @click="cancel" size="small">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'NewsDetail',
  data () {
    return {
      type: this.$route.query.type + '',
      form: {
        title: '陆基中段反导拦截试验与朝鲜半岛有关？',
        desc: '2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？',
        content: '2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？'
      }
    }
  },
  computed: {
    routeName () {
      return this.type === '1' ? '新闻列表' : this.type === '2' ? '置顶的新闻' : this.type === '3' ? '删除的新闻' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'News' : this.type === '2' ? 'TopNews' : this.type === '3' ? 'DeletedNews' : ''
    }
  },
  mounted () {
    console.log(typeof this.$route.query.type)
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
