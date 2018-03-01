<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>下架的商品</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select v-model="typeValue" placeholder="请选择" size="medium" @change="typeChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="商品标题" min-width="250"></el-table-column>
        <el-table-column label="商品头图">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" align="center">
          <template slot-scope="scope">
            <p class="status txt-info" v-if="scope.row.off_shelve">已经下架</p>
            <p class="status txt-danger" v-else-if="scope.row.disabled">被禁用</p>
            <p class="status txt-success" v-else-if="scope.row.top">被推荐</p>
            <p class="status txt-blue" v-else>正常</p>
          </template>
        </el-table-column>
        <el-table-column prop="clicks" label="点击量" min-width="150" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" min-width="150" align="center"></el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button @click="drop(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="detail(scope.row)" type="text" size="small">详细</el-button>
            <el-button v-if="scope.row.off_shelve" @click="onTheShelf(scope.row)" type="text" size="small">重新上架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager">
      <el-pagination
        layout="prev, pager, next"
        :page-count="page_total" :page-size="page_size" :current-page.sync="page_index"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
  name: 'OffTheShelf',
  data () {
    return {
      tableData: [],
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 'attraction',
        label: '景点'
      }, {
        value: 'restaurant',
        label: '餐饮'
      }, {
        value: 'tour',
        label: '旅游'
      }, {
        value: 'transport',
        label: '运输'
      }],
      typeValue: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    typeChange () {
      this.getList()
    },
    handleCurrentChange () {
      this.getList()
    },
    getList () {
      this.$axios.get('/commodity/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index,
          commodity_type: this.typeValue,
          off_shelve: true
          // disabled: false
        }
      }).then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          this.tableData = res.data.data.commodity.data
          this.page_index = res.data.data.commodity.page_index
          this.page_next = res.data.data.commodity.page_next
          this.page_total = res.data.data.commodity.page_total
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('网络连接错误！')
      })
    },
    detail (item) {
      router.push({
        path: '/goods/details/' + item.id,
        query: {
          type: 2
        }
      })
    },
    drop (item) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/commodity', {
          params: {
            id: item.id
          }
        }).then(res => {
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
    },
    onTheShelf (item) {
      this.$confirm('此操作将会重新上架该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('off_shelve', false)
        this.$axios.put('/commodity', formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
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
  .pic-view {
    max-height: 50px;
  }
  .pager{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
  .txt-info {
    color: #909399;
  }
  .txt-danger {
    color: #F56C6C;
  }
  .txt-success {
    color: #67C23A;
  }
  .txt-blue {
    color: #409EFF;
  }
</style>
