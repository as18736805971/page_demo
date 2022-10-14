<template>
  <div class="app-container page-container right-side-dialog special-index">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="检查名称：">
            <el-input v-model="search.si_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发布开始：">
            <el-date-picker v-model="search.start_time" type="date" placeholder="请选择" style="width: 200px" />
          </el-form-item>
          <el-form-item label="发布结束：">
            <el-date-picker v-model="search.end_time" type="date" placeholder="请选择" style="width: 200px" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="检查名称" prop="si_name" />
        <el-table-column label="检查方式" prop="inspection_type">
          <template slot-scope="scope">{{ inspection_type[scope.row.inspection_type] }}</template>
        </el-table-column>
        <el-table-column label="检查开始时间" prop="start_time">
          <template slot-scope="scope">{{ scope.row.start_time ? formatDateTime(scope.row.start_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="检查结束时间" prop="end_time">
          <template slot-scope="scope">{{ scope.row.end_time ? formatDateTime(scope.row.end_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="参与学校数" prop="school_count" width="120" />
        <el-table-column label="检查项目数" prop="item_count" width="120" />
        <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="user_name" />
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A26003')" type="text" @click="scoreResult(scope.row.si_id)">分数统计</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A26002')" @click.native="reportDetail(scope.row.si_id)">查看报告</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A26004')" @click.native="exportReport(scope.row.si_id)">导出报告</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      title="查看分数统计"
      :visible.sync="showResultDialog"
      :close-on-click-modal="false"
      width="720px"
      @opened="scoreResultCallBack"
    >
      <div style="overflow-y: auto; padding: 0 16px" :style="{height: height + 'px'}">
        <div id="myChart" :style="{height: '400px'}" style="text-align:center" />
        <el-table ref="table" class="static_table" border :data="scl_result_data">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="学校名称" prop="scl_name" />
          <el-table-column label="检查分数" prop="score" />
          <el-table-column label="是否合格" prop="is_fit">
            <template slot-scope="scope">{{ scope.row.is_passed === '1' ? '合格' : '不合格' }}</template>
          </el-table-column>
        </el-table>
        <pagination v-show="total_school>0" :total="total_school" :page.sync="page_school" :limit.sync="page_size_school" @pagination="getSclData" />
      </div>
    </el-dialog>
    <el-dialog
      title="查看问题报告"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="special_draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <div>
          <el-form :model="search" :inline="true" style="text-align:center">
            <el-button class="spp-btn" :disabled="scl_selected == 0" style="margin-right:24px;" @click="getPre(detail.id)">上一个</el-button>
            <el-form-item>
              <el-select v-model="scl_id_selected" placeholder="请选择" @change="changeSchool(detail.id)">
                <el-option v-for="(item) in school_list" :key="item.scl_id" :label="item.scl_name" :value="item.scl_id" />
              </el-select>
            </el-form-item>
            <el-button class="spp-btn" :disabled="scl_selected == (school_list.length - 1)" @click="getNext(detail.id)">下一个</el-button>
          </el-form>
        </div>
        <el-form label-width="80px">
          <el-form-item class="detail-el-form-item" label="检查名称：">
            {{ detail.si_name }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="检查方式：">
            {{ inspection_type[detail.inspection_type] }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="开始时间：">
            {{ formatDateTime(detail.start_time) }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="结束时间：">
            {{ formatDateTime(detail.end_time) }}
          </el-form-item>
        </el-form>
        <el-divider class="my_divider" content-position="left">检查项目</el-divider>
        <div>
          <div v-for="(item, k) in detail.item_data" :key="k" style="margin-top: 16px; border: 1px solid #E1E3E6; padding: 12px">
            <div class="space_between" style="font-size: 16px; color: #313233; margin-bottom: 16px">
              <b>{{ item.item_title }}</b><span>得分：{{ item.score ? item.score : '--' }}</span>
            </div>
            <el-form label-width="80px" style="margin-bottom: 16px">
              <el-form-item class="detail-el-form-item" label="项目内容：">
                {{ item.item_content }}
              </el-form-item>
              <el-form-item class="detail-el-form-item" label="项目分值：">
                {{ item.item_score }}分
              </el-form-item>
              <el-form-item class="detail-el-form-item" label="评分标准：">
                {{ item.item_score_standrad }}
              </el-form-item>
            </el-form>
            <div v-if="item.report.length > 0">
              <el-tabs style="margin-bottom: 8px" type="card">
                <el-tab-pane v-for="(i, kk) in item.report" :key="kk" :label="'报告' + (kk + 1)">
                  <div :class="i.attachment.length > 0 ? 'step_border' : 'step_border_no_att'" style="padding: 0 16px">
                    <el-form label-width="80px">
                      <el-form-item class="detail-el-form-item" label="报告内容：">
                        {{ i.report_content }}
                      </el-form-item>
                    </el-form>
                  </div>
                  <AttachmentList v-if="i.attachment.length > 0" :attachment="i.attachment" style="padding: 0 16px" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import { info_paginate, get_inspection_scl_list, get_inspection_detail, get_inspection_scl_paginate, get_inspection_scl_status } from '@/api/special_inspection'
import Pagination from '@/components/Pagination'
import AttachmentList from '@/components/AttachmentList'
import { formatDateTime, getDateString } from '@/utils/index'
import { mapState } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'SpecialResult',
  components: { Pagination, AttachmentList },
  data() {
    return {
      search: {
        si_name: '',
        start_time: '',
        end_time: ''
      },
      inspection_type: {
        1: '上级督察',
        2: '学校自查',
        3: '部门联查'
      },
      height: window.innerHeight - 90,
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      scl_result_data: [],
      page_school: 1,
      page_size_school: 10,
      total_school: 0,
      showDialog: false,
      showResultDialog: false,
      detail: {},
      school_list: [],
      scl_id_selected: '',
      scl_selected: '',
      scl_first: '',
      scl_end: '',
      row_id_selected: ''
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.height = window.innerHeight - 125
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const search = {
        si_name: this.search.si_name,
        inspection_status: '1',
        start_time: this.search.start_time ? (getDateString(this.search.start_time, 'yyyyMMdd') + '000000') : '',
        end_time: this.search.end_time ? (getDateString(this.search.end_time, 'yyyyMMdd') + '235959') : ''
      }
      info_paginate(search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    reportDetail(id) {
      get_inspection_scl_list(id).then(response => {
        this.school_list = response.data
        this.scl_selected = 0
        this.scl_id_selected = this.school_list[0].scl_id
        this.showDialog = true
        this.get_report_detail(id)
      })
    },
    getPre(id) {
      if (this.scl_selected - 1 < 0) {
        return false
      }
      this.scl_id_selected = this.school_list[--this.scl_selected].scl_id
      this.get_report_detail(id)
    },
    getNext(id) {
      if (this.scl_selected + 1 >= this.school_list.length) {
        return false
      }
      this.scl_id_selected = this.school_list[++this.scl_selected].scl_id
      this.get_report_detail(id)
    },
    changeSchool(id) {
      for (const i in this.school_list) {
        if (this.scl_id_selected === this.school_list[i].scl_id) {
          this.scl_selected = i
        }
      }
      this.get_report_detail(id)
    },
    get_report_detail(id) {
      get_inspection_detail(id, this.scl_id_selected).then(response => {
        this.detail = response.data
        const item_data = {}
        this.detail.item_list.forEach(item => {
          item['report'] = []
          item['rate'] = item['score'] ? item['score'] : 0
          item_data[item.sii_id] = item
        })
        const report = {}
        this.detail.report_list.forEach(item => {
          item['attachment'] = []
          report[item.report_id] = item
        })
        this.detail.report_attachment_list.forEach(item => {
          report[item.sir_id].attachment.push(item)
        })
        for (const i in report) {
          item_data[report[i].sii_id].report.push(report[i])
        }
        this.detail.item_data = item_data
      })
    },
    scoreResult(id) {
      this.showResultDialog = true
      this.page_school = 1
      this.row_id_selected = id
      this.getSclData(id)
    },
    scoreResultCallBack() {
      get_inspection_scl_status(this.row_id_selected).then(response => {
        const data = response.data
        const myChart = echarts.init(document.getElementById('myChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            data: ['合格', '不合格']
          },
          color: ['#29B6F6', '#FF8A65'],
          series: [
            {
              name: '分数统计',
              type: 'pie',
              data: [
                { value: data.good_count, name: '合格' },
                { value: data.bad_count, name: '不合格' }
              ]
            }
          ]
        })
      })
    },
    getSclData(id) {
      this.page_school = 1
      get_inspection_scl_paginate(id).then(response => {
        this.scl_result_data = response.data.list
        this.total_school = response.data.totalRow
      })
    },
    resetForm() {
      this.search = {
        si_name: '',
        date_range: []
      }
    },
    stepFinish() {
      this.showDialog = false
      this.getData()
    },
    downAttachment: function(url) {
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.special_draw_dialog {
  .el-form-item--medium {
    position: relative;
    top: -3px;
  }
}
</style>
