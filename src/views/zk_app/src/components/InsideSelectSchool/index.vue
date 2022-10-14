<template>
  <div class="insideselect-school-main">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="当前选择：">
        <span class="scl_name">{{ scl_name }}</span>
      </el-form-item>
      <div>
        <el-form-item>
          <el-input v-model="search.scl_name" placeholder="请输入" />
        </el-form-item>
        <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
      </div>
    </el-form>
    <el-table ref="table" :data="scl_data">
      <el-table-column label="学校名称" prop="scl_name" />
      <el-table-column prop="address" label="操作" width="155">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="selectSchool(scope.row)"
          >选择学校</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="page_size"
      @pagination="getData"
    />
  </div>
</template>
<script>
import { paginate } from '@/api/school'
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
      total: 0,
      scl_name: localStorage.getItem('scl_name')
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      paginate(this.search, this.page, this.page_size).then((res) => {
        this.scl_data = res.data.list
        this.total = res.data.totalPage
      })
    },
    selectSchool(data) {
      this.$emit('selectSchool', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.insideselect-school-main {
  .spp-btn {
    position: relative;
    top: 3px;
  }
  .el-form--inline {
    display: flex;
    justify-content: space-between;
  }
  .scl_name {
    color: #3399ff;
  }
}
</style>
