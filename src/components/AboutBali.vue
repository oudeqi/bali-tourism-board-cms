<template>
  <div class="form-warpper">
    <h1>设置</h1>
    <el-form :model="form" label-width="100px">
      <el-form-item label="关于巴厘岛">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      </el-form-item>
      <el-form-item>
        <iframe name="ifr" width="375" height="568" :src="form.url" frameborder="0"></iframe>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AboutBali',
  data () {
    return {
      form: {
        url: 'http://www.oudeqi.com/photos.html'
      }
    }
  },
  methods: {
    onSubmit () {}
  }
}
</script>

<style lang="scss" scoped>
  iframe{
    border: 1px solid #ccc;
    border-right: none;
  }
  .form-warpper{
    width: 600px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
