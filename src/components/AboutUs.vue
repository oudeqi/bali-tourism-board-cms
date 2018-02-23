<template>
  <div class="form-warpper">
    <h1>设置</h1>
    <el-form :model="form" label-width="120px">
      <el-form-item label="关于我们">
        <editor :editor-content="form.desc" @change="handelChange" editor-placeholder="请编辑..."></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Editor from './Editor'
export default {
  name: 'AboutUs',
  components: {
    Editor
  },
  data () {
    return {
      exist: '',
      backContent: '',
      form: {
        desc: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    handelChange (res) {
      this.backContent = res
    },
    onSubmit () {
      let formData = new FormData()
      formData.append('description', this.backContent)
      if (this.exist === true) {
        this.$axios.put('/aboutus', formData).then(res => {
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
    width: 700px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
