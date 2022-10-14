<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="风险点名称：">
            <el-input v-model="search.scl_risk_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="风险点编号：">
            <el-input v-model="search.risk_no" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="NFC码：">
            <el-input v-model="search.nfc_code" placeholder="请输入" />
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
          v-if="functionList.includes('A60003')"
          class="spp-btn spp-btn-primary"
          @click="showDialog = true"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <!--<span v-if="functionList.includes('A15003')" class="spp-btn" @click="batchDelete">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>-->
      </div>
    </div>
    <div class="main-body">
      <el-table ref="multipleTable" :data="risk_list">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="风险点名称" prop="scl_risk_name" />
        <el-table-column label="风险点编号" prop="risk_no" />
        <el-table-column label="NFC码">
          <template slot-scope="scope">
            {{ scope.row.nfc_code }}
            <el-button
              v-if="!scope.row.nfc_code && functionList.includes('A23006')"
              type="text"
              @click="bindNFC(scope.row.sr_id, 1)"
            >绑定</el-button>
            <el-button
              v-if="scope.row.nfc_code && functionList.includes('A23006')"
              type="text"
              @click="bindNFC(scope.row.sr_id, 2)"
            >解绑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="二维码">
          <template slot-scope="scope">
            <el-button
              v-if="functionList.includes('A23006')"
              type="text"
              @click="seeCode(scope.row.sr_id)"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="巡检频率" prop="dic_name" />
        <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="user_name" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <!--<el-button
              v-if="functionList.includes('A15006')"
              type="text"
              @click="viewDetail(scope.row.risk_id)"
            >详情</el-button>-->
            <el-button v-if="functionList.includes('A15002')" type="text" @click.native="openDialog(scope.row.sr_id)">编辑</el-button>
            <el-button v-if="functionList.includes('A15003')" type="text" @click.native="deleteItem(scope.row.sr_id)">删除</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleInspectionCode(scope.row)">巡检码</el-dropdown-item>
                  <el-dropdown-item @click.native="showReport(scope.row.risk_id)">排查报告</el-dropdown-item>
                  <el-dropdown-item @click.native="handleExportImg(scope.row)">生成风险公告卡</el-dropdown-item>
                  <el-dropdown-item @click.native="handleEmergencyImg(scope.row)">生成应急处置卡</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
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
        <span class="title">nfc码：</span>
        <span class="content">{{ riskDetailObj.nfc_code }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险类型：</span>
        <span class="content">{{ riskDetailObj.risk_category_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">项目潜在风险点：</span>
        <span
          class="content"
          v-html="riskDetailObj.potential_risk?riskDetailObj.potential_risk.replace(/\n/g,'<br>'):''"
        />
      </div>
      <div class="common-item">
        <span class="title">可能导致后果：</span>
        <span
          class="content"
          v-html="riskDetailObj.risk_result?riskDetailObj.risk_result.replace(/\n/g,'<br>'):''"
        />
      </div>
      <div class="common-item">
        <span class="title">风险依据：</span>
        <span
          class="content"
          v-html="riskDetailObj.risk_according?riskDetailObj.risk_according.replace(/\n/g,'<br>'):''"
        />
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
        <el-form-item label="关联风险点" prop="risk_id">
          <el-select
            v-model="ruleForm.risk_id"
            style="width: 100%"
            clearable
            filterable
            placeholder="请选择关联风险点"
            @change="handleSelectCategory"
          >
            <el-option
              v-for="(item, index) in categories_list"
              :key="index"
              :label="item.risk_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="nfc码">
          <el-input v-model="ruleForm.nfc_code" placeholder="请输入nfc码" />
        </el-form-item>
        <el-form-item label="巡检频率">
          <el-select v-model="ruleForm.patrol_rate" style="width: 100%" clearable placeholder="请选择巡检频率">
            <el-option v-for="(item, key, index) in patrol_rate" :key="index" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检负责人">
          <el-select v-model="ruleForm.patrol_man_id" style="width: 100%" filterable clearable placeholder="请选择巡检负责人">
            <el-option v-for="(item, index) in patrol_man" :key="index" :label="item.user_name" :value="item.user_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检二维码数量">
          <el-input v-model="ruleForm.patrol_qrcode_num" :min="0" type="number" placeholder="请输入巡检二维码数量" />
        </el-form-item>
        <el-form-item label="风险公告卡数量">
          <el-input v-model="ruleForm.risk_notice_num" :min="0" type="number" placeholder="请输入风险公告卡数量" />
        </el-form-item>
        <el-form-item label="应急处置卡数量">
          <el-input v-model="ruleForm.emergency_handle_num" :min="0" type="number" placeholder="请输入应急处置卡数量" />
        </el-form-item>
        <el-form-item label="岗位知会卡数量">
          <el-input v-model="ruleForm.post_notify_num" :min="0" type="number" placeholder="请输入岗位知会卡数量" />
        </el-form-item>
        <el-form-item label="公示栏大板：">
          <el-radio-group v-model="ruleForm.risk_four_img">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.risk_four_img === 1">
          <el-form-item label="组长：">
            <el-input v-model="board_lead.group_leader" placeholder="请输入组长" />
          </el-form-item>
          <el-form-item label="副组长：">
            <el-tag
              v-for="(item, index) in board_lead.vice_group_leader"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleViceClose(index)"
            >
              {{ item }}
            </el-tag>
            <el-input
              v-if="viceVisible"
              ref="viceInput"
              v-model="viceValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleViceConfirm"
              @blur="handleViceConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showVice()">添加副组长</el-button>
          </el-form-item>
          <el-form-item label="组员：">
            <el-tag
              v-for="(item, index) in board_lead.group_member"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleGroupClose(index)"
            >
              {{ item }}
            </el-tag>
            <el-input
              v-if="groupVisible"
              ref="groupInput"
              v-model="groupValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleGroupConfirm"
              @blur="handleGroupConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showGroup()">添加组员</el-button>
          </el-form-item>
          <!--<el-form-item label="副组长：">
            <el-input v-model="board_lead.vice_group_leader" placeholder="请输入副组长" />
          </el-form-item>
          <el-form-item label="组员：">
            <el-input v-model="board_lead.group_member" placeholder="请输入组员" />
          </el-form-item>-->
        </template>
      </el-form>
      <div class="dialog-btn riskidentify-btn">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="editSubmit()">提交</span>
      </div>
    </el-drawer>
    <!-- 排查报告 -->
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
            <div v-for="(item, k) in report_list" :key="k" style="margin-top: 16px">
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
    <el-image-viewer
      v-if="showImgViewer"
      :on-close="closeImgViewer"
      :url-list="[down_url + '/' + picture_img]"
    />
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
  bindNFC,
  unbindNFC,
  getQrCode,
  getImgCus,
  getThumbnail,
  getEmergencyCus,
  getEmergencyThumbnail,
  inspectionCode,
  relationRisk,
  patrolMan
} from '@/api/scl_identify'
import { mapGetters } from 'vuex'
import { getPatrolDetail, getPatrolReport } from '@/api/patrol'
import { getDateString } from '@/utils'
import { getPatrolRrate } from '@/api/dic'
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
        scl_risk_name: '',
        risk_no: '',
        nfc_code: '',
        page_num: 1,
        page_size: 10
      },
      risk_list: [],
      riskDetailObj: {},
      detail: {},
      selected_id: '',
      patrol_rate: {},
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
      ruleForm: {
        risk_id: '',
        scl_risk_name: '',
        patrol_man_id: '',
        nfc_code: '',
        patrol_rate: '',
        patrol_qrcode_num: '',
        risk_notice_num: '',
        emergency_handle_num: '',
        post_notify_num: '',
        risk_four_img: 0
      },
      board_lead: {
        group_leader: '',
        vice_group_leader: [],
        group_member: []
      },
      viceVisible: false, // 副组长
      groupVisible: false, // 组员
      viceValue: '',
      groupValue: '',
      rules: {
        risk_id: [
          { required: true, message: '请选择关联风险点', trigger: 'blur' }
        ],
        patrol_rate: [
          { required: true, message: '请选择巡检频率', trigger: 'blur' }
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
      categories_list: [], // 关联风险点
      patrol_man: [] // 巡检负责人
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.editType.title = this.editType.type === 'add' ? '新增风险点' : '编辑风险点'
      }
      if (!val) {
        this.editType.id = ''
        this.editType.type = 'add'
        Object.assign(this.$data.board_lead, this.$options.data().board_lead)
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
  async created() {
    this.queryData()
    await this.getPatrolRate()
    await this.getCategoriesList()
    await this.getPatrolMan()
  },
  methods: {
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
    bindNFC(id, type) {
      if (type === 1) {
        this.$prompt('NFC码', '绑定NFC码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\w+/,
          inputErrorMessage: 'NFC码不能为空'
        })
          .then(({ value }) => {
            bindNFC(id, value).then((res) => {
              this.$message({
                message: '绑定成功',
                type: 'success',
                duration: 3000
              })
              this.fetchData()
            })
          })
      } else {
        unbindNFC(id).then((res) => {
          this.$message({
            message: '解绑成功',
            type: 'success',
            duration: 3000
          })
          this.fetchData()
        })
      }
    },
    seeCode(sr_id) {
      getQrCode(sr_id).then((res) => {
        this.pic_url = res.data.qrcode
        this.showViewer = true
      })
    },
    closeViewer() {
      this.showViewer = false
    },
    handleSelectCategory() {
      if (this.editType.id === '') {
        this.categories_list.map((item) => {
          if (item.id === this.ruleForm.risk_id) {
            this.ruleForm.scl_risk_name = item.risk_name
          }
        })
      }
    },
    getPatrolRate() {
      getPatrolRrate().then((res) => {
        this.patrol_rate = res.data
      })
    },
    // 关联风险点
    getCategoriesList() {
      relationRisk().then((res) => {
        this.categories_list = res.data || []
      }).catch(() => {
        this.categories_list = []
      })
    },
    // 巡检负责人
    getPatrolMan() {
      patrolMan().then((res) => {
        this.patrol_man = res.data || []
      }).catch(() => {
        this.patrol_man = []
      })
    },
    showReport(id) {
      if (id) {
        getPatrolDetail(id).then((response) => {
          const data = response.data
          if (!data) {
            this.$message({
              message: '暂无排查报告',
              type: 'error',
              duration: 3000
            })
            return false
          }
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
          this.getReport({ page: 1 })
        })
      } else {
        this.$message({
          message: '暂无排查报告',
          type: 'error',
          duration: 3000
        })
      }
    },
    getReport(val) {
      const start_date = this.daterange
        ? getDateString(this.daterange[0], 'yyyyMMdd') + '000000'
        : ''
      const end_date = this.daterange
        ? getDateString(this.daterange[1], 'yyyyMMdd') + '235959'
        : ''
      this.report_page = val.page
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
        this.report_list = report
      })
    },
    viewDetail(risk_id) {
      gainRiskDetail(risk_id).then(res => {
        this.riskDetailObj = res.data
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
      }).then(() => {
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
        this.ruleForm = { ...this.ruleForm, ...res.data }
        this.ruleForm.risk_four_img = this.ruleForm.group_info ? 1 : 0
        if (this.ruleForm.group_info) {
          const group_info = JSON.parse(this.ruleForm.group_info)
          this.board_lead.group_leader = group_info.group_leader
          this.board_lead.vice_group_leader = group_info.vice_group_leader ? group_info.vice_group_leader.split(',') : []
          this.board_lead.group_member = group_info.group_member ? group_info.group_member.split(',') : []
        }
        this.editType.type = 'edit'
        this.showDialog = true
      })
    },
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            risk_id: this.ruleForm.risk_id,
            patrol_man_id: this.ruleForm.patrol_man_id,
            scl_risk_name: this.ruleForm.scl_risk_name,
            nfc_code: this.ruleForm.nfc_code,
            patrol_rate: this.ruleForm.patrol_rate,
            patrol_qrcode_num: this.ruleForm.patrol_qrcode_num,
            risk_notice_num: this.ruleForm.risk_notice_num,
            emergency_handle_num: this.ruleForm.emergency_handle_num,
            post_notify_num: this.ruleForm.post_notify_num,
            group_info: ''
          }
          if (this.ruleForm.risk_four_img === 1) {
            const group_info = {
              group_leader: this.board_lead.group_leader,
              vice_group_leader: this.board_lead.vice_group_leader.join(','),
              group_member: this.board_lead.group_member.join(',')
            }
            data.group_info = JSON.stringify(group_info)
          }
          let api = ''
          if (this.editType.type === 'add') {
            api = saveRisk
          } else {
            api = updateRisk
            data.id = this.editType.id
            data.patrol_id = this.ruleForm.patrol_id
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
    handleExportImg(data) {
      if (data.risk_id) {
        this.picture_title = data.scl_risk_name ? data.scl_risk_name + '风险公告卡' : '风险公告卡'
        this.picture.risk_id = data.risk_id
        getImgCus(data.risk_id).then((res) => {
          const data = res.data
          this.picture.font_size = Number(data.font_size)
          this.picture.potential_risk_line_height = Number(data.potential_risk_line_height)
          this.picture.risk_emergency_line_height = Number(data.risk_emergency_line_height)
          this.picture.risk_measure_control_line_height = Number(data.risk_measure_control_line_height)
          this.picture.pre_img_url = ''
          this.handleGetThumbnail()
          this.showImgExport = true
        })
      } else {
        this.$message({
          message: '未关联到风险点信息',
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
    handleEmergencyImg(data) {
      if (data.risk_id) {
        this.picture_title = data.scl_risk_name ? data.scl_risk_name + '应急处置卡' : '应急处置卡'
        this.emergency.risk_id = data.risk_id
        getEmergencyCus(data.risk_id).then((res) => {
          const data = res.data
          this.emergency.font_size = Number(data.font_size)
          data.risk_result_list.map((item, index) => {
            item[`risk_result_${index}`] = Number(item[`risk_result_${index}`])
          })
          this.emergency.risk_result_list = data.risk_result_list
          this.handleGetEmergency()
          this.showEmergencyExport = true
        })
      } else {
        this.$message({
          message: '未关联到风险点信息',
          type: 'error',
          duration: 3000
        })
      }
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
        this.showEmergencyExport = false
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
    async handleInspectionCode(data) {
      if (data.risk_no) {
        const url = await inspectionCode(data.sr_id)
        window.open(url)
      } else {
        this.$message({
          message: '请先关联风险编号',
          type: 'error',
          duration: 3000
        })
      }
    },
    // 组长组员
    handleViceClose(index) {
      this.board_lead.vice_group_leader.splice(index, 1)
    },
    handleViceConfirm() {
      const viceValue = this.viceValue
      if (viceValue) {
        this.board_lead.vice_group_leader.push(viceValue)
      }
      this.viceVisible = false
      this.viceValue = ''
    },
    showVice() {
      this.viceVisible = true
      this.$nextTick(() => {
        this.$refs.viceInput.$refs.input.focus()
      })
    },
    handleGroupClose(index) {
      this.board_lead.group_member.splice(index, 1)
    },
    handleGroupConfirm() {
      const groupValue = this.groupValue
      if (groupValue) {
        this.board_lead.group_member.push(groupValue)
      }
      this.groupVisible = false
      this.groupValue = ''
    },
    showGroup() {
      this.groupVisible = true
      this.$nextTick(() => {
        this.$refs.groupInput.$refs.input.focus()
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

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
  -moz-appearance: textfield !important;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
