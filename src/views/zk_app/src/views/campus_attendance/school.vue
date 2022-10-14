<template>
  <div class="app-container">
    <section class="filter-container" style="padding-top: 0">
      <div class="school-attendance-crumbs">
        <span
          class="common-nav"
          :class="{crumbscolor: attendance_type === 1}"
          @click="changeType(1)"
        >已考勤学生</span>
        <span
          class="common-nav"
          :class="{crumbscolor: attendance_type === 2}"
          @click="changeType(2)"
        >未考勤学生</span>
      </div>
      <attendanceFilter v-show="attendance_type === 1" ref="filterOne" @getData="getstuGate" />
      <attendanceFilter v-show="attendance_type === 2" ref="filterTwo" @getData="getstuNoatt" />
    </section>
    <div class="spp-no-control" style="margin-top: 20px">
      <div class="main-body">
        <el-table ref="multipleTable" :data="attendanceData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="姓名" prop="stu_name" />
          <el-table-column label="卡号" prop="stu_no" />
          <el-table-column label="年级">
            <template slot-scope="scope">{{ scope.row.gra_name + '年级' }}</template>
          </el-table-column>
          <el-table-column label="班级" prop="cls_show_name" />
          <el-table-column v-if="attendance_type===1" label="考勤次数" prop="total" />
          <el-table-column v-if="attendance_type===1" label="最后考勤时间" prop="create_time">
            <template slot-scope="scope">{{ scope.row.last_pos_time | fgTime }}</template>
          </el-table-column>
          <el-table-column
            v-if="attendance_type===1"
            prop="address"
            label="操作"
            width="80"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button v-if="functionList.includes('A47001')" type="text" @click="viewDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0&&attendance_type===1"
          :total="total"
          :page.sync="has_page_num"
          :limit.sync="page_size"
          @pagination="differRequest"
        />
        <pagination
          v-show="total>0&&attendance_type===2"
          :total="total"
          :page.sync="nohas_page_num"
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
      <attendanceDetail :type="1" :detail-obj="detailObj" :choice-time="choiceTime" />
    </el-drawer>
  </div>
</template>

<script>
import attendanceFilter from './components/filter'
import attendanceDetail from './components/detail'
import Pagination from '@/components/Pagination'
import { stuGate, stuNoatt } from '@/api/campus_attendance'
import { mapState } from 'vuex'
export default {
  name: 'SchoolAttendance',
  components: { attendanceFilter, attendanceDetail, Pagination },
  data() {
    return {
      attendance_type: 1,
      has_page_num: 1,
      nohas_page_num: 1,
      page_size: 10,
      total: 0,
      attendanceData: [],
      showDialog: false,
      detailObj: {},
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
    changeType(type) {
      this.attendance_type = type
      this.differRequest()
    },
    differRequest() {
      this.attendanceData = []
      if (this.attendance_type === 1) {
        this.$refs.filterOne.getData()
      } else {
        this.$refs.filterTwo.getData()
      }
    },
    // 获取已考勤学生数据
    getstuGate(value) {
      this.choiceTime = {
        start_time: value.start_time,
        end_time: value.end_time
      }
      const {
        pajx_gra_id,
        pajx_cls_id,
        stu_name,
        start_time,
        end_time
      } = value
      stuGate(
        pajx_gra_id,
        pajx_cls_id,
        stu_name,
        start_time,
        end_time,
        this.has_page_num,
        this.page_size
      ).then(res => {
        this.attendanceData = res.data.pajx_result.data.data
        this.total = parseInt(res.data.pajx_result.data.total)
      })
    },
    // 获取未考勤学生数据
    getstuNoatt(value) {
      const {
        pajx_gra_id,
        pajx_cls_id,
        stu_name,
        start_time,
        end_time
      } = value
      stuNoatt(
        pajx_gra_id,
        pajx_cls_id,
        stu_name,
        start_time,
        end_time,
        this.nohas_page_num,
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
.school-attendance-crumbs {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ebf0f5;
  margin-bottom: 20px;
  .common-nav {
    font-size: 14px;
    cursor: pointer;
    height: 56px;
    line-height: 56px;
    margin-left: 20px;
  }
  .crumbscolor {
    color: #3399ff;
    border-bottom: 2px solid #3399ff;
  }
}
</style>
<style lang="scss">
</style>
