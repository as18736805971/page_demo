<template>
  <div class="select-school-main">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="设施名称：">
        <el-input v-model="search.facility_name" placeholder="请输入" />
      </el-form-item>
      <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
    </el-form>
    <el-table ref="table" :data="facility_data">
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="设施名称" prop="facility_name" />
      <el-table-column label="设施位置" prop="building_name" />
      <el-table-column prop="address" label="操作" width="65">
        <template slot-scope="scope">
          <el-button type="text" @click="selectFacility(scope.row)">选择</el-button>
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
import { paginate } from '@/api/facilities_manage'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {},
  data() {
    return {
      search: {
        facility_name: '',
        facility_location: '',
        facility_no: ''
      },
      facility_data: [],
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
      const { facility_name, facility_location, facility_no } = this.search
      paginate(
        facility_name,
        facility_location,
        facility_no,
        this.page,
        this.page_size
      ).then(res => {
        this.facility_data = res.data.list
        this.total = res.data.totalRow
      })
    },
    selectFacility(data) {
      this.$emit('selectFacility', data)
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
