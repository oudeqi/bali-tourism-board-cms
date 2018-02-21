<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>被禁用的商品</el-breadcrumb-item>
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
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">详细</el-button>
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
  name: 'BeBanned',
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
          // top: false,
          disabled: true
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
          type: 4
        }
      })
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
