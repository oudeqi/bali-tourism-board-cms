<template>
  <div>
    <h1>当前启动页</h1>
    <div class="warpper">
      <div class="curr">
        <img src="../assets/launch-1.jpg" alt="">
        <p>这是这个启动页的描述</p>
        <p>2015-12-20</p>
      </div>
      <div class="list">
        <el-button type="text" @click="dialogVisible = true">添加备选</el-button>
        <el-dialog title="添加备选启动页" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
          <el-form label-position="left" label-width="60px" :model="formData">
            <el-form-item label="备注">
              <el-input v-model="formData.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>最佳图片建议尺寸为：1920*1082</el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <ul>
          <li>
            <div class="pic">
              <img src="../assets/launch-3.jpg" alt="">
            </div>
            <p>这是这个启动页的描述</p>
            <p>2015-12-20</p>
            <el-button size="small" plain @click="setLaunch">设为启动页</el-button>
            <el-button size="small" type="danger" plain @click="drop">删除</el-button>
          </li>
          <li>
            <div class="pic">
              <img src="../assets/launch-3.jpg" alt="">
            </div>
            <p>这是这个启动页的描述</p>
            <p>2015-12-20</p>
            <el-button size="small" plain @click="setLaunch">设为启动页</el-button>
            <el-button size="small" type="danger" plain @click="drop">删除</el-button>
          </li>
          <li>
            <div class="pic">
              <img src="../assets/launch-3.jpg" alt="">
            </div>
            <p>这是这个启动页的描述</p>
            <p>2015-12-20</p>
            <el-button size="small" plain @click="setLaunch">设为启动页</el-button>
            <el-button size="small" type="danger" plain @click="drop">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Launch',
  data () {
    return {
      formData: {
        desc: ''
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    submitForm () {},
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    setLaunch () {
      this.$confirm('此操作将修改生效的启动页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {})
    },
    drop () {
      this.$confirm('确定要删除这张图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
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
    img{
      width: 100%;
      display: block;
      height: auto;
    }
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
      img{
        width: 100%;
      }
    }
  }
</style>
