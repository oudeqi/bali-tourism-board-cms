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
      <el-form :model="formData" label-width="100px" :disabled="false" ref="form">
        <el-form-item label="新闻ID" required>
          <el-input disabled v-model="formData.id" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="新闻标题" required>
          <el-input v-model="formData.name" placeholder="新闻标题限制在50个字以内"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input type="textarea" v-model="formData.subtitle" placeholder="副标题选填"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" required>
          <el-upload
            action="http://47.88.216.48/bali/v1/advertise"
            list-type="picture-card"
            name="picture"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>最佳图片建议尺寸为：490*260</el-form-item>
        <el-form-item label="视频地址" required>
          <el-input v-model="formData.booking" placeholder="请填写有效的视频地址"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" required>
          <el-input type="textarea" placeholder="请编辑新闻内容" v-model="formData.body" :autosize="{ minRows: 12, maxRows: 24}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpload" size="small">确认修改</el-button>
          <el-button @click="cancel" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import router from '../router'
import {isUrl} from '../utils'
export default {
  name: 'NewsDetail',
  data () {
    return {
      type: this.$route.query.type + '',
      fileList: [],
      formData: {
        id: this.$route.params.id,
        name: '',
        subtitle: '',
        booking: '',
        picture: '',
        body: ''
      }
    }
  },
  computed: {
    routeName () {
      return this.type === '1' ? '新闻列表' : this.type === '2' ? '置顶的新闻' : this.type === '3' ? '删除的新闻' : '无'
    },
    routeCode () {
      return this.type === '1' ? 'NewsList' : this.type === '2' ? 'TopNews' : this.type === '3' ? 'DeletedNews' : ''
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      this.$axios.get('/news', {
        params: {
          id: this.$route.params.id
        }
      }).then(res => {
        if (parseInt(res.data.code) === 200) {
          console.log(res.data.data.news)
          this.formData.name = res.data.data.news.name
          this.formData.subtitle = res.data.data.news.subtitle
          this.formData.booking = res.data.data.news.booking
          this.formData.body = res.data.data.news.body
          this.fileList = [{name: 'news.jpeg', url: res.data.data.news.picture}]
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    handleDialogClose (done) {
      done()
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type.toLowerCase() === 'image/jpeg'
      const isPng = file.type.toLowerCase() === 'image/png'
      if (!isJPG && !isPng) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      return isJPG || isPng
    },
    submitUpload (e) {
      e.preventDefault()
      if (!this.formData.name) {
        this.$message.error('请输入新闻标题')
        return false
      }
      if (this.formData.name.length > 50) {
        this.$message.error('新闻标题限制在50个字以内')
        return false
      }
      if (this.formData.subtitle && this.formData.subtitle.length > 50) {
        this.$message.error('副标题限制在50个字以内')
        return false
      }
      if (this.$refs.form.$el.picture.files.length === 0) {
        this.$message.error('请选择新闻图片，此图片将显示在新闻列表页')
        return false
      }
      if (!this.formData.booking || !isUrl(this.formData.booking)) {
        this.$message.error('请填写正确的视频地址')
        return false
      }
      if (!this.formData.body) {
        this.$message.error('请编辑新闻内容！')
        return false
      }
      let formData = new FormData()
      formData.append('name', this.formData.name)
      formData.append('subtitle', this.formData.subtitle)
      formData.append('picture', this.$refs.form.$el.picture.files[0])
      formData.append('booking', this.formData.booking)
      formData.append('body', this.formData.body)
      this.$axios.post('/news', formData).then(res => {
        if (parseInt(res.data.code) === 200) {
          this.$message({
            type: 'success',
            message: '添加新闻成功!'
          })
        } else {
          this.$message.error('添加新闻发生错误！')
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
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
