<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>推荐的商品</el-breadcrumb-item>
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
        <el-table-column prop="name" label="商品标题" width="250"></el-table-column>
        <el-table-column label="商品头图">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="description" label="描述" width="250"></el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">详细</el-button>
            <el-button @click="recommend(scope.row)" type="text" size="small">取消推荐</el-button>
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
  name: 'RecommendProduct',
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
      this.$axios.get('/commodity/admin/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index,
          commodity_type: this.typeValue,
          top: true
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
        path: '/product/detail/' + item.id,
        query: {
          type: 2
        }
      })
    },
    recommend (item) {
      this.$confirm('此操作会将商品取消推荐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('commodity_type', this.typeValue)
        formData.append('disabled', item.disabled)
        formData.append('top', false)
        this.$axios.put(`/commodity/admin?id=${item.id}&commodity_type=${this.typeValue}&disabled=${item.disabled}&top=false`, formData).then(res => {
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
    max-height: 100px;
  }
  .pager{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
</style>
