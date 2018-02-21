<template>
  <div class="form-warpper">
    <h1>设置</h1>
    <el-form :model="form" label-width="100px">
      <el-form-item label="关于巴厘岛">
        <el-input v-model="form.url" placeholder="请输入关于巴厘岛的网址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
      </el-form-item>
      <el-form-item v-if="ifrUrl">
        <iframe name="ifr" width="375" height="568" :src="ifrUrl" frameborder="0"></iframe>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  name: 'AboutBali',
  data () {
    return {
      exist: '',
      ifrUrl: '',
      form: {
        url: ''
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  watch: {
    'form.url': debounce(function () {
      if (this.form.url.indexOf('http://') === -1) {
        this.ifrUrl = 'http://' + this.form.url
      } else {
        this.ifrUrl = this.form.url
      }
    }, 800)
  },
  methods: {
    onSubmit () {
      let formData = new FormData()
      formData.append('description', this.form.url)
      if (this.exist === true) {
        this.$axios.put('/aboutbali', formData).then(res => {
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
        this.$axios.post('/aboutbali', formData).then(res => {
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
      this.$axios.get('/aboutbali').then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          if (res.data.data.aboutbali && res.data.data.aboutbali.id) {
            this.form.url = res.data.data.aboutbali.description
            this.exist = true
          } else {
            this.$message.info('关于巴厘岛还没有设置，请设置')
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
  iframe{
    border: 1px solid #ddd;
  }
  .form-warpper{
    width: 600px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
