<template>
  <div>
    <div class="search_criteria">
      <el-select v-model="search_school.provinceCode" class="select_provinces" placeholder="选择省份" clearable @change="handleGetNext(1)">
        <el-option
          v-for="item in provinces_list"
          :key="item.area_code"
          :label="item.area_name"
          :value="item.area_code"
        />
      </el-select>
      <el-select v-model="search_school.cityCode" class="select_provinces" placeholder="选择地市" clearable @change="handleGetNext(2)">
        <el-option
          v-for="item in cities_list"
          :key="item.area_code"
          :label="item.area_name"
          :value="item.area_code"
        />
      </el-select>
      <el-select v-model="search_school.countyCode" class="select_provinces" clearable placeholder="选择县区">
        <el-option
          v-for="item in county_list"
          :key="item.area_code"
          :label="item.area_name"
          :value="item.area_code"
        />
      </el-select>
      <el-input v-model="search_school.keyword" style="width: 170px;margin-right: 8px" placeholder="学校名称/编号" />
      <span class="spp-btn spp-btn-primary" @click="queryData()">搜索</span>
      <span class="spp-btn" @click="resetData()">重置</span>
    </div>
    <el-table ref="school" :data="school_list" :height="500" size="mini" strip>
      <el-table-column label="学校编号" prop="scl_no" width="100" align="left" />
      <el-table-column label="学校名称" prop="scl_name" align="left" />
      <el-table-column label="地区" prop="province_name" align="left" />
      <el-table-column label="地市" prop="city_name" align="left" />
      <el-table-column label="县区" align="left">
        <template slot-scope="scope">
          <el-button style="color: #313233;" type="text">{{ scope.row.county_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <span class="cut-btn" @click="singleElection(scope.row)">选择</span>
          <!--<el-radio
            v-model="select_index"
            class="radio"
            :label="scope.$index"
            @change="singleElection(scope.row)"
          >
            {{ }}
          </el-radio>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="school_total > 0" :total="school_total" :page.sync="search_school.page_num" :limit.sync="search_school.page_size" @pagination="handleCurrentChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { decrypt, httpRequest } from '@/utils/auth'
export default {
  name: 'School',
  components: { Pagination },
  props: {
    select: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      search_school: {
        provinceCode: '', // 省份编码
        cityCode: '', // 地市编码
        countyCode: '', // 县区编码
        keyword: '', // 学校名称
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      school_total: 0,
      school_list: [], // 学校列表
      select_index: '', // 选择的学校索引
      select_school: {}, // 选择的学校
      provinces_list: [], // 省份
      cities_list: [], // 地市
      county_list: [] // 县区
    }
  },
  created() {
    this.queryData()
    this.handleGetProvince()
  },
  methods: {
    handleGetProvince() {
      httpRequest('/api/sys/area/getProvince', {}, false).then(res => {
        this.provinces_list = JSON.parse(decrypt(res.data))
      })
    },
    handleGetNext(type) {
      httpRequest('/api/sys/area/getNext', {
        areaPcode: type === 1 ? this.search_school.provinceCode : this.search_school.cityCode
      }, false).then(res => {
        if (type === 1) {
          this.search_school.cityCode = ''
          this.search_school.countyCode = ''
          this.cities_list = JSON.parse(decrypt(res.data))
        } else {
          this.search_school.countyCode = ''
          this.county_list = JSON.parse(decrypt(res.data))
        }
      })
    },
    resetData() {
      Object.assign(this.$data.search_school, this.$options.data().search_school)
    },
    singleElection(row) {
      this.select_school = row
      this.$emit('selectSchool', this.select_school)
    },
    handleCurrentChange(val) {
      this.search_school.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search_school.page_num = 1
      this.fetchData()
    },
    fetchData() {
      httpRequest('/api/pajx/edu/scl/lookup', this.search_school, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.school_total = data.total
        this.school_list = data.records
        this.school_list.map((item, index) => {
          if (item.scl_id === this.select.scl_id) {
            this.select_index = index
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search_criteria {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
  margin-top: 10px;

  .select_provinces {
    width: 170px;
    margin-right: 8px;
  }
}

.cut-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 28px;
  background: #4968FF;
  border: 1px solid #4968FF;
  border-radius: 4px;
  font-size: 12px;
  color: #FFFFFF;
  cursor: pointer;
}
</style>
