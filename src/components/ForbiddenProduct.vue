<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>Home</el-breadcrumb-item>
        <el-breadcrumb-item>Blacklist Product</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select v-model="typeValue" size="medium" @change="typeChange">
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
        <el-table-column prop="id" label="#ID"></el-table-column>
        <el-table-column prop="name" label="Product Title" min-width="200"></el-table-column>
        <el-table-column label="Product Image" min-width="150">
          <template slot-scope="scope">
            <img class="pic-view" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="location" label="Location" min-width="200" align="center"></el-table-column>
        <el-table-column label="Status" min-width="120" align="center">
          <template slot-scope="scope">
            <p class="status txt-info" v-if="scope.row.off_shelve">Been removed</p>
            <p class="status txt-danger" v-else-if="scope.row.disabled">Be banned</p>
            <p class="status txt-success" v-else-if="scope.row.top">Recommended</p>
            <p class="status txt-blue" v-else>Normal</p>
          </template>
        </el-table-column>
        <el-table-column prop="clicks" label="Click Number" min-width="150" align="center"></el-table-column>
        <el-table-column prop="phone" label="Phone Number" min-width="150" align="center"></el-table-column>
        <el-table-column label="Operate" min-width="150">
          <template slot-scope="scope">
            <el-button @click="setDisable(scope.row, false)" type="success" size="mini">Enable</el-button>
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
  name: 'ForbiddenProduct',
  data () {
    return {
      tableData: [],
      page_size: 10,
      page_index: 1,
      page_total: 0,
      page_next: false,
      options: [{
        value: '',
        label: 'All Type'
      }, {
        value: 'attraction',
        label: 'Attraction'
      }, {
        value: 'restaurant',
        label: 'Restaurant'
      }, {
        value: 'tour',
        label: 'Tour'
      }, {
        value: 'transport',
        label: 'Transport'
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
        this.$message.error('Network connection error')
      })
    },
    detail (item) {
      router.push({
        path: '/product/detail/' + item.id,
        query: {
          type: 3
        }
      })
    },
    setDisable (item, b) {
      let msg = ''
      if (b) {
        msg = 'This operation will disable the product, continue?'
      } else {
        msg = 'This operation will enable the product, continue?'
      }
      this.$confirm(msg, 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let formData = new FormData()
        formData.append('id', item.id)
        formData.append('disabled', b)
        this.$axios.put('/commodity/admin', formData).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$message({
              type: 'success',
              message: 'Successful operation'
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
  .pic-view {
    max-height: 50px;
  }
  .pager{
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
</style>
