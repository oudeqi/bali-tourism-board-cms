<template>
  <div>
    <div class="filter">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商家列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" plain round @click="resellerAdd">
        <i class="el-icon-plus"></i>
        注册商家
      </el-button>
    </div>
    <div class="table-list">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" width="250"></el-table-column>
        <el-table-column prop="date" label="注册日期" width="180"></el-table-column>
        <el-table-column prop="email" label="绑定邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="lastActive" label="最近活跃时间"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="detail" type="text" size="small">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager">
      <el-pagination
        layout="prev, pager, next"
        :total="1000">
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
      tableData: [{
        date: '2016-05-02',
        username: '罗玉凤',
        email: '65456@qq.com',
        phone: '15665254412',
        lastActive: '2016-05-02'
      }, {
        date: '2016-05-02',
        username: '罗玉凤',
        email: '65456@qq.com',
        phone: '15665254412',
        lastActive: '2016-05-02'
      }, {
        date: '2016-05-02',
        username: '罗玉凤',
        email: '65456@qq.com',
        phone: '15665254412',
        lastActive: '2016-05-02'
      }, {
        date: '2016-05-02',
        username: '罗玉凤',
        email: '65456@qq.com',
        phone: '15665254412',
        lastActive: '2016-05-02'
      }]
    }
  },
  methods: {
    detail () {
      router.push({name: 'ResellerDetails', params: { id: 'asdasd' }})
    },
    resellerAdd () {
      router.push({name: 'ResellerAdd'})
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
