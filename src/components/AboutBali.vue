<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Settings</el-breadcrumb-item>
        <el-breadcrumb-item>About Bali</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="aboutBaliAdd">
        <i class="el-icon-plus"></i>Add</el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="Images">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column label="Operate" width="180">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">Details</el-button>
            <el-button @click="del(scope.row)" type="text" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import router from '../router'
export default {
  name: 'AboutBali',
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    detail (item) {
      router.push({name: 'AboutBaliDetails', params: { id: item.id }})
    },
    aboutBaliAdd () {
      router.push({name: 'AboutBaliAdd'})
    },
    getList () {
      this.$axios.get('/aboutbali/list').then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          this.tableData = res.data.data.aboutbali_list
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('Network connection error')
      })
    },
    del (item) {
      console.log(item)
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/aboutbali', {
          params: {
            id: item.id
          }
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Delete success'
            })
            this.getList()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((e) => {
          this.$message.error('Network connection error')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter{
    display: flex;
    align-items: center;
    .el-breadcrumb{
      flex-grow: 1;
    }
  }
  .table-list{
    margin-top: 20px;
  }
  .pic-view{
    max-height: 100px;
    display: block;
  }
</style>
