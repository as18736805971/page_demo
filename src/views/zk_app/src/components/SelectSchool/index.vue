<template>
  <div class="select-school-main">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="学校名称：">
        <el-input v-model="search.scl_name" placeholder="请输入" />
      </el-form-item>
      <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
    </el-form>
    <el-table ref="table" :data="scl_data">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="学校名称" prop="scl_name" />
      <el-table-column prop="address" label="操作" width="155">
        <template slot-scope="scope">
          <el-button type="text" @click="selectSchool(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="page_size"
      @pagination="getData"
    />
  </div>
</template>
<script>
import { paginate, edupaginate } from '@/api/school'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      search: {
        scl_name: '',
        province_code: '',
        area_code: '',
        county_code: ''
      },
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
      if (this.type === 1) {
        edupaginate(this.search, this.page, this.page_size).then(res => {
          this.scl_data = res.data.list
          this.total = res.data.totalRow
        })
      } else {
        paginate(this.search, this.page, this.page_size).then(res => {
          this.scl_data = res.data.list
          this.total = res.data.totalRow
        })
      }
    },
    selectSchool(data) {
      this.$emit('selectSchool', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-school-main {
  padding-right: 40px;
  .spp-btn {
    position: relative;
    top: 3px;
  }
}
</style>
