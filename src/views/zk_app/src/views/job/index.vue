<template>
  <div class="app-container emergency-group right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="岗位名称：">
            <el-input v-model="search.job_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="风险等级：">
            <el-select v-model="search.risk_rank" clearable placeholder="请选择">
              <el-option v-for="(item, k) in risk_rank" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A31002')" class="spp-btn spp-btn-primary" @click="addJob">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A31004')" class="spp-btn" @click="batchDelete">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="岗位名称" prop="job_name" />
        <el-table-column label="所属部门" prop="department_name" />
        <el-table-column label="责任部门" prop="response_department_name" />
        <el-table-column label="风险等级" prop="risk_rank">
          <template slot-scope="scope">
            <span v-show="scope.row.risk_rank === '1'" class="risk_label big_risk">重大风险</span>
            <span v-show="scope.row.risk_rank === '2'" class="risk_label middle_risk">较大风险</span>
            <span v-show="scope.row.risk_rank === '3'" class="risk_label small_risk">一般风险</span>
            <span v-show="scope.row.risk_rank === '4'" class="risk_label micro_risk">低风险</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column prop="address" label="操作" width="210">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A31003')" type="text" @click="editJob(scope.row.id)">编辑</el-button>
            <el-button v-if="functionList.includes('A31004')" type="text" @click="delJob(scope.row.id)">删除</el-button>
            <el-button v-if="functionList.includes('A31007')" type="text" @click.native="handleExportImg(scope.row)">生成知会卡</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      v-if="showDialog"
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
          <el-form-item label="岗位名称" prop="job_name">
            <el-input v-model="ruleForm.job_name" placeholder="请输入岗位名称" />
          </el-form-item>
          <el-form-item label="风险点" prop="risk_id">
            <el-select v-model="ruleForm.risk_id" style="width: 100%" filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in type_list"
                :key="index"
                :label="item.risk_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="department_id">
            <el-cascader
              v-model="ruleForm.department_id"
              style="width: 100%"
              :options="options"
              clearable
              placeholder="请选择所属部门"
              @change="handleChangeDep"
            />
          </el-form-item>
          <el-form-item label="责任部门" prop="response_department_id">
            <el-cascader
              v-model="ruleForm.response_department_id"
              style="width: 100%"
              :options="options"
              clearable
              placeholder="请选择责任部门"
              @change="handleChangeRsp"
            />
          </el-form-item>
          <el-form-item label="风险等级" prop="risk_rank">
            <el-select v-model="ruleForm.risk_rank" style="width: 100%" clearable placeholder="请选择风险等级">
              <el-option v-for="(item, k) in risk_rank" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" :rows="4" placeholder="请输入岗位备注" />
          </el-form-item>
          <el-form-item label="危险因素" prop="potential_risk">
            <el-input v-model="ruleForm.potential_risk" type="textarea" :rows="4" placeholder="请输入危险因素" />
          </el-form-item>
          <el-form-item label="导致后果" prop="risk_result">
            <el-input v-model="ruleForm.risk_result" type="textarea" :rows="4" placeholder="请输入导致后果" />
          </el-form-item>
          <el-form-item label="管控措施" prop="control_measure">
            <el-input v-model="ruleForm.control_measure" type="textarea" :rows="4" placeholder="请输入管控措施" />
          </el-form-item>
          <el-form-item label="应急电话" prop="emergency_contact">
            <el-input v-model="ruleForm.emergency_contact" type="textarea" :rows="4" placeholder="请输入应急电话" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
    <!-- 图片导出 -->
    <el-dialog
      :title="picture_title"
      :visible.sync="showImgExport"
      :close-on-click-modal="false"
      width="1000px"
      class="draw_dialog picture_dialog"
    >
      <el-row class="img_content">
        <el-col :span="12" style="border-right: 1px solid #ebf0f5">
          <div class="img_title">图片预览</div>
          <template v-if="picture_img === ''">
            <div v-loading="loading" element-loading-text="图片生成中..." class="left_image" />
          </template>
          <template v-else>
            <img class="left_image" :src="down_url + '/' + picture_img" @click="showImgViewer = true">
          </template>
        </el-col>
        <el-col :span="12">
          <div class="right_item">
            <div class="img_title">图片调整</div>
            <div class="item_line">
              <div class="line_title">字体大小：</div>
              <el-slider v-model="picture.font_size" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="item_line">
              <div class="line_title">危险因素行高：</div>
              <el-slider v-model="picture.potential_risk_line_height" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="item_line">
              <div class="line_title">导致后果行高：</div>
              <el-slider v-model="picture.risk_result_line_height" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="item_line">
              <div class="line_title">管控措施行高：</div>
              <el-slider v-model="picture.control_measure_line_height" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="float_btn">
              <el-button @click="showImgExport = false">取消</el-button>
              <el-button type="primary" :disabled="loading" @click="handleGetThumbnail()">确定</el-button>
              <el-button type="primary" :disabled="loading" @click="handleDownImg()">下载</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <el-image-viewer
      v-if="showImgViewer"
      :on-close="closeImgViewer"
      :url-list="[down_url + '/' + picture_img]"
    />
  </div>
