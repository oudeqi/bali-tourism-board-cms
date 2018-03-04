<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Home</el-breadcrumb-item>
        <el-breadcrumb-item>Merchant List</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="resellerAdd">
        <i class="el-icon-plus"></i>
        Add Merchant
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="Merchant Name"></el-table-column>
        <el-table-column prop="password" label="Password"></el-table-column>
        <el-table-column prop="create_time" label="Register Date"></el-table-column>
        <el-table-column prop="email" label="Email Address"></el-table-column>
        <el-table-column prop="phone" label="Phone Number"></el-table-column>
        <el-table-column label="Operate">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">Details</el-button>
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
  name: 'Reseller',
  data () {
    return {
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    detail (item) {
      router.push({name: 'ResellerDetails', params: { id: item.id }})
    },
    resellerAdd () {
      router.push({name: 'ResellerAdd'})
    },
    handleCurrentChange (val) {
      this.getList()
    },
    getList () {
      this.$axios.get('/manager/list', {
        params: {
          page_size: this.page_size,
          page_index: this.page_index
        }
      }).then(res => {
        console.log(res)
        if (parseInt(res.data.code) === 200) {
          this.tableData = res.data.data.merchant_list.data
          this.page_index = res.data.data.merchant_list.page_index
          this.page_next = res.data.data.merchant_list.page_next
          this.page_total = res.data.data.merchant_list.page_total
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
  .pager{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
</style>
