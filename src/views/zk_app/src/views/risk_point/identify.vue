<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="风险点名称：">
            <el-input v-model="search.risk_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="风险点编号：">
            <el-input v-model="search.risk_no" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="queryData()">搜索</span>
          <span class="spp-btn" @click="resetData()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A15001')"
          class="spp-btn spp-btn-primary"
          @click="showDialog = true"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A15003')" class="spp-btn" @click="batchDelete">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="multipleTable" :data="risk_list">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="风险点名称" prop="risk_name" />
        <el-table-column label="风险点编号" prop="risk_no" />
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A15006')" type="text" @click="viewDetail(scope.row.risk_id)">详情</el-button>
            <el-button type="text" @click.native="open_related_video(scope.row.risk_id)">相关视频</el-button>
            <el-button v-if="functionList.includes('A15002')" type="text" @click.native="openDialog(scope.row.risk_id)">编辑</el-button>
            <el-button v-if="functionList.includes('A15003')" type="text" @click.native="deleteItem(scope.row.risk_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.page_num"
        :limit.sync="search.page_size"
        @pagination="handleCurrentChange"
      />
    </div>

    <!-- 详情 -->
    <el-dialog
      v-if="dialogVisible"
      title="风险点详情"
      :visible.sync="dialogVisible"
      width="720px"
      class="right-all-content riskidentify-detail-content"
    >
      <div class="common-item">
        <span class="title">风险名称：</span>
        <span class="content">{{ riskDetailObj.risk_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险编号：</span>
        <span class="content">{{ riskDetailObj.risk_no }}</span>
      </div>
      <div class="common-item">
        <span class="title">项目潜在风险点：</span>
        <span class="content" v-html="riskDetailObj.potential_risk" />
      </div>
      <div class="common-item">
        <span class="title">可能导致后果：</span>
        <span class="content" v-html="riskDetailObj.risk_result" />
      </div>
      <div class="common-item">
        <span class="title">管控措施：</span>
        <span class="content" v-html="riskDetailObj.control_measure" />
      </div>
      <div class="common-item">
        <span class="title">应急措施：</span>
        <span class="content" v-html="riskDetailObj.emergency_measure" />
      </div>
    </el-dialog>
    <!-- 新增/编辑 -->
    <el-drawer
      v-if="showDialog"
      :title="editType.title"
      :visible.sync="showDialog"
      :wrapper-closable="false"
      class="spp-drawer right-noall-content"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="125px" class="demo-ruleForm">
        <el-form-item label="风险名称" prop="risk_name">
          <el-input v-model="ruleForm.risk_name" placeholder="请输入风险名称" />
        </el-form-item>
        <template v-if="editType.id === ''">
          <el-form-item label="风险等级" prop="risk_rank">
            <el-select v-model="ruleForm.risk_rank" style="width: 100%" placeholder="请选择风险等级">
              <el-option
                v-for="(item, index) in rank_list"
                :key="index"
                :label="item.title"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="风险等级">
            <span style="color: #333333">{{ ruleForm.risk_rank == 1 ? 'Ⅰ级' : ruleForm.risk_rank == 2 ? 'Ⅱ级' : ruleForm.risk_rank == 3 ? 'Ⅲ级' : ruleForm.risk_rank == 4 ? 'Ⅳ级' : '' }}</span>
          </el-form-item>
        </template>
        <el-form-item label="应急处置信息">
          <el-select v-model="ruleForm.measure_id" style="width: 100%" filterable placeholder="请选择应急处置信息" @change="handleTabMeasure()">
            <el-option
              v-for="(item, index) in emergency_list"
              :key="index"
              :label="item.measures_title"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目潜在风险点" prop="potential_risk">
          <el-input
            v-model="ruleForm.potential_risk"
            type="textarea"
            :rows="6"
            placeholder="请输入项目潜在风险点"
          />
        </el-form-item>
        <el-form-item label="可能导致后果" prop="risk_result">
          <el-input
            v-model="ruleForm.risk_result"
            type="textarea"
            :rows="6"
            placeholder="请输入可能导致后果"
          />
        </el-form-item>
        <el-form-item label="管控措施" prop="control_measure">
          <el-input
            v-model="ruleForm.control_measure"
            type="textarea"
            :rows="6"
            placeholder="请输入管控措施"
          />
        </el-form-item>
        <el-form-item label="应急措施" prop="emergency_measure">
          <el-input
            v-model="ruleForm.emergency_measure"
            type="textarea"
            :rows="6"
            placeholder="请输入应急措施"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-btn riskidentify-btn">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="editSubmit()">提交</span>
      </div>
    </el-drawer>
    <!-- 查看二维码 -->
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[pic_url]"
    />
    <!-- 风险公告卡图片导出 -->
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
              <div class="line_title">风险因素行高：</div>
              <el-slider v-model="picture.potential_risk_line_height" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="item_line">
              <div class="line_title">管控措施行高：</div>
              <el-slider v-model="picture.risk_measure_control_line_height" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="item_line">
              <div class="line_title">应急措施行高：</div>
              <el-slider v-model="picture.risk_emergency_line_height" style="width: 200px" :min="0" :max="100" />
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
    <!-- 应急处置卡图片导出 -->
    <el-dialog
      :title="picture_title"
      :visible.sync="showEmergencyExport"
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
              <el-slider v-model="emergency.font_size" style="width: 200px" :min="0" :max="100" />
            </div>
            <div v-for="(item, index) in emergency.risk_result_list" :key="index" class="item_line">
              <div class="line_title">{{ item[`risk_result_${index}_name`] }}：</div>
              <el-slider v-model="item[`risk_result_${index}`]" style="width: 200px" :min="0" :max="100" />
            </div>
            <div class="float_btn">
              <el-button @click="showEmergencyExport = false">取消</el-button>
              <el-button type="primary" :disabled="loading" @click="handleGetEmergency()">确定</el-button>
              <el-button type="primary" :disabled="loading" @click="handleDownEmergency()">下载</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 相关视频 -->
    <el-drawer
      v-if="related_video"
      title="相关视频"
      :visible.sync="related_video"
      class="spp-drawer related_video_drawer"
      :wrapper-closable="false"
    >
      <div class="related_video_list">
        <div
          v-for="(item, index) in video_list"
          :key="index"
          class="related_video_item"
        >
          <div class="related_video_item_title">
            <div>
              <span>视频名称：</span>
              <span>{{ item.video_name }}</span>
            </div>
            <div class="right">
              <img
                src="../../assets/images/facilities_video_edit.png"
                alt=""
                class="facilities_video_icon"
                @click="openVideoDialog(item)"
              >
              <img
                src="../../assets/images/facilities_video_delete.png"
                alt=""
                class="facilities_video_icon"
                @click="deleteVideo(item.fv_id)"
              >
            </div>
          </div>
          <div>
            <span>视频链接：</span>
            <a
              :href="
                'https://wx.zm-teach.com/spp_tools/index.php/index/Web/video?id=' +
                  sf_id +
                  '&index=' +
                  index
              "
              target="_blank"
              class="video_url_text"
            >{{ item.video_url }}</a>
          </div>
        </div>
      </div>
      <div class="spp-add-btn" @click="openVideoDialog">添加视频</div>
      <!-- 新增视频 -->
      <el-drawer
        :title="editVideoTitle"
        :append-to-body="true"
        :visible.sync="editVideoDialog"
        class="spp-child-drawer right-noall-content"
        :wrapper-closable="false"
      >
        <el-form
          v-if="editVideoDialog"
          ref="ruleVideoForm"
          :model="ruleVideoForm"
          :rules="videoFormRules"
          label-width="100px"
        >
          <el-form-item label="视频名称" prop="video_name">
            <el-input
              v-model="ruleVideoForm.video_name"
              placeholder="请输入视频名称"
            />
          </el-form-item>
          <el-form-item label="视频链接" prop="video_url">
            <el-input
              v-model="ruleVideoForm.video_url"
              placeholder="请输入视频链接"
            />
          </el-form-item>
        </el-form>
        <div class="dialog-btn riskcontrol-btn">
          <span class="spp-btn" @click="editVideoDialog = false">取消</span>
          <span class="spp-btn spp-btn-primary" @click="addVideo">确定</span>
        </div>
      </el-drawer>
    </el-drawer>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {
  identifyPaginate,
  saveRisk,
  updateRisk,
  deleteRisk,
  gainRiskDetail,
  gainModelList,
  getThumbnail,
  getEmergencyThumbnail,
  emergencyList
} from '@/api/risk_point'
import { mapGetters } from 'vuex'
import { getToken, getAppId, nowTime, getSign } from '@/utils/auth'
import axios from 'axios'
import { deleteFacilityFv, getFacilityFvList, saveFacilityFv, updateFacilityFv } from '@/api/facilities_manage'
export default {
  name: 'Riskidentify',
  components: { Pagination, ElImageViewer },
  data() {
    return {
      height: window.innerHeight - 90,
      search: {
        risk_name: '',
        risk_no: '',
        page_num: 1,
        page_size: 10
      },
      risk_list: [],
      riskDetailObj: {},
      detail: {},
      selected_id: '',
      report_list: '',
      report_page: 1,
      report_page_size: 10,
      report_total: 0,
      daterange: null,
      total: 0,
      pic_url: '',
      showViewer: false, // 图片查看框
      showDialog: false, // 新增或编辑模态框
      dialogVisible: false, // 详情模态框
      showReportDialog: false,
      showImgExport: false,
      showEmergencyExport: false,
      showImgViewer: false,
      picture_title: '',
      picture: {
        risk_id: '',
        font_size: 0,
        potential_risk_line_height: 0,
        risk_emergency_line_height: 0,
        risk_measure_control_line_height: 0,
        pre_img_url: ''
      }, // 风险公告卡
      emergency: {
        risk_id: '',
        font_size: 0,
        risk_result_list: [],
        pre_img_url: ''
      }, // 应急处置卡
      picture_img: '',
      loading: true,
      modelList: [], // 模型列表
      editType: {
        id: '',
        title: '新增风险点',
        type: 'add'
      },
      ruleFormInit: {}, // 表单原数据
      ruleForm: {
        risk_name: '',
        measure_id: '',
        measure_ids: [],
        risk_rank: '', // 风险等级
        potential_risk: '', // 项目潜在风险点
        risk_result: '', // 可能导致后果
        control_measure: '', // 风险依据
        emergency_measure: '' // 风险依据
      },
      before_emergency_id: '',
      before_emergency: false, // 改变
      rules: {
        risk_name: [
          { required: true, message: '请输入风险名称', trigger: 'blur' }
        ],
        risk_rank: [
          { required: true, message: '请选择风险等级', trigger: 'blur' }
        ],
        potential_risk: [
          { required: true, message: '请输入项目潜在风险点', trigger: 'blur' }
        ],
        risk_result: [
          { required: true, message: '请输入可能导致后果', trigger: 'blur' }
        ],
        risk_according: [
          { required: true, message: '请输入风险依据', trigger: 'blur' }
        ],
        control_measure: [
          { required: true, message: '请输入管控措施', trigger: 'blur' }
        ],
        emergency_measure: [
          { required: true, message: '请输入应急措施', trigger: 'blur' }
        ]
      },
      down_url: process.env.VUE_APP_BASE_API,
      down_name: '',
      video_list: [],
      sf_id: '',
      related_video: false,
      ruleVideoForm: {
        video_name: '',
        video_url: ''
      },
      videoFormRules: {
        video_name: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        video_url: [
          { required: true, message: '请输入视频链接', trigger: 'blur' }
        ]
      },
      editVideoTitle: '',
      editVideoDialog: false,
      emergency_list: [],
      rank_list: [{
        title: 'Ⅰ级',
        type: 1
      }, {
        title: 'Ⅱ级',
        type: 2
      }, {
        title: 'Ⅲ级',
        type: 3
      }, {
        title: 'Ⅳ级',
        type: 4
      }]
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.editType.title = this.editType.type === 'add' ? '新增风险点' : '编辑风险点'
        this.getModelList()
      }
      if (!val) {
        this.editType.id = ''
        this.editType.type = 'add'
        this.ruleFormInit = {}
        this.before_emergency = false
        Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
        this.$refs['ruleForm'].clearValidate()
      }
    },
    showImgExport(val) {
      if (!val) {
        this.picture_img = ''
        this.loading = true
        this.picture_title = ''
        this.down_name = ''
        Object.assign(this.$data.picture, this.$options.data().picture)
      }
    },
    showEmergencyExport(val) {
      if (!val) {
        this.picture_img = ''
        this.loading = true
        this.picture_title = ''
        this.down_name = ''
        Object.assign(this.$data.emergency, this.$options.data().emergency)
      }
    }
  },
  created() {
    this.queryData()
    this.emergencyList()
  },
  methods: {
    emergencyList() {
      emergencyList().then((res) => {
        this.emergency_list = res.data || []
      })
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    resetData() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    fetchData() {
      identifyPaginate(this.search).then((res) => {
        this.risk_list = res.data.list
        this.total = res.data.totalRow
      })
    },
    viewDetail(risk_id) {
      gainRiskDetail(risk_id).then(res => {
        this.riskDetailObj = res.data
        if (this.riskDetailObj.potential_risk && this.isJSON(this.riskDetailObj.potential_risk)) {
          this.riskDetailObj.potential_risk = JSON.parse(this.riskDetailObj.potential_risk).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_result && this.isJSON(this.riskDetailObj.risk_result)) {
          this.riskDetailObj.risk_result = JSON.parse(this.riskDetailObj.risk_result).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.control_measure && this.isJSON(this.riskDetailObj.control_measure)) {
          this.riskDetailObj.control_measure = JSON.parse(this.riskDetailObj.control_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.emergency_measure && this.isJSON(this.riskDetailObj.emergency_measure)) {
          this.riskDetailObj.emergency_measure = JSON.parse(this.riskDetailObj.emergency_measure).replace(/\n/g, '<br>')
        }
        this.dialogVisible = true
      })
    },
    batchDelete() {
      let str = ''
      this.$refs.multipleTable.store.states.selection.forEach(item => {
        str += item.risk_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },
    deleteItem(Id) {
      this.$confirm('您确定要删除该风险点吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRisk(Id).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.fetchData()
          })
        })
    },
    openDialog(id) {
      this.editType.id = id
      gainRiskDetail(id).then((res) => {
        const data = res.data
        const that = this
        const arr = data.measure_id ? data.measure_id.split(',') || [] : []
        let has = false
        for (var vv in that.emergency_list) {
          for (var kk of that.emergency_list[vv].children) {
            if (kk.measure_id === arr[0]) {
              that.ruleForm.measure_id = Number(vv)
              has = true
              break
            } else {
              that.ruleForm.measure_id = ''
            }
          }
          if (has) {
            break
          }
        }
        this.ruleForm.measure_ids = []
        if (data.measure_id) {
          this.emergency_list[this.ruleForm.measure_id].children.map((item) => {
            this.ruleForm.measure_ids.push(item.measure_id)
          })
        }
        this.before_emergency_id = data.measure_id
        this.ruleForm.risk_name = data.risk_name
        this.ruleForm.risk_rank = data.risk_rank
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
        if (data.emergency_measure && this.isJSON(data.emergency_measure)) {
          this.ruleForm.emergency_measure = JSON.parse(data.emergency_measure)
        } else {
          this.ruleForm.emergency_measure = data.emergency_measure
        }
        this.editType.type = 'edit'
        this.showDialog = true
      })
    },
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            measure_id: this.ruleForm.measure_ids.join(','),
            risk_name: this.ruleForm.risk_name,
            potential_risk: JSON.stringify(this.ruleForm.potential_risk),
            risk_result: JSON.stringify(this.ruleForm.risk_result),
            control_measure: JSON.stringify(this.ruleForm.control_measure),
            emergency_measure: JSON.stringify(this.ruleForm.emergency_measure)
          }
          let api = ''
          if (this.editType.type === 'add') {
            data.risk_rank = this.ruleForm.risk_rank
            api = saveRisk
          } else {
            api = updateRisk
            data.id = this.editType.id
            if (this.before_emergency) {
              data.before_emergency_id = this.before_emergency_id
            } else {
              data.before_emergency_id = null
            }
          }
          api(data).then((res) => {
            this.showDialog = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.fetchData()
          })
        } else {
          return false
        }
      })
    },
    getModelList() {
      gainModelList().then(res => {
        this.modelList = res.data
      })
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
      })
    },
    handleGetEmergency() {
      this.loading = true
      this.picture_img = ''
      const risk_result_param = JSON.stringify(this.emergency)
      getEmergencyThumbnail(risk_result_param).then((res) => {
        if (this.emergency.pre_img_url === '') {
          this.emergency.pre_img_url = res.data.img_url
        } else {
          this.emergency.pre_img_url = this.picture_img
        }
        this.picture_img = res.data.img_url
        const img = JSON.parse(JSON.stringify(this.picture_img))
        const arr = img.replace(/\\/g, '/').split('/')
        this.down_name = arr[arr.length - 1] || ''
        this.loading = false
      })
    },
    handleDownEmergency() {
      const data = {
        pre_img_url: this.emergency.pre_img_url,
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
      })
    },
    handleDownLoad(data) {
      const objectUrl = window.URL.createObjectURL(new Blob([data]))
      const elink = document.createElement('a')
      elink.download = this.down_name || this.picture_title + '.jpg' || '公告卡.jpg' // 下载文件名称,
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
    open_related_video(sf_id) {
      this.video_list = []
      this.sf_id = sf_id
      getFacilityFvList(sf_id).then((res) => {
        this.video_list = res.data
        this.related_video = true
      })
    },
    getFacilityFvList() {
      getFacilityFvList(this.sf_id).then((res) => {
        this.video_list = res.data
        this.related_video = true
      })
    },
    openVideoDialog(item) {
      Object.assign(
        this.$data.ruleVideoForm,
        this.$options.data().ruleVideoForm
      )
      !item.fv_id
        ? (this.editVideoTitle = '新增视频')
        : (this.editVideoTitle = '编辑视频')
      if (item.fv_id) {
        this.ruleVideoForm = JSON.parse(JSON.stringify(item))
      }
      this.fv_id = item.fv_id
      this.editVideoDialog = true
    },
    deleteVideo(fv_id) {
      this.$confirm('您确定要删除该视频吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFacilityFv(fv_id).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getFacilityFvList()
        })
      }).catch(() => {})
    },
    addVideo() {
      this.$refs.ruleVideoForm.validate((valid) => {
        if (valid) {
          const { video_name, video_url } = this.ruleVideoForm
          if (!this.fv_id) {
            saveFacilityFv(this.sf_id, video_name, video_url).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getFacilityFvList()
              this.editVideoDialog = false
            })
          } else {
            updateFacilityFv(this.fv_id, video_name, video_url).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getFacilityFvList()
              this.editVideoDialog = false
            })
          }
        } else {
          return false
        }
      })
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
    },
    handleTabMeasure() {
      if (this.editType.type === 'edit') {
        this.before_emergency = true
      }
      this.ruleForm.measure_ids = []
      this.emergency_list[this.ruleForm.measure_id].children.map((item) => {
        this.ruleForm.measure_ids.push(item.measure_id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.riskidentify-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebf0f5;
  }
}
.riskidentify-crumbs {
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
.riskidentify-btn {
  text-align: right;
}
.riskidentify-detail-content {
  .common-item {
    .title {
      width: 117px;
    }
  }
}

::v-deep .el-table__expanded-cell {
  padding: 0 !important;
  border-bottom: none !important;
}
.no-data-list {
  width: 100%;
  height: 80px;
  text-align: center;
  line-height: 80px;
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
        width: 150px;
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

.related_video_drawer {
  .el-drawer__body {
    margin-bottom: 0;
  }
}

.related_video_list {
  .related_video_item {
    background: #f5faff;
    border: 1px solid #e1e3e6;
    color: #313233;
    margin-bottom: 20px;
    padding: 10px;
    word-break: break-all;
  }
  .related_video_item_title {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .facilities_video_icon {
      width: 16px;
      height: 16px;
      cursor: pointer;
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
  .video_url_text {
    text-decoration: underline;
    color: #3399ff;
  }
}
.riskcontrol-btn {
  text-align: right;
  .spp-btn {
    margin-left: 0;
    margin-right: 20px;
  }
}
.spp-child-drawer {
  .riskcontrol-btn {
    position: absolute;
    height: 50px;
    line-height: 50px;
    bottom: 0;
    left: 0;
    width: calc(100% - 50px);
    border-top: 1px solid #d3d7db;
  }
}

::v-deep .el-image-viewer__wrapper {
  z-index: 9999 !important;
}
</style>
