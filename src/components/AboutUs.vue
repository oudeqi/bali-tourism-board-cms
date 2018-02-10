<template>
  <div class="form-warpper">
    <h1>设置</h1>
    <el-form :model="form" label-width="80px">
      <el-form-item label="关于我们">
        <el-input type="textarea" v-model="form.desc" :autosize="{ minRows: 24, maxRows: 36}"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AboutUs',
  data () {
    return {
      form: {
        desc: '2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？2月5日，马尔代夫总统亚明宣布，该国即日起进入为期15天的紧急状态。中方对马尔代夫当前局势有何评论？'
      }
    }
  },
  methods: {
    onSubmit () {}
  }
}
</script>
<style lang="scss" scoped>
  .form-warpper{
    width: 600px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
