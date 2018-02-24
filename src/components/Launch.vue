<template>
  <div>
    <h1>当前启动页</h1>
    <div class="warpper">
      <div class="curr">
        <div v-for="item in items" :key="item.id" v-if="item.is_select">
          <img :src="item.picture" alt="">
          <p>{{item.description}}</p>
        </div>
        <p class="no-launch" v-if="!hasLcunch">未设置启动页</p>
      </div>
      <div class="list">
        <el-button type="text" @click="addLaunch">添加备选</el-button>
        <p class="no-launch" v-if="!hasBY">没有备用图片</p>
        <ul>
          <li v-for="item in items" :key="item.id" v-if="!item.is_select">
            <div class="pic">
              <img :src="item.picture" alt="">
            </div>
            <p>{{item.description}}</p>
            <el-button size="small" plain @click="setLaunch(item)">设为启动页</el-button>
            <el-button size="small" type="danger" plain @click="drop(item)">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'Launch',
  data () {
    return {
      formData: {
        desc: ''
      },
      hasLcunch: false,
      hasBY: false,
      items: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    addLaunch () {
      router.push({name: 'LaunchAdd'})
    },
    getList () {
      this.$axios.get('/splash/list').then(res => {
        if (parseInt(res.data.code) === 200) {
          this.items = res.data.data.splash_list
          this.hasLcunch = this.items.some(item => item.is_select)
          this.hasBY = this.items.some(item => !item.is_select)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    setLaunch (item) {
      this.$confirm('此操作将修改生效的启动页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('is_select', true)
        this.$axios.put(`/splash?id=${item.id}`, formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      }).catch(() => {})
    },
    drop (item) {
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/splash?id=${item.id}`).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('网络连接错误！')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .warpper{
    margin-top: 20px;
    display: flex;
  }
  .curr{
    width: 300px;
    height: auto;
    flex-shrink: 0;
    p{
      padding: 6px 0;
    }
    img{
      width: 100%;
      display: block;
      height: auto;
    }
  }
  .no-launch{
    color: #999;
  }
  .upload{
    width: 500px;
    margin-top: 40px;
  }
  .list{
    flex-grow: 1;
    margin-left: 20px;
    border-left: 1px solid #ddd;
    padding-left: 20px;
    ul{
      overflow: hidden;
    }
    li{
      width: 200px;
      margin-right: 10px;
      margin-bottom: 20px;
      float: left;
      p{
        padding: 6px 0;
      }
      img{
        width: 100%;
      }
    }
  }
</style>
