<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Settings</el-breadcrumb-item>
      <el-breadcrumb-item>Terms of Service</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form-warpper">
      <el-form :model="form" label-width="80px">
        <el-form-item>
          <editor :editor-content="form.desc" @change="handelChange" editor-placeholder="Please edit..."></editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">OK</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Editor from './Editor'
export default {
  name: 'TermOfService',
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
        this.$axios.put('/serviceterms', formData).then(res => {
          console.log(res)
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Update success!'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
        })
      } else if (this.exist === false) {
        // 新建
        this.$axios.post('/serviceterms', formData).then(res => {
          console.log(res)
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Create success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
        })
      } else {
        // 还没获取成功
      }
    },
    getDetails () {
      this.$axios.get('/serviceterms').then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          if (res.data.data.serviceterms && res.data.data.serviceterms.id) {
            this.form.desc = res.data.data.serviceterms.description
            this.exist = true
          } else {
            this.$message.info('It has not been set up yet, please set up')
            this.exist = false
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('Network connection error')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-warpper{
    width: 700px;
    margin-top: 40px;
  }
</style>