</template>

<script>
import {
  getJobList,
  addJob,
  editJob,
  getJob,
  deleteJob,
  exportCard,
  basisType,
  cardPre,
  exportRiskCard,
  emerPre,
  exportEmerCard,
  getImgCus,
  getThumbnail
} from '@/api/job'
import { getSclDeptList } from '@/api/school_dept'
import { formatDateTime, formatDeptTree } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import axios from 'axios'
import { getAppId, getSign, getToken, nowTime } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'Job',
  components: { Pagination, ElImageViewer },
  data() {
    return {
      height: window.innerHeight - 135,
      search: {
        job_name: '',
        risk_rank: ''
      },
      data: [],
      total: 0,
      page: 1,
      page_size: 10,
      showDialog: false,
      dialogTitle: '',
      risk_rank: {
        1: '重大风险',
        2: '较大风险',
        3: '一般风险',
        4: '低风险'
      },
      options: [],
      type_list: [],
      showImgExport: false,
      showImgViewer: false,
      picture_title: '',
      picture: {
        id: '',
        font_size: 0,
        potential_risk_line_height: 0,
        risk_result_line_height: 0,
        control_measure_line_height: 0,
        pre_img_url: ''
      },
      picture_img: '',
      loading: true,
      ruleForm: {
        id: '',
        job_name: '',
        department_id: '',
        response_department_id: '',
        risk_rank: '',
        remark: '',
        potential_risk: '',
        risk_result: '',
        control_measure: '',
        emergency_contact: '',
        risk_id: ''
      },
      rules: {
        job_name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        risk_id: [
          { required: true, message: '请选择风险点', trigger: 'blur' }
        ],
        risk_rank: [
          { required: true, message: '请选择风险等级', trigger: 'blur' }
        ],
        potential_risk: [
          { required: true, message: '请输入危险因素', trigger: 'blur' }
        ],
        risk_result: [
          { required: true, message: '请输入导致后果', trigger: 'blur' }
        ],
        control_measure: [
          { required: true, message: '请输入管控措施', trigger: 'blur' }
        ]
      },
      down_url: process.env.VUE_APP_BASE_API,
      down_name: ''
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getData()
    this.getSclDeptList()
  },
  methods: {
    handlePreview(id, type) {
      if (type === 1) {
        cardPre(id).then((res) => {
          this.exportRisk(id)
        })
      } else {
        emerPre(id).then((res) => {
          this.exportEmer(id)
        })
      }
    },
    async exportRisk(id) {
      const url = await exportRiskCard(id)
      window.open(url)
    },
    async exportEmer(id) {
      const url = await exportEmerCard(id)
      window.open(url)
    },
    // 生成知会卡
    async exportword(id) {
      const url = await exportCard(id)
      window.open(url)
    },
    formatDateTime: formatDateTime,
    getSclDeptList() {
      getSclDeptList().then(response => {
        const data = response.data
        const dept_data = formatDeptTree(data, '0')
        // 组装部门和用户
        this.options = dept_data
      })
    },
    handleChangeDep(value) {
      if (value) {
        this.ruleForm.department_id = value[value.length - 1]
      }
    },
    handleChangeRsp(value) {
      if (value) {
        this.ruleForm.response_department_id = value[value.length - 1]
      }
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    // 获取列表数据
    getData() {
      getJobList(this.search.job_name, this.search.risk_rank, this.page, this.page_size).then(res => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    // 新增或编辑应急小组
    addJob() {
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.dialogTitle = '新增岗位'
      this.getBasisType()
      this.showDialog = true
    },
    editJob(id) {
      getJob(id).then(res => {
        const data = res.data
        this.ruleForm.id = data.id
        this.ruleForm.job_name = data.job_name
        this.ruleForm.department_id = data.department_id
        this.ruleForm.response_department_id = data.response_department_id
        this.ruleForm.risk_rank = data.risk_rank
        this.ruleForm.remark = data.remark
        this.ruleForm.emergency_contact = data.emergency_contact
        this.ruleForm.risk_id = data.risk_id
        if (data.potential_risk && this.isJSON(data.potential_risk)) {
          this.ruleForm.potential_risk = JSON.parse(data.potential_risk)
        } else {
          this.ruleForm.potential_risk = data.potential_risk
        }
        if (data.risk_result && this.isJSON(data.risk_result)) {
          this.ruleForm.risk_result = JSON.parse(data.risk_result)
        } else {
          this.ruleForm.risk_result = data.risk_result
        }
        if (data.control_measure && this.isJSON(data.control_measure)) {
          this.ruleForm.control_measure = JSON.parse(data.control_measure)
        } else {
          this.ruleForm.control_measure = data.control_measure
        }
        this.dialogTitle = '修改岗位'
        this.getBasisType()
        this.showDialog = true
      })
    },
    // 删除岗位
    delJob(id) {
      this.$confirm('您确定要删除该岗位吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteJob(id).then(res => {
            this.$message({
              message: '岗位删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    // 提交新增数据
    editSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (!this.ruleForm.id) {
            await addJob(this.ruleForm)
          } else {
            await editJob(this.ruleForm.id, this.ruleForm)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3000
          })
          this.showDialog = false
          this.getData()
        }
      })
    },
    batchDelete() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.delJob(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },
    getBasisType() {
      basisType().then((res) => {
        this.type_list = res.data || []
      })
    },
    handleExportImg(data) {
      if (data.id) {
        this.picture_title = data.building_name ? data.building_name + '岗位知会卡' : '岗位知会卡'
        this.picture.id = data.id
        getImgCus(data.id).then((res) => {
          const data = res.data
          this.picture.font_size = Number(data.font_size)
          this.picture.potential_risk_line_height = Number(data.potential_risk_line_height)
          this.picture.risk_result_line_height = Number(data.risk_result_line_height)
          this.picture.control_measure_line_height = Number(data.control_measure_line_height)
          this.picture.pre_img_url = ''
          this.handleGetThumbnail()
          this.showImgExport = true
        })
      } else {
        this.$message({
          message: '请先关联风险点',
          type: 'error',
          duration: 3000
        })
      }
    },
    handleGetThumbnail() {
      this.loading = true
      this.picture_img = ''
      getThumbnail(this.picture).then((res) => {
        if (this.picture.pre_img_url === '') {
          this.picture.pre_img_url = res.data.img_url
        } else {
          this.picture.pre_img_url = this.picture_img
        }
        this.picture_img = res.data.img_url
        const img = JSON.parse(JSON.stringify(this.picture_img))
        const arr = img.replace(/\\/g, '/').split('/')
        this.down_name = arr[arr.length - 1] || ''
        this.loading = false
      })
    },
    handleDownImg() {
      const data = {
        pre_img_url: this.picture.pre_img_url,
        img_url: this.picture_img
      }
      const url = process.env.VUE_APP_BASE_API + '/api/dd/riskpoint/info/notice/download'
      axios({
        method: 'post',
        responseType: 'blob',
        url: url,
        data,
        transformRequest: [
          function(data) {
            data['app_id'] = getAppId()
            data['timestamp'] = nowTime()
            data['token'] = getToken()
            data['sign'] = getSign(data)
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substr(0, ret.length - 1)
            return ret
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(({ data }) => {
        this.handleDownLoad(data)
        this.showImgExport = false
      })
    },
    handleDownLoad(data) {
      const objectUrl = window.URL.createObjectURL(new Blob([data]))
      const elink = document.createElement('a')
      elink.download = this.down_name || this.picture_title + '.jpg' || '知会卡' + '.jpg' // 下载文件名称,
      elink.style.display = 'none'
      elink.href = objectUrl
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
      window.URL.revokeObjectURL(elink.href)
    },
    closeImgViewer() {
      this.showImgViewer = false
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          const obj = JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.word-content {
  padding: 10px;
  display: flex;
  justify-content: center;

  .word {
    width: 730px;
    height: auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: #ffffff;
    overflow-y: auto;

    ::v-deep .docx-wrapper {
      background: none;
      padding: 0;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    ::v-deep .docx {
      position: relative;
      background: none;
      box-shadow: none;
      width: 100% !important;
      padding: 0 !important;
    }

    ::v-deep table {
      position: relative !important;
    }

    ::v-deep .docx_first-col:first-of-type {
      margin: 150px auto 50px !important;
    }

    ::v-deep img {
      width: 696px !important;
    }

    ::v-deep .docx table td {
      vertical-align: center !important;
    }
  }

  .word::-webkit-scrollbar {
    display: none;
  }
}

::v-deep .picture_dialog .el-dialog {
  height: 750px;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
::v-deep .picture_dialog .el-dialog .el-dialog__body {
  padding-right: 40px !important;
}

.img_content {
  width: 100%;
  height: 652px;

  .img_title {
    width: 100%;
    font-size: 18px;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }

  .left_image {
    width: 100%;
    height: 620px;
    cursor: pointer;
  }

  .right_item {
    position: relative;
    height: 652px;
    padding: 10px 10px 10px 30px;

    .item_line {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .line_title {
        width: 120px;
        font-size: 16px;
        color: #4c515f;
        margin-right: 20px;
      }
    }

    .float_btn {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

::v-deep .el-image-viewer__wrapper {
  z-index: 9999 !important;
}
</style>
