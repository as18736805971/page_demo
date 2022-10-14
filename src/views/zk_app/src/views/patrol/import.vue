<template>
  <div class="app-container page-container right-side-dialog">
    <div class="main-header">
      <div class="left">
        <el-button class="spp-btn spp-btn-primary" @click="importData()">
          <svg-icon icon-class="add" />
          <span>导入</span>
        </el-button>
        <a :href="down_url + '/tpl/daily_patorl_add.xlsx'" target="_blank">
          <el-button class="spp-btn">
            <svg-icon icon-class="device" />
            <span>下载模板</span>
          </el-button>
        </a>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            {{ scope.row.task_type == '1' ? '风险点' : '巡检点' }} </template>
        </el-table-column>
        <el-table-column prop="task_no" label="任务编号" />
        <el-table-column prop="file_ori_name" label="文件名" />
        <el-table-column prop="create_time" label="创建时间" width="180px">
          <template slot-scope="scope">{{
            formatDateTime(scope.row.create_time)
          }}</template>
        </el-table-column>
        <el-table-column prop="create_user_name" label="创建人" width="150px" />
        <el-table-column prop="status_flag" label="处理状态" width="100px">
          <template slot-scope="scope">{{
            task_status[scope.row.status_flag]
          }}</template>
        </el-table-column>
        <el-table-column prop="finish_time" label="完成时间" width="180px">
          <template slot-scope="scope">{{
            formatDateTime(scope.row.finish_time)
          }}</template>
        </el-table-column>
        <el-table-column prop="success_num" label="成功数" />
        <el-table-column prop="fail_num" label="失败数" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="getDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog title="导入巡查计划" :visible.sync="showDialog" :close-on-click-modal="false" width="720px" class="right-noall-content draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form :model="form" :rules="rules" label-width="120px">
          <el-input v-model="form.scl_model" type="hidden" class="spp-hidden" />
          <el-form-item label="巡查计划文件">
            <el-upload
              ref="upload"
              :action="upload_url"
              :accept="'.xlsx'"
              :http-request="uploadFile"
              :on-change="handleUploadFileChange"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button slot="trigger" class="spp-btn spp-btn-primary" size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过20MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="importSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
    <el-dialog title="导入执行详情" :visible.sync="showDetailDialog" width="800px" class="right-noall-content draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-table ref="table" :data="error_data">
          <el-table-column prop="rowNum" label="表行数" width="80" />
          <el-table-column prop="patrolName" label="巡检名称" width="150" />
          <el-table-column prop="riskName" label="风险点名称" width="150" />
          <el-table-column prop="patrolRate" label="巡检频率" width="120" />
          <el-table-column prop="errorMsg" label="错误信息" />
        </el-table>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatDateTime, uploadFileUrl } from '@/utils/index'
import { patrol_paginate, detail } from '@/api/risk_import'
import { mapGetters } from 'vuex'
export default {
  name: 'RiskImport',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      upload_url: '',
      fileList: [],
      search: {
        start_time: '',
        end_time: ''
      },
      task_status: {
        '0': '作废',
        '1': '排队',
        '2': '处理中',
        '3': '处理成功',
        '4': '处理失败',
        '5': '有错误信息'
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      error_data: [],
      form: {
        task_type: '3',
        file_path: ''
      },
      rules: {
        file_path: [
          { required: true, trigger: 'blur', message: '请上传文件' }
        ]
      },
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    uploadFile(params) {
      const data = {
        upload_code: this.form.task_type
      }
      const file = params.file
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFileUrl('/api/assist/upload/batcktask', data, file).then(response => {
        this.form.file_path = response.data.upload_path
      })
    },
    handleUploadFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    getData() {
      patrol_paginate(this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    getDetail(data) {
      this.error_data = JSON.parse(data.fail_json)
      console.log(this.error_data, '45455454')
      this.showDetailDialog = true
    },
    resetForm() {
      this.search = {
        start_time: '',
        end_time: ''
      }
    },
    importData() {
      this.showDialog = true
      this.form = {
        task_type: '3',
        file_path: ''
      }
      this.fileList = []
    },
    importSubmit() {
      this.$refs.upload.submit()
      this.showDialog = false
      this.getData()
    }
  }
}
</script>

<style lang="scss">
</style>
