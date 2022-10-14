<template>
  <div class="app-container page-container right-side-dialog notice-page">
    <div class="col_bg" style="border-radius: 4px; padding: 0 0 16px 0">
      <el-tabs id="att_manager_tab" v-model="activeName" class="att_tab">
        <el-tab-pane label="考勤详情" name="first">
          <div class="header-search single_line" style="border-radius:0 0 5px 5px">
            <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
              <div class="form-area">
                <el-form-item label="考勤日期：">
                  <el-date-picker v-model="search.date" type="date" placeholder="选择日期" :clearable="false" />
                </el-form-item>
                <el-form-item label="学校名称：">
                  <el-input v-model="search.scl_name" placeholder="请输入" />
                </el-form-item>
              </div>
              <el-form-item class="btn-area">
                <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
                <span class="spp-btn" @click="resetForm()">重置</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body" style="border-radius:5px 5px 0 0; padding-top:3px;">
            <el-table ref="table" :data="data">
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column label="学校名称" prop="scl_name" width="220" />
              <el-table-column label="人数" prop="all_stu_num" />
              <el-table-column label="已考勤" prop="hs_stu_num" />
              <el-table-column label="未考勤" prop="no_stu_num" />
              <el-table-column label="考勤率" prop="att_stu_rate" />
              <el-table-column label="日同比">
                <template slot-scope="scope">
                  <span :class="scope.row.day_rate > 0 ? 'red' : scope.row.day_rate < 0 ? 'green' : ''">
                    <!-- 这里纯粹是为了避免语法检测采用了这种奇葩的判断方式 -->
                    {{ (scope.row.day_rate > 0 ? '↑ ' : !(scope.row.day_rate >= 0) ? '↓ ' : '') + Math.abs(scope.row.day_rate) + '%' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="周同比">
                <template slot-scope="scope">
                  <span :class="scope.row.week_rate > 0 ? 'red' : scope.row.week_rate < 0 ? 'green' : ''">
                    {{ (scope.row.week_rate > 0 ? '↑ ' : !(scope.row.week_rate >= 0) ? '↓ ' : '') + Math.abs(scope.row.week_rate) + '%' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="月同比">
                <template slot-scope="scope">
                  <span :class="scope.row.month_rate > 0 ? 'red' : scope.row.month_rate < 0 ? 'green' : ''">
                    {{ (scope.row.month_rate > 0 ? '↑ ' : !(scope.row.month_rate >= 0) ? '↓ ' : '') + Math.abs(scope.row.month_rate) + '%' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作" width="130">
                <template slot-scope="scope">
                  <el-button v-if="functionList.includes('A43001')" type="text" @click="showDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="functionList.includes('A43002')" label="考勤统计" name="second">
          <div class="main-body">
            <chart style="padding:24px" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="detailTitle" :visible.sync="showDetailDialog" width="800px" class="draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <div style="display:flex; justify-content:space-between">
          <div class="input-box" style="width:240px;">
            <input v-model="stu_name" placeholder="搜索学生姓名" style="width:200px;" @keyup.enter="searchAtt()">
            <span class="input-click" @click="searchAtt()">
              <svg-icon icon-class="search" />
            </span>
          </div>
          <el-radio-group v-model="att_type" size="small">
            <el-radio-button label="已考勤" />
            <el-radio-button label="未考勤" />
          </el-radio-group>
        </div>
        <div v-if="att_type === '已考勤'">
          <el-table ref="att_table" :data="att_data">
            <el-table-column label="姓名" prop="stu_name" />
            <el-table-column label="年级" prop="gra_name" />
            <el-table-column label="班级" prop="cls_name" />
            <el-table-column label="进出类型" prop="inout_type_name" />
            <el-table-column label="考勤时间" width="170">
              <template slot-scope="scope">{{ formatDateTime(scope.row.att_time) }}</template>
            </el-table-column>
            <el-table-column label="学生体温">
              <template slot-scope="scope">{{ (scope.row.temperature && scope.row.temperature !== '0') ? (scope.row.temperature + '℃') : '--' }}</template>
            </el-table-column>
            <el-table-column label="考勤照片" prop="days">
              <template slot-scope="scope">
                <el-button v-if="scope.row.face_pic" type="text" @click="showPic(scope.row.face_pic)">查看</el-button>
                <span v-if="!scope.row.face_pic">--</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="page_att_total>0" :total="page_att_total" :page.sync="page_att" :limit.sync="page_att_size" @pagination="getAttData" />
        </div>
        <div v-if="att_type === '未考勤'">
          <el-table ref="no_att_table" :data="no_att_data">
            <el-table-column label="姓名" prop="stu_name" />
            <el-table-column label="年级" prop="gra_name" />
            <el-table-column label="班级" prop="cls_name" />
          </el-table>
          <pagination v-show="page_no_att_total>0" :total="page_no_att_total" :page.sync="page_no_att" :limit.sync="page_no_att_size" @pagination="getNoAttData" />
        </div>
      </el-scrollbar>
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[pic_url]" />
    </el-dialog>
  </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Pagination from '@/components/Pagination'
import chart from './components/chart'
import { formatDateTime, getAttendanceInfo, getDateString } from '@/utils/index'
import { getPajxAtt } from '@/api/pajx'
import { mapState } from 'vuex'
export default {
  name: 'Notice',
  components: { Pagination, chart, ElImageViewer },
  data() {
    return {
      upload_url: '',
      height: window.innerHeight - 90,
      activeName: 'first',
      search: {
        date: new Date(),
        scl_name: ''
      },
      data: [],
      showDetailDialog: false,
      detailTitle: '',
      att_type: '已考勤',
      att_data: [],
      no_att_data: [],
      page_att: 1,
      page_att_size: 10,
      page_att_total: 0,
      page_no_att: 1,
      page_no_att_size: 10,
      page_no_att_total: 0,
      stu_name: '',
      scl_id: '',
      showViewer: false,
      pic_url: ''
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getData() {
      getAttendanceInfo(this.search.scl_name, this.search.date).then(res => {
        this.data = res
      })
    },
    showDetail(scl_data) {
      this.showDetailDialog = true
      this.detailTitle = scl_data.scl_name
      this.att_type = '已考勤'
      this.att_data = []
      this.no_att_data = []
      this.page_att = 1
      this.page_att_total = 0
      this.page_no_att = 1
      this.page_no_att_total = 0
      this.stu_name = ''
      this.scl_id = scl_data.scl_id
      this.getAttData()
      this.getNoAttData()
    },
    searchAtt() {
      this.page_att = 1
      this.page_no_att = 1
      this.getAttData()
      this.getNoAttData()
    },
    getAttData() {
      const search = {
        att_flag: '1',
        att_date: getDateString(this.search.date, 'yyyyMMdd'),
        pajx_scl_id: this.scl_id,
        stu_name: this.stu_name
      }
      getPajxAtt(search, this.page_att, this.page_att_size).then(res => {
        this.att_data = res.data.pajx_data.list
        this.page_att_total = res.data.pajx_data.totalRow
      })
    },
    getNoAttData() {
      const search = {
        att_flag: '2',
        att_date: getDateString(this.search.date, 'yyyyMMdd'),
        pajx_scl_id: this.scl_id,
        stu_name: this.stu_name
      }
      getPajxAtt(search, this.page_no_att, this.page_no_att_size).then(res => {
        this.no_att_data = res.data.pajx_data.list
        this.page_no_att_total = res.data.pajx_data.totalRow
      })
    },
    showPic(pic) {
      this.pic_url = process.env.VUE_APP_PAJX_IMG_URL + pic
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>
<style lang="scss">
.notice-page {
  .el-tabs__header {
    margin: 0;
  }
  .att_tab {
    #tab-first {
      margin-left: 16px;
    }
    .el-tabs__active-bar {
      margin-left: 16px;
    }
    .el-tabs__content {
      background-color: #f0f2f5
    }
  }
}
</style>
