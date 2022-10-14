<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="计划名称：">
            <el-input v-model="search.patrol_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="排查频率：">
            <el-select
              v-model="search.patrol_rate"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, k) in patrol_rate"
                :key="k"
                :label="item"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排查计划类型：">
            <el-select
              v-model="search.patrol_type"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, k) in patrol_type"
                :key="k"
                :label="item"
                :value="k"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A23002')"
          class="spp-btn spp-btn-primary"
          @click="addPatrol()"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span
          v-if="functionList.includes('A23004')"
          class="spp-btn"
          @click="delBatch()"
        >
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
        <span v-if="functionList.includes('A23001')" class="spp-btn" @click="exportAll">
          <svg-icon icon-class="exportAll" />
          <span>导出全部</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="计划名称" prop="patrol_name" />
        <el-table-column label="排查类型" prop="patrol_type">
          <template slot-scope="scope">{{
            patrol_type[scope.row.patrol_type]
          }}</template>
        </el-table-column>
        <el-table-column label="排查频率" prop="patrol_rate">
          <template slot-scope="scope">{{
            patrol_rate[scope.row.patrol_rate]
          }}</template>
        </el-table-column>
        <el-table-column label="巡检负责人" prop="user_name" />
        <el-table-column label="最后一次巡检时间">
          <template slot-scope="scope">{{
            scope.row.last_patrol_date
              ? formatDateTime(scope.row.last_patrol_date)
              : "--"
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A23005')" type="text" @click="showReport(scope.row.id)">排查报告</el-button>
            <el-button v-if="functionList.includes('A23003')" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="functionList.includes('A23004')" type="text" @click="del(scope.row.id)">删除</el-button>
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
      title="排查报告"
      :visible.sync="showReportDialog"
      width="720px"
      class="draw_dialog patrol_draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-form label-width="100px">
          <el-form-item class="detail-el-form-item" label="计划名称：">
            {{ detail.patrol_name }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="排查内容：">
            {{ detail.patrol_content }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="排查频率：">
            {{ patrol_rate[detail.patrol_rate] }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="负责人：">
            {{ detail.patrol_man }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="巡检点位置：">
            {{ detail.patrol_location }}
          </el-form-item>
          <el-divider
            class="my_divider"
            content-position="left"
          >排查清单</el-divider>
          <div>
            <div class="space_between">
              <el-date-picker
                v-model="daterange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="height: 32px; line-height: 32px"
              />
              <span
                class="spp-btn spp-btn-primary"
                style="margin-right: 0"
                @click="getReport"
              >搜索</span>
            </div>
            <div v-for="(item, k) in report" :key="k" style="margin-top: 16px">
              <div
                :class="
                  item.attachment.length > 0
                    ? 'step_border'
                    : 'step_border_no_att'
                "
              >
                <el-row>
                  <el-col :span="12"> 排查人：{{ item.user_name }} </el-col>
                  <el-col :span="12">
                    排查时间：{{ formatDateTime(item.create_time) }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    排查结果：<span
                      v-show="item.patrol_status === '1'"
                      style="color: #4dcd70"
                    >正常</span>
                    <span
                      v-show="item.patrol_status !== '1'"
                      style="color: #f75a53"
                    >异常</span>
                  </el-col>
                  <el-col :span="12">
                    结果报告：{{ item.patrol_result }}
                  </el-col>
                </el-row>
              </div>
              <AttachmentList
                v-if="item.attachment.length > 0"
                :attachment="item.attachment"
              />
            </div>
          </div>
          <pagination
            v-show="report_total > 0"
            :total="report_total"
            :page.sync="report_page"
            :limit.sync="report_page_size"
            @pagination="getReport"
          />
        </el-form>
      </el-scrollbar>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-form
          v-if="showDialog"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <template v-if="form.id === ''">
            <el-form-item label="学校风险点" prop="sr_id">
              <el-select
                v-model="form.sr_id"
                style="width: 100%"
                clearable
                filterable
                placeholder="请选择风险点标识"
                @change="handleChangeScl"
              >
                <el-option
                  v-for="(item, index) in risk_list"
                  :key="index"
                  :label="item.scl_risk_name"
                  :value="item.sr_id"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="学校风险点"><span style="color: #333333">{{ form.patrol_name }}</span></el-form-item>
          </template>
          <el-form-item label="排查频率" prop="patrol_rate">
            <el-select
              v-model="form.patrol_rate"
              style="width: 100%"
              clearable
              placeholder="请选择排查频率"
            >
              <el-option
                v-for="(item, k) in patrol_rate"
                :key="k"
                :label="item"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检负责人" prop="patrol_man_id">
            <el-select v-model="form.patrol_man_id" style="width: 100%" filterable clearable placeholder="请选择巡检负责人">
              <el-option v-for="(item, index) in patrol_list" :key="index" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="排查内容">
            <el-input
              v-model="form.patrol_content"
              type="textarea"
              :rows="4"
              placeholder="请输入排查内容"
            />
          </el-form-item>
          <!--<el-form-item label="巡检负责人" prop="patrol_man_id">
            <SelectUser
              v-model="form.patrol_man_id"
              :multiple="true"
              @getCheckuser="getCheckuser"
            />
          </el-form-item>-->
          <el-form-item label="NFC码" prop="nfc_code">
            <el-input v-model="form.nfc_code" placeholder="请输入NFC码" />
          </el-form-item>
          <el-form-item label="排查计划类型" prop="patrol_type">
            <el-select
              v-model="form.patrol_type"
              style="width: 100%"
              clearable
              placeholder="请选择排查计划类型"
            >
              <el-option
                v-for="(item, k) in patrol_type"
                :key="k"
                :label="item"
                :value="k"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检点位置">
            <el-input v-model="form.patrol_location" placeholder="请输入巡检点位置" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
        <span class="spp-btn" @click="reset">重置</span>
      </div>
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[pic_url]"
    />
  </div>
</template>

<script>
import {
  paginate,
  addPatrol,
  getPatrolDetail,
  editPatrol,
  deletePatrol,
  bindNFC,
  unbindNFC,
  getPatrolReport,
  getQrCode,
  exportPatrolExcel,
  exportCard,
  exportAllCard,
  riskList
} from '@/api/patrol'
import { getPatrolRrate, getPatrolType } from '@/api/dic'
import Pagination from '@/components/Pagination'
import AttachmentList from '@/components/AttachmentList'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { formatDateTime, getDateString } from '@/utils/index'
import { mapState } from 'vuex'
import { patrolMan } from '@/api/scl_identify'
export default {
  name: 'Patrol',
  components: { Pagination, AttachmentList, ElImageViewer },
  data() {
    return {
      height: window.innerHeight - 90,
      search: {
        patrol_name: '',
        patrol_rate: '',
        patrol_type: ''
      },
      patrol_rate: {},
      patrol_type: {},
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showReportDialog: false,
      dialogTitle: '',
      detail: {},
      patrol_man: [],
      form: {
        id: '',
        patrol_name: '',
        patrol_content: '',
        patrol_rate: '',
        patrol_man_id: '',
        sr_id: '',
        nfc_code: '',
        patrol_type: '',
        patrol_location: ''
      },
      rules: {
        sr_id: [
          { required: true, message: '请选择学校风险点', trigger: 'blur' }
        ],
        patrol_rate: [
          { required: true, message: '请选择排查频率', trigger: 'blur' }
        ],
        patrol_man_id: [
          { required: true, message: '请选择排查人', trigger: 'blur' }
        ]
      },
      report: [],
      report_page: 1,
      report_page_size: 10,
      report_total: 0,
      risk_list: [],
      daterange: null,
      showViewer: false,
      pic_url: '',
      selected_id: '',
      patrol_list: []
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  async created() {
    await this.getPatrolType()
    await this.getPatrolRate()
    await this.getRiskList()
    await this.getPatrolMan()
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getPatrolRate() {
      getPatrolRrate().then((response) => {
        this.patrol_rate = response.data
      })
    },
    getPatrolType() {
      getPatrolType().then((response) => {
        this.patrol_type = response.data
      })
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then((response) => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    // 导出全部
    async exportAll() {
      const {
        patrol_name,
        patrol_rate,
        patrol_type
      } = this.search
      const url = await exportPatrolExcel(
        patrol_name,
        patrol_rate,
        patrol_type
      )
      window.open(url)
    },
    addPatrol() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增排查计划'
    },
    showReport(id) {
      getPatrolDetail(id).then((response) => {
        const data = response.data
        this.detail = {
          patrol_name: data.patrol_name,
          patrol_content: data.patrol_content,
          patrol_rate: data.patrol_rate,
          patrol_man_id: data.patrol_man_id,
          patrol_man: data.user_name,
          nfc_code: data.nfc_code,
          patrol_location: data.patrol_location
        }
        this.showReportDialog = true
        this.selected_id = id
        this.getReport()
      })
    },
    edit(id) {
      getPatrolDetail(id).then((response) => {
        const data = response.data
        this.form = {
          id: data.id,
          patrol_name: data.patrol_name,
          patrol_content: data.patrol_content,
          patrol_rate: data.patrol_rate,
          patrol_man_id: data.patrol_man_id,
          sr_id: data.sr_id,
          nfc_code: data.nfc_code,
          patrol_type: data.patrol_type,
          patrol_location: data.patrol_location
        }
        this.showDialog = true
        this.dialogTitle = '修改排查计划'
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePatrol(id).then((response) => {
            this.getData()
          })
        })
        .catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach((item) => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deletePatrol(str).then((response) => {
              this.getData()
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    // 选择责任岗位/责任人
    getCheckuser(user) {
      const responsible_man_list = user.map((opt) => {
        return opt[opt.length - 1]
      })
      this.form.patrol_man_id = responsible_man_list.join(',')
    },
    // 巡检负责人
    getPatrolMan() {
      patrolMan().then((res) => {
        this.patrol_list = res.data || []
      }).catch(() => {
        this.patrol_list = []
      })
    },
    submit() {
      if (!this.form.id) {
        // 新增
        this.$refs.form.validate((valid) => {
          if (valid) {
            addPatrol(this.form).then((response) => {
              this.showDialog = false
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate((valid) => {
          if (valid) {
            editPatrol(this.form).then((response) => {
              this.showDialog = false
              this.getData()
            })
          }
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    resetForm() {
      this.search = {
        patrol_name: '',
        patrol_rate: ''
      }
    },
    bindNFC(id) {
      this.$prompt('NFC码', '绑定NFC码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\w+/,
        inputErrorMessage: 'NFC码不能为空'
      })
        .then(({ value }) => {
          bindNFC(id, value).then((response) => {
            this.data.forEach((item) => {
              if (item.id === id) {
                item.nfc_code = value
              }
            })
          })
        })
        .catch(() => {})
    },
    unbindNFC(id) {
      unbindNFC(id).then((response) => {
        this.data.forEach((item) => {
          if (item.id === id) {
            item.nfc_code = ''
          }
        })
      })
    },
    getReport() {
      const start_date = this.daterange
        ? getDateString(this.daterange[0], 'yyyyMMdd') + '000000'
        : ''
      const end_date = this.daterange
        ? getDateString(this.daterange[1], 'yyyyMMdd') + '235959'
        : ''
      getPatrolReport(
        this.selected_id,
        start_date,
        end_date,
        this.report_page,
        this.report_page_size
      ).then((response) => {
        const data = response.data.list
        this.report_total = response.data.totalRow
        const report = []
        data.forEach((item) => {
          const tmp = {
            id: '1',
            patrol_result: item.patrol_result,
            patrol_status: item.patrol_status,
            user_name: item.user_name,
            create_time: item.create_time,
            hd_id: item.hd_id,
            attachment: []
          }
          const attachment_url = item.attachment_url
            ? item.attachment_url.split('|')
            : ''
          const attachment_name = item.attachment_name
            ? item.attachment_name.split('|')
            : ''
          const attachment_ext = item.attachment_ext
            ? item.attachment_ext.split('|')
            : ''
          for (const i in attachment_url) {
            const t = {
              attachment_url: attachment_url[i],
              attachment_name: attachment_name[i],
              attachment_ext: attachment_ext[i]
            }
            tmp.attachment.push(t)
          }
          report.push(tmp)
        })
        this.report = report
      })
    },
    getRiskList() {
      riskList().then((res) => {
        this.risk_list = res.data
      })
    },
    downAttachment: function(url) {
      window.open(url)
    },
    seeCode(id) {
      getQrCode(id).then((res) => {
        this.pic_url = res.data.qrcode
        this.showViewer = true
      })
    },
    closeViewer() {
      this.showViewer = false
    },
    async handleExportCard(data) {
      if (data.nfc_code && data.nfc_code !== '') {
        const url = await exportCard(data.id)
        window.open(url)
      } else {
        this.$message({
          message: '请先绑定NFC码!',
          type: 'error',
          duration: 3000
        })
      }
    },
    async handleAllExportCard() {
      const data = {
        patrol_name: this.search.patrol_name,
        patrol_rate: this.search.patrol_rate
      }
      const url = await exportAllCard(data.patrol_name, data.patrol_rate)
      window.open(url)
    },
    handleChangeScl() {
      for (const item of this.risk_list) {
        if (item.sr_id === this.form.sr_id) {
          this.form.patrol_name = item.scl_risk_name
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  .draw_dialog {
    .step_border,
    .step_border_no_att {
      background: #f0f5fa;
    }
  }
}
</style>
<style lang="scss">
.patrol_draw_dialog {
  .el-range-editor--medium .el-range-separator {
    line-height: 24px;
  }
}
</style>
