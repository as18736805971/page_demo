<template>
  <div class="app-container">
    <section class="filter-container">
      <attendanceFilter ref="filter" :type="2" @getData="getData" />
    </section>
    <div class="spp-no-control" style="margin-top: 20px">
      <div class="main-body">
        <el-table ref="multipleTable" :data="attendanceData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="学校" prop="scl_name" />
          <el-table-column label="学生" prop="stu_name" />>
          <el-table-column label="卡号" prop="stu_no" />>
          <el-table-column label="考勤次数" prop="total" />>
          <el-table-column label="最后考勤时间" prop="create_time">
            <template slot-scope="scope">{{ scope.row.last_pos_time | fgTime }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="functionList.includes('A46001')" type="text" @click="viewDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="page_num"
          :limit.sync="page_size"
          @pagination="differRequest"
        />
      </div>
    </div>
    <el-drawer
      v-if="showDialog"
      title="考勤详情"
      :visible.sync="showDialog"
      class="spp-drawer school-attendance-drawer"
    >
      <attendanceDetail :type="2" :detail-obj="detailObj" :choice-time="choiceTime" />
    </el-drawer>
  </div>
</template>

<script>
import { stuDorm } from '@/api/campus_attendance'
import attendanceDetail from './components/detail'
import attendanceFilter from './components/filter'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'DormitoryAttendance',
  components: { attendanceFilter, Pagination, attendanceDetail },
  data() {
    return {
      page_num: 1,
      page_size: 10,
      total: 0,
      attendanceData: [],
      showDialog: false,
      choiceTime: {
        start_time: '',
        end_time: ''
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.$nextTick(() => {
      this.differRequest()
    })
  },
  methods: {
    differRequest() {
      this.$refs.filter.getData()
    },
    getData(value) {
      this.choiceTime = {
        start_time: value.start_time,
        end_time: value.end_time
      }
      const {
        pajx_bld_id,
        pajx_dor_id,
        stu_name,
        start_time,
        end_time
      } = value
      stuDorm(
        pajx_bld_id,
        pajx_dor_id,
        stu_name,
        start_time,
        end_time,
        this.page_num,
        this.page_size
      ).then(res => {
        this.attendanceData = res.data.pajx_result.data.data
        this.total = parseInt(res.data.pajx_result.data.total)
      })
    },

    // 查看详情
    viewDetail(opt) {
      this.detailObj = opt
      this.showDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
