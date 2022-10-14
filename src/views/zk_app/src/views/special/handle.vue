<template>
  <div class="app-container page-container right-side-dialog special-index">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="检查名称：">
            <el-input v-model="search.si_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发布开始：">
            <el-date-picker
              v-model="search.start_time"
              type="date"
              placeholder="请选择"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="发布结束：">
            <el-date-picker
              v-model="search.end_time"
              type="date"
              placeholder="请选择"
              style="width: 200px"
            />
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
        <el-table-column label="开始时间">
          <template
            slot-scope="scope"
          >{{ scope.row.start_time ? formatDateTime(scope.row.start_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template
            slot-scope="scope"
          >{{ scope.row.end_time ? formatDateTime(scope.row.end_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="发布时间" prop="create_time">
          <template
            slot-scope="scope"
          >{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="发布单位" prop="org_name" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="functionList.includes('A27002')"
              type="text"
              @click="report(scope.row.si_id)"
            >报告问题</el-button>
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
    <el-dialog
      title="报告问题"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form label-width="80px">
          <el-form-item class="detail-el-form-item" label="检查名称：">{{ detail.si_name }}</el-form-item>
          <el-form-item
            class="detail-el-form-item"
            label="检查方式："
          >{{ inspection_type[detail.inspection_type] }}</el-form-item>
          <el-form-item
            class="detail-el-form-item"
            label="开始时间："
          >{{ formatDateTime(detail.start_time) }}</el-form-item>
          <el-form-item
            class="detail-el-form-item"
            label="结束时间："
          >{{ formatDateTime(detail.end_time) }}</el-form-item>
        </el-form>
        <el-divider class="my_divider" content-position="left">检查项目</el-divider>
        <div>
          <div
            v-for="(item, k) in detail.item_list"
            :key="k"
            style="margin-top: 16px; border: 1px solid #E1E3E6; padding: 12px"
          >
            <div style="font-size: 16px; color: #313233; margin-bottom: 16px">
              <b>{{ item.item_title }}</b>
            </div>
            <div>
              <el-form label-width="80px">
                <el-form-item class="detail-el-form-item" label="项目内容：">{{ item.item_content }}</el-form-item>
                <el-form-item class="detail-el-form-item" label="项目分值：">{{ item.item_score }}分</el-form-item>
                <el-form-item
                  class="detail-el-form-item"
                  label="评分标准："
                >{{ item.item_score_standrad }}</el-form-item>
              </el-form>
              <div style="margin: 16px 0px">
                <span class="spp-btn" @click="addReport(detail.si_id, item.sii_id)">
                  <svg-icon icon-class="add-report" />添加报告
                </span>
              </div>
              <div v-if="item.report.length > 0">
                <el-tabs :ref="'tabs_' + k" type="card" style="margin-bottom: 8px">
                  <el-tab-pane v-for="(i, kk) in item.report" :key="kk" :label="'报告' + (kk + 1)">
                    <div
                      :class="i.attachment.length > 0 ? 'step_border' : 'step_border_no_att'"
                      style="padding: 0 16px"
                    >
                      <el-form label-width="80px">
                        <el-form-item
                          class="detail-el-form-item"
                          label="报告内容："
                        >{{ i.report_content }}</el-form-item>
                      </el-form>
                    </div>
                    <AttachmentList
                      v-if="i.attachment.length > 0"
                      :is-watch="true"
                      :attachment="i.attachment"
                      style="padding: 0 16px"
                    />
                    <div style="text-align: right; margin-top:8px">
                      <span
                        class="spp-btn"
                        style="margin-right:16px"
                        @click="delReport(i.report_id, item.sii_id, 'tabs_' + k)"
                      >
                        <svg-icon icon-class="delete" />删除
                      </span>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
    <el-dialog
      title="添加报告"
      :visible.sync="showReportDialog"
      :close-on-click-modal="false"
      width="480px"
      class="draw_dialog"
    >
      <el-form v-if="showReportDialog" ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="报告内容" prop="report_content">
          <el-input v-model="form.report_content" type="textarea" :rows="4" placeholder="请输入报告内容" />
        </el-form-item>
        <el-form-item label="报告附件">
          <Uploadfile @getFileList="getFileList" />
        </el-form-item>
        <div class="dialog-btn" style="text-align: right">
          <span class="spp-btn spp-btn-primary" @click="reportSubmit()">提交</span>
          <span class="spp-btn" @click="reset">重置</span>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  inspection_scl_paginate,
  add_report,
  delete_report,
  get_inspection_detail,
  item_report
} from '@/api/special_inspection'
import Pagination from '@/components/Pagination'
import AttachmentList from '@/components/AttachmentList'
import Uploadfile from '@/components/Uploadfile'
import { formatDateTime, getDateString } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'SpecialHandle',
  components: { Pagination, AttachmentList, Uploadfile },
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
      showDialog: false,
      showReportDialog: false,
      detail: {},
      stepList: [],
      schoolList: [],
      form: {
        report_content: '',
        attachment_url: '',
        attachment_name: '',
        attachment_ext: ''
      },
      rules: {
        report_content: [
          { required: true, message: '请输入报告内容', trigger: 'blur' }
        ]
      },
      files: {}
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.height = window.innerHeight - 84
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getFileList(files) {
      this.files = files
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      if (this.search.start_time !== '' && this.search.end_time !== '') {
        if (this.search.end_time < this.search.start_time) {
          this.$message.error('结束日期不能小于开始日期')
          return false
        }
      }
      const search = {
        si_name: this.search.si_name,
        start_time: this.search.start_time
          ? getDateString(this.search.start_time, 'yyyyMMdd') + '000000'
          : '',
        end_time: this.search.end_time
          ? getDateString(this.search.end_time, 'yyyyMMdd') + '235959'
          : ''
      }
      inspection_scl_paginate(search, this.page, this.page_size).then(
        response => {
          this.data = response.data.list
          this.total = response.data.totalRow
        }
      )
    },
    report(si_id) {
      this.showDialog = true
      get_inspection_detail(si_id, '').then(response => {
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
    addReport(si_id, sii_id) {
      Object.assign(this.form, this.$options.data().form)
      this.form['si_id'] = si_id
      this.form['sii_id'] = sii_id
      this.files = []
      this.showReportDialog = true
    },
    reportSubmit() {
      // 报告和附件有一个就行
      if (!this.form.report_content && Object.keys(this.files).length === 0) {
        this.$message.error('请将报告填写完整。')
        return false
      }
      const data = {
        si_id: this.form.si_id,
        sii_id: this.form.sii_id,
        report_content: this.form.report_content,
        attachment_url: '',
        attachment_name: '',
        attachment_ext: ''
      }
      let attachment_url = ''
      let attachment_name = ''
      let attachment_ext = ''
      for (const i in this.files) {
        attachment_url += this.files[i].attachment_url + '|'
        attachment_name += this.files[i].attachment_name + '|'
        attachment_ext += this.files[i].attachment_ext + '|'
      }
      data.attachment_url = attachment_url.substring(
        0,
        attachment_url.length - 1
      )
      data.attachment_name = attachment_name.substring(
        0,
        attachment_name.length - 1
      )
      data.attachment_ext = attachment_ext.substring(
        0,
        attachment_ext.length - 1
      )
      add_report(data).then(response => {
        this.showReportDialog = false
        this.getReport(this.form.sii_id)
      })
    },
    delReport(id, sii_id, ref) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delete_report(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$refs[ref][0].currentName = '0'
            this.getReport(sii_id)
          })
        })
        .catch(() => {})
    },
    getReport(sii_id) {
      item_report(sii_id).then(response => {
        const data = response.data
        const report = {}
        const result = []
        data.report_list.forEach(item => {
          item['attachment'] = []
          report[item.report_id] = item
        })
        data.report_attachment_list.forEach(item => {
          report[item.sir_id].attachment.push(item)
        })
        for (const i in report) {
          result.push(report[i])
        }
        this.detail.item_data[sii_id].report = result
        this.$forceUpdate()
      })
    },
    resetForm() {
      this.search = {
        si_name: '',
        start_time: '',
        end_time: ''
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    }
  }
}
</script>
