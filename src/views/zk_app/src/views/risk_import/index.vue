<template>
  <div class="app-container page-container right-side-dialog">
    <div class="main-header">
      <div class="left">
        <el-button
          v-if="functionList.includes('A45001')"
          class="spp-btn spp-btn-primary"
          @click="importData()"
        >
          <svg-icon icon-class="add" />
          <span>导入</span>
        </el-button>
        <!--<a :href="down_url + '/tpl/risk_info_add.xlsx'" target="_blank">
          <el-button class="spp-btn">
            <svg-icon icon-class="device" />
            <span>基础风险点模板</span>
          </el-button>
        </a>-->
        <a :href="down_url + '/tpl/scl_risk_info_add.xlsx'" target="_blank">
          <el-button class="spp-btn">
            <svg-icon icon-class="device" />
            <span>学校风险点模板</span>
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
        <el-table-column prop="task_no" width="180px" label="任务编号" />
        <el-table-column label="文件名" min-width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDown(scope.row)">{{ scope.row.file_ori_name }}</el-button>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="getDetail(scope.row)">错误详情</el-button>
            <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
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
    <el-dialog
      title="导入风险点"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="right-noall-content draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-form :model="form" :rules="rules" label-width="120px">
          <el-form-item label="风险模版" prop="task_type">
            <el-select v-model="form.task_type" placeholder="请选择">
              <!--<el-option label="基础风险点" value="1" />-->
              <el-option label="学校风险点" value="2" />
            </el-select>
          </el-form-item>
          <el-input v-model="form.scl_model" type="hidden" class="spp-hidden" />
          <el-form-item label="风险点文件">
            <el-upload
              ref="upload"
              :action="upload_url"
              :accept="'.xlsx'"
              :http-request="uploadFile"
              :on-change="handleUploadFileChange"
              :file-list="fileList"
              :auto-upload="false"
            >
              <el-button
                slot="trigger"
                class="spp-btn spp-btn-primary"
                size="small"
              >点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传xlsx文件，且不超过20MB
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="importSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
    <el-dialog
      title="导入执行详情"
      :visible.sync="showDetailDialog"
      width="800px"
      class="right-noall-content draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-table ref="table" :data="error_data">
          <el-table-column prop="rowNum" label="所在行" width="80" />
          <el-table-column prop="riskName" label="风险点名称" width="150" />
          <el-table-column prop="errorMsg" label="错误信息" />
        </el-table>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatDateTime, uploadFileUrl } from '@/utils/index'
import { paginate, download, batchDel } from '@/api/risk_import'
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
      task_type: {
        1: '设施风险点',
        2: '活动风险点'
      },
      task_status: {
        0: '作废',
        1: '排队',
        2: '处理中',
        3: '处理成功',
        4: '处理失败',
        5: '有错误信息'
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      error_data: [],
      form: {
        task_type: '2',
        file_path: ''
      },
      rules: {
        task_type: [
          { required: true, message: '请选择风险点类型', trigger: 'blur' }
        ],
        file_path: [{ required: true, trigger: 'blur', message: '请上传文件' }]
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
        upload_code: this.form.task_type,
        task_type: this.form.task_type
      }
      const file = params.file
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFileUrl('/api/assist/upload/batcktask', data, file).then(
        (response) => {
          this.form.file_path = response.data.upload_path
          this.getData()
        }
      )
    },
    handleUploadFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    getData() {
      paginate(this.page, this.page_size).then((response) => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    getDetail(data) {
      this.error_data = JSON.parse(data.fail_json)
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
        task_type: '2',
        file_path: ''
      }
      this.fileList = []
    },
    importSubmit() {
      this.$refs.upload.submit()
      this.showDialog = false
    },
    async handleDown(data) {
      const url = await download(data.task_id)
      window.open(url)
    },
    handleDel(data) {
      this.$confirm('您确定要删除该文件吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDel(data.task_id).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
