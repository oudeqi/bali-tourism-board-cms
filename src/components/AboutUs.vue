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
      exist: '',
      form: {
        desc: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    onSubmit () {
      let formData = new FormData()
      formData.append('description', this.form.desc)
      if (this.exist === true) {
        this.$axios.put('/aboutus', formData).then(res => {
          console.log(res)
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      } else if (this.exist === false) {
        // 新建
        this.$axios.post('/aboutus', formData).then(res => {
          console.log(res)
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '新建成功!'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      } else {
        // 还没获取成功
      }
    },
    getDetails () {
      this.$axios.get('/aboutus').then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          if (res.data.data.aboutus && res.data.data.aboutus.id) {
            this.form.desc = res.data.data.aboutus.description
            this.exist = true
          } else {
            this.$message.info('关于我们还没有设置，请设置')
            this.exist = false
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    }
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
