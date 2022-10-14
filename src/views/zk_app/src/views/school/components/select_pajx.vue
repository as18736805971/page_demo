<template>
  <div class="select-pajx-main">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="学校名称：">
        <el-input v-model="scl_name" placeholder="请输入" />
      </el-form-item>
      <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
    </el-form>
    <el-table ref="table" :data="scl_data">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="平安家校名称" prop="scl_name" />
      <el-table-column prop="address" label="操作" width="155">
        <template slot-scope="scope">
          <el-button type="text" @click="selectPajx(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
  </div>
</template>
<script>
import { paginatePajx } from '@/api/school'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    sclId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      scl_name: '',
      scl_data: [],
      page: 1,
      page_size: 10,
      total: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      paginatePajx(this.sclId, this.scl_name, this.page, this.page_size).then(res => {
        this.scl_data = res.data.pajx_scl_paginate.list
        this.total = res.data.pajx_scl_paginate.totalRow
      })
    },
    selectPajx(data) {
      this.$emit('selectPajx', data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .select-pajx-main {
    .spp-btn {
      position: relative;
      top: 3px;
    }
  }
</style>
