<template>
  <div class="app-container page-have-tab right-side-dialog">
    <div class="government-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="我上报的" name="meadd" />
        <el-tab-pane label="待我处理" name="medealWeb" />
        <el-tab-pane label="待我治理" name="metreat" />
        <el-tab-pane label="逾期隐患" name="overdue" />
      </el-tabs>
      <div class="add-danger">
        <span
          v-if="functionList.includes('A28002')"
          class="spp-btn"
          @click="openSaveDanger('-1', '上报隐患')"
        >上报隐患</span>
      </div>
    </div>
    <section class="filter-container common-filter" style="margin-bottom: 15px">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">隐患描述：</label>
          <el-input v-model="governmentObj.keyword" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">隐患类型：</label>
          <el-select
            v-model="governmentObj.hd_type"
            clearable
            placeholder="请选择隐患类型"
          >
            <el-option
              v-for="(item, key) in categoryObj"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">隐患等级：</label>
          <el-select
            v-model="governmentObj.hd_level"
            clearable
            placeholder="请选择"
          >
            <el-option label="一般隐患" value="1" />
            <el-option label="重大隐患" value="0" />
          </el-select>
        </div>
        <div
          v-if="activeName === 'all' || activeName === 'meadd' || activeName === 'overdue'"
          class="filter-item"
        >
          <label class="label">隐患状态：</label>
          <el-select
            v-model="governmentObj.hd_status"
            clearable
            placeholder="请选择"
          >
            <el-option label="已上报" value="1" />
            <el-option label="已确认" value="2" />
            <el-option label="治理中" value="3" />
            <el-option label="已完成" value="4" />
            <el-option label="已归档" value="6" />
            <el-option label="已取消" value="0" />
          </el-select>
        </div>
        <div v-if="activeName === 'medealWeb'" class="filter-item">
          <label class="label">隐患状态：</label>
          <el-select
            v-model="governmentObj.hd_status"
            clearable
            placeholder="请选择"
          >
            <el-option label="已上报" value="1" />
            <el-option label="已确认" value="2" />
            <el-option label="已完成" value="4" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">开始时间：</label>
          <el-date-picker
            v-model="governmentObj.start_time"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="开始时间"
          />
        </div>
        <div class="filter-item">
          <label class="label">结束时间：</label>
          <el-date-picker
            v-model="governmentObj.end_time"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="结束时间"
          />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div v-if="governmentData.length > 0" class="emergency-group-body">
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in governmentData"
          :key="index"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="12"
        >
          <div
            class="grid-content bg-purple"
            style="cursor: pointer"
            @click="viewDetail(item.id)"
          >
            <div class="title">
              <div class="left">
                <img
                  src="../../assets/images/avatardefault.png"
                  alt
                  class="image"
                >
                <span class="text">{{ item.create_user_name }}</span>
              </div>
              <div class="right">{{ item.create_time | fgTime }}</div>
            </div>
            <div class="content-wrapper">
              <div class="content">
                <span class="left-text">隐患位置:</span>
                <span class="right-text" style="-webkit-line-clamp: 1">{{
                  item.hd_position
                }}</span>
              </div>
              <div class="content">
                <span class="left-text">隐患描述:</span>
                <span class="right-text" style="-webkit-line-clamp: 2">{{
                  item.hd_desc
                }}</span>
              </div>
              <div class="content">
                <span class="left-text">隐患类型:</span>
                <span class="right-text">{{ categoryObj[item.hd_type] }}</span>
              </div>
              <div class="content">
                <span class="left-text">隐患等级:</span>
                <span
                  v-show="item.hd_level === '1'"
                  class="right-text"
                >一般隐患</span>
                <span
                  v-show="item.hd_level === '2'"
                  class="right-text"
                >重大隐患</span>
              </div>
              <div class="content">
                <span
                  v-if="item.hd_status === '1' || item.hd_status === '0'"
                  class="left-text"
                >隐患确认人:</span>
                <span
                  v-if="item.hd_status === '2'"
                  class="left-text"
                >隐患指派人:</span>
                <span
                  v-if="item.hd_status === '3'"
                  class="left-text"
                >隐患治理人:</span>
                <span
                  v-if="item.hd_status === '4' || item.hd_status === '6'"
                  class="left-text"
                >隐患验收人:</span>
                <span class="right-text">{{ item.hd_to_user_name }}</span>
              </div>
              <div v-if="item.hd_except_time" class="content">
                <span class="left-text">治理截止时间:</span>
                <span class="right-text">
                  <span>{{ item.hd_except_time | fgTime }}</span>
                  <span
                    v-if="
                      item.hd_status !== '5' &&
                        item.hd_status !== '6' &&
                        item.hd_status !== '0'
                    "
                  >
                    <span
                      v-if="compareDate(item.hd_except_time)"
                      style="margin-left: 5px"
                    >
                      <img
                        src="../../assets/images/overdue.png"
                        alt=""
                        style="position: relative; top: 1px"
                      >
                      <span style="color:#FF7646">已逾期</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>

            <div class="grid-btn">
              <div class="left">{{ item.hd_status | dangerStatus }}</div>
              <div class="right">
                <span
                  v-if="
                    item.hd_status === '1' &&
                      item.is_operation === '1' &&
                      functionList.includes('A28003')
                  "
                  class="spp-btn spp-btn-primary"
                  @click.stop="
                    openSaveDanger(item.hd_status, '隐患确认', item.id)
                  "
                >去确认</span>
                <span
                  v-if="
                    item.hd_status === '2' &&
                      item.is_operation === '1' &&
                      functionList.includes('A28004')
                  "
                  class="spp-btn spp-btn-primary"
                  @click.stop="
                    openSaveDanger(item.hd_status, '隐患指派', item.id)
                  "
                >去指派</span>
                <span
                  v-if="
                    item.hd_status === '3' &&
                      item.is_operation === '1' &&
                      functionList.includes('A28005')
                  "
                  class="spp-btn spp-btn-primary"
                  @click.stop="
                    openSaveDanger(item.hd_status, '隐患治理', item.id)
                  "
                >去治理</span>
                <span
                  v-if="
                    item.hd_status === '4' &&
                      item.is_operation === '1' &&
                      functionList.includes('A28006')
                  "
                  class="spp-btn spp-btn-primary"
                  @click.stop="
                    openSaveDanger(item.hd_status, '隐患验收', item.id)
                  "
                >去验收</span>
                <span
                  v-if="functionList.includes('A28007')"
                  class="spp-btn"
                  @click.stop="delDanger(item.id)"
                >删除</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <pagination
        v-show="total > 0"
        style="background: #f0f2f5; padding: 0 16px 0 0"
        :total="total"
        :page.sync="governmentObj.page_num"
        :limit.sync="governmentObj.page_size"
        @pagination="disTab"
      />
    </div>
    <div v-else class="notice_no_data table_line">暂无数据</div>
    <!-- 操作模态框 -->
    <el-dialog
      v-if="showDialog"
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="right-noall-content"
    >
      <!-- 上报隐患 -->
      <div v-if="hd_status === '-1'">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="隐患类型" prop="hd_type">
            <el-select
              v-model="ruleForm.hd_type"
              clearable
              placeholder="请选择隐患类型"
              @change="selectCategory"
            >
              <el-option
                v-for="(item, key) in categoryObj"
                :key="key"
                :label="item"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="隐患确认接收人" prop="hd_to_user_id">
            <SelectUser
              ref="selectUser"
              v-model="ruleForm.hd_to_user_id"
              :have-recommend="true"
            />
          </el-form-item>
          <el-form-item label="隐患位置" prop="hd_position">
            <el-input
              v-model="ruleForm.hd_position"
              placeholder="请输入隐患位置"
            />
          </el-form-item>
          <el-form-item label="隐患描述" prop="hd_desc">
            <el-input
              v-model="ruleForm.hd_desc"
              type="textarea"
              :rows="4"
              placeholder="请输入隐患描述"
            />
          </el-form-item>
          <el-form-item label="上传附件">
            <Uploadfile @getFileList="getFileList" />
          </el-form-item>
        </el-form>
      </div>
      <!-- 确认隐患 -->
      <div v-if="hd_status === '1'">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="是否选构成隐患" prop="is_danger">
            <el-radio v-model="ruleForm.is_danger" label="1">是</el-radio>
            <el-radio v-model="ruleForm.is_danger" label="0">否</el-radio>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_danger === '1'"
            label="隐患指派接收人"
            prop="hd_to_user_id"
          >
            <SelectUser
              ref="selectUser"
              v-model="ruleForm.hd_to_user_id"
              :now-hd-id="now_hd_id"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_danger === '1'"
            label="隐患等级"
            prop="hd_level"
          >
            <el-select
              v-model="ruleForm.hd_level"
              clearable
              placeholder="请选择隐患等级"
            >
              <el-option label="一般隐患" value="1" />
              <el-option label="重大隐患" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="治理截止时间">
            <el-date-picker
              v-model="ruleForm.hd_except_time"
              type="datetime"
              value-format="yyyyMMddHHmmss"
              placeholder="请选择治理截止时间"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_danger === '1'"
            label="隐患后果"
            prop="hd_result"
          >
            <el-input
              v-model="ruleForm.hd_result"
              type="textarea"
              :rows="4"
              placeholder="请输入隐患后果"
            />
          </el-form-item>
          <el-form-item
            :label="ruleForm.is_danger === '1' ? '处理意见' : '备注'"
            prop="hd_remark"
          >
            <el-input
              v-model="ruleForm.hd_remark"
              type="textarea"
              :rows="4"
              placeholder="请输入处理意见"
            />
          </el-form-item>
        </el-form>
      </div>
      <!-- 指派隐患 -->
      <div v-if="hd_status === '2'">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="指派处理人" prop="hd_response_man_id">
            <SelectUser
              ref="selectUser"
              v-model="ruleForm.hd_response_man_id"
              :now-hd-id="now_hd_id"
            />
          </el-form-item>
        </el-form>
      </div>
      <!-- 治理隐患 -->
      <div v-if="hd_status === '3'">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="验收人"
            prop="hd_to_user_id"
            style="width: 302px"
          >
            <SelectUser
              ref="selectUser"
              v-model="ruleForm.hd_to_user_id"
              :now-hd-id="now_hd_id"
            />
          </el-form-item>
          <el-form-item label="治理结果" prop="hd_treat_result">
            <el-input
              v-model="ruleForm.hd_treat_result"
              type="textarea"
              :rows="4"
              placeholder="请输入治理结果"
            />
          </el-form-item>
          <el-form-item label="上传附件">
            <Uploadfile @getFileList="getFileList" />
          </el-form-item>
        </el-form>
      </div>
      <!-- 验收隐患 -->
      <div v-if="hd_status === '4'">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="验收结果" prop="check_status">
            <el-radio
              v-model="ruleForm.check_status"
              label="1"
            >验收通过</el-radio>
            <el-radio
              v-model="ruleForm.check_status"
              label="0"
            >验收不通过</el-radio>
          </el-form-item>
          <el-form-item label="验收意见" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入验收意见"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn riskidentify-btn">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="editSubmit">保存</span>
      </div>
    </el-dialog>
    <el-dialog
      v-if="detailDialog"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      width="720px"
      class="government-detail"
    >
      <div slot="title" class="header-title">
        <el-radio-group v-model="tabDetail">
          <el-radio-button label="1">隐患详情</el-radio-button>
          <el-radio-button label="2">处理进度</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="tabDetail === '1'" class="left-content">
        <div class="common-item">
          <span class="title">上报人:</span>
          <span class="content">{{ governmentDetailObj.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">上报时间:</span>
          <span class="content">{{
            governmentDetailObj.create_time | fgTime
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患点位置:</span>
          <span class="content">{{ governmentDetailObj.hd_position }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患描述:</span>
          <span class="content">{{ governmentDetailObj.hd_desc }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患类型:</span>
          <span class="content">{{
            categoryObj[governmentDetailObj.hd_type]
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患等级:</span>
          <span
            v-show="governmentDetailObj.hd_level === '1'"
            class="content"
          >一般隐患</span>
          <span
            v-show="governmentDetailObj.hd_level === '2'"
            class="content"
          >重大隐患</span>
        </div>
        <div class="common-item">
          <span class="title">处理状态:</span>
          <span class="content" style="color: #f76d02">{{
            governmentDetailObj.hd_status | dangerStatus
          }}</span>
        </div>
        <div class="common-item">
          <span
            v-if="
              governmentDetailObj.hd_status === '1' ||
                governmentDetailObj.hd_status === '0'
            "
            class="title"
          >隐患确认人:</span>
          <span
            v-if="governmentDetailObj.hd_status === '2'"
            class="title"
          >隐患指派人:</span>
          <span
            v-if="governmentDetailObj.hd_status === '3'"
            class="title"
          >隐患治理人:</span>
          <span
            v-if="
              governmentDetailObj.hd_status === '4' ||
                governmentDetailObj.hd_status === '6'
            "
            class="title"
          >隐患验收人:</span>
          <span>{{ governmentDetailObj.hd_to_user_name }}</span>
        </div>
        <div v-if="governmentDetailObj.hd_except_time" class="common-item">
          <span class="title">治理截止时间:</span>
          <span class="content">
            <span>{{ governmentDetailObj.hd_except_time | fgTime }}</span>
            <span
              v-if="
                governmentDetailObj.hd_status !== '5' &&
                  governmentDetailObj.hd_status !== '6' &&
                  governmentDetailObj.hd_status !== '0'
              "
            >
              <span
                v-if="compareDate(governmentDetailObj.hd_except_time)"
                style="margin-left: 5px"
              >
                <img
                  src="../../assets/images/overdue.png"
                  alt=""
                  style="position: relative; top: 1px"
                >
                <span style="color:#FF7646">已逾期</span>
              </span>
            </span>
          </span>
        </div>
        <AttachmentList
          v-if="governmentDetailObj.fileList.length > 0"
          :attachment="governmentDetailObj.fileList"
        />
      </div>
      <div
        v-show="tabDetail === '2'"
        class="right-content spp-hidden-danger-progress"
      >
        <el-timeline>
          <el-timeline-item
            v-if="governmentDetailObj.hd_status === '1'"
            :hide-timestamp="true"
            placement="top"
          >
            <div slot="dot" class="slot-item">
              <div class="icon-wrapper" style="background: #f76d02">
                <img
                  src="../../assets/images/confirmed.png"
                  alt
                  class="icon-img"
                >
              </div>
              <span class="status">待确认</span>
            </div>
            <el-card
              class="steps-content"
              style="text-align: center; padding; 0 20px"
            >
              <span
                v-if="
                  governmentDetailObj.is_operation === '1' &&
                    functionList.includes('A28003')
                "
                class="spp-btn spp-btn-primary"
                @click="goPerform('隐患确认')"
              >去确认</span>
              <span
                v-else
                style="color: #939699"
              >待{{ governmentDetailObj.hd_to_user_name }}确认</span>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-if="governmentDetailObj.hd_status === '2'"
            :hide-timestamp="true"
            placement="top"
          >
            <div slot="dot" class="slot-item">
              <div class="icon-wrapper" style="background: #f76d02">
                <img
                  src="../../assets/images/have_assign.png"
                  alt
                  class="icon-img"
                >
              </div>
              <span class="status">待指派</span>
            </div>
            <el-card class="steps-content" style="text-align: center">
              <span
                v-if="
                  governmentDetailObj.is_operation === '1' &&
                    functionList.includes('A28004')
                "
                class="spp-btn spp-btn-primary"
                @click="goPerform('隐患指派')"
              >去指派</span>
              <span
                v-else
                style="color: #939699"
              >待{{ governmentDetailObj.hd_to_user_name }}指派</span>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-if="governmentDetailObj.hd_status === '3'"
            :hide-timestamp="true"
            placement="top"
          >
            <div slot="dot" class="slot-item">
              <div class="icon-wrapper" style="background: #f76d02">
                <img
                  src="../../assets/images/have_manage.png"
                  alt
                  class="icon-img"
                >
              </div>
              <span class="status">待治理</span>
            </div>
            <el-card class="steps-content" style="text-align: center">
              <span
                v-if="
                  governmentDetailObj.is_operation === '1' &&
                    functionList.includes('A28005')
                "
                class="spp-btn spp-btn-primary"
                @click="goPerform('隐患治理')"
              >去治理</span>
              <span
                v-else
                style="color: #939699"
              >待{{ governmentDetailObj.hd_to_user_name }}治理</span>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-if="governmentDetailObj.hd_status === '4'"
            :hide-timestamp="true"
            placement="top"
          >
            <div slot="dot" class="slot-item">
              <div class="icon-wrapper" style="background: #f76d02">
                <img src="../../assets/images/filed.png" alt class="icon-img">
              </div>
              <span class="status">待验收</span>
            </div>
            <el-card class="steps-content" style="text-align: center">
              <span
                v-if="
                  governmentDetailObj.is_operation === '1' &&
                    functionList.includes('A28006')
                "
                class="spp-btn spp-btn-primary"
                @click="goPerform('隐患验收')"
              >去验收</span>
              <span
                v-else
                style="color: #939699"
              >待{{ governmentDetailObj.hd_to_user_name }}验收</span>
            </el-card>
          </el-timeline-item>
          <hiddenDanger :handle-log="handleLog" :category-obj="categoryObj" />
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginate,
  paginateMeadd,
  paginateMedealWeb,
  paginateMetreat,
  paginateExpire,
  getDangerInfo,
  getDangerProgress,
  saveDanger,
  confirmDanger,
  assignDanger,
  governDanger,
  checkDanger,
  dangerTypeList,
  deleteDanger,
  getRelationList
} from '@/api/government'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import SelectUser from '@/components/SelectUser'
import AttachmentList from '@/components/AttachmentList'
import hiddenDanger from '@/components/hiddenDanger'
import Uploadfile from '@/components/Uploadfile'
import { processAttach, formatDateTime } from '@/utils'
export default {
  name: 'Government',
  components: {
    Pagination,
    SelectUser,
    AttachmentList,
    hiddenDanger,
    Uploadfile
  },
  data() {
    const controlText = (rule, value, callback) => {
      if (!value) {
        this.ruleForm.is_danger === '1'
          ? callback(new Error('请输入处理意见'))
          : callback()
      } else {
        callback()
      }
    }
    return {
      governmentObj: {
        hd_type: '',
        hd_level: '',
        hd_status: '',
        start_time: '',
        end_time: '',
        keyword: '',
        page_num: 1,
        page_size: 8
      },
      filesData: {},
      categoryObj: {}, // 隐患类型字典
      activeName: 'all',
      governmentData: [],
      governmentDetailObj: { fileList: [] }, // 隐患详情
      viewNowId: '', // 当前查看详情的id
      handleLog: [], // 处理日志
      total: 0,
      showDialog: false,
      detailDialog: false,
      dialogTitle: '',
      hd_status: '-1',
      tabDetail: '1',
      ruleForm: {
        id: '',
        hd_position: '',
        hd_desc: '',
        hd_type: '',
        hd_to_user_id: '',
        is_danger: '1',
        hd_level: '',
        hd_result: '',
        hd_remark: '',
        hd_response_man_id: '',
        hd_treat_result: '',
        check_status: '1',
        remark: '',
        hd_except_time: ''
      },
      rules: {
        is_danger: [
          { required: true, message: '请选择是否构成隐患', trigger: 'blur' }
        ],
        hd_position: [
          { required: true, message: '请输入隐患位置', trigger: 'blur' }
        ],
        hd_desc: [
          { required: true, message: '请输入隐患描述', trigger: 'blur' }
        ],
        hd_type: [
          { required: true, message: '请选择隐患类型', trigger: 'blur' }
        ],
        hd_to_user_id: [{ required: true, message: '请选择', trigger: 'blur' }],
        hd_treat_result: [
          { required: true, message: '请输入治理结果', trigger: 'blur' }
        ],
        hd_level: [
          { required: true, message: '请选择隐患等级', trigger: 'blur' }
        ],
        hd_result: [
          { required: true, message: '请输入隐患后果', trigger: 'blur' }
        ],
        hd_remark: [
          { required: true, trigger: 'blur', validator: controlText }
        ],
        hd_response_man_id: [
          { required: true, message: '请选择指派处理人', trigger: 'blur' }
        ],
        check_status: [
          { required: true, message: '请选择验收结果', trigger: 'blur' }
        ]
      },
      now_hd_id: ''
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.disTab()
    this.getCategory()
  },
  methods: {
    // 获取所上传的附件
    getFileList(files) {
      this.filesData = processAttach(files)
    },
    // tab栏切换
    handleClick(tab, event) {
      this.activeName = tab.name
      this.governmentObj.page_num = 1
      this.governmentObj.page_size = 8
      this.total = 0
      this.resetData()
      this.disTab()
    },
    searchData() {
      this.governmentObj.page_num = 1
      this.disTab()
    },
    disTab() {
      const {
        hd_type,
        hd_level,
        hd_status,
        start_time,
        end_time,
        keyword,
        page_num,
        page_size
      } = this.governmentObj
      switch (JSON.parse(JSON.stringify(this.activeName))) {
        case 'all':
          paginate(
            hd_type,
            hd_level,
            hd_status,
            start_time,
            end_time,
            keyword,
            page_num,
            page_size
          ).then((res) => {
            this.governmentData = res.data.list
            this.total = res.data.totalRow
          })
          break
        case 'metreat': // 我治理
          paginateMetreat(
            hd_type,
            hd_level,
            start_time,
            end_time,
            keyword,
            page_num,
            page_size
          ).then((res) => {
            this.governmentData = res.data.list
            this.total = res.data.totalRow
          })
          break
        case 'medealWeb': // 我处理
          paginateMedealWeb(
            hd_type,
            hd_level,
            hd_status,
            start_time,
            end_time,
            keyword,
            page_num,
            page_size
          ).then((res) => {
            this.governmentData = res.data.list
            this.total = res.data.totalRow
          })
          break
        case 'meadd': // 我上报
          paginateMeadd(
            hd_type,
            hd_level,
            hd_status,
            start_time,
            end_time,
            keyword,
            page_num,
            page_size
          ).then((res) => {
            this.governmentData = res.data.list
            this.total = res.data.totalRow
          })
          break
        case 'overdue': // 我上报
          paginateExpire(
            hd_type,
            hd_level,
            hd_status,
            start_time,
            end_time,
            keyword,
            page_num,
            page_size
          ).then((res) => {
            this.governmentData = res.data.list
            this.total = res.data.totalRow
          })
          break
      }
    },
    // 获取隐患类型
    getCategory() {
      dangerTypeList().then((res) => {
        res.data.map((e) => {
          this.categoryObj[e.id] = e.type_name
        })
      })
    },
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.governmentObj,
        this.$options.data().governmentObj
      )
    },
    // 获取列表数据
    getData() {
      const {
        hd_type,
        hd_level,
        hd_status,
        start_time,
        end_time,
        keyword,
        page_num,
        page_size
      } = this.governmentObj
      paginate(
        hd_type,
        hd_level,
        hd_status,
        start_time,
        end_time,
        keyword,
        page_num,
        page_size
      ).then((res) => {
        this.governmentData = res.data.list
        this.total = res.data.totalRow
      })
    },
    // 删除隐患治理
    delDanger(id) {
      this.$confirm('您确定要该数据吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDanger(id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.disTab()
          })
        })
        .catch(() => {})
    },
    // 提交新增或者编辑的数据
    editSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.hd_status === '-1') {
            const {
              hd_position,
              hd_desc,
              hd_type,
              hd_to_user_id
            } = this.ruleForm
            saveDanger(
              // 上报
              hd_position,
              hd_desc,
              hd_type,
              hd_to_user_id,
              this.filesData.attachment_url,
              this.filesData.attachment_name,
              this.filesData.attachment_ext
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.disTab()
              this.showDialog = false
            })
          } else if (this.hd_status === '1') {
            // 确认
            const {
              id,
              hd_to_user_id,
              is_danger,
              hd_level,
              hd_result,
              hd_remark,
              hd_except_time
            } = this.ruleForm
            confirmDanger(
              id,
              hd_to_user_id,
              is_danger,
              hd_level,
              hd_result,
              hd_remark,
              hd_except_time
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.disTab()
              this.showDialog = false
            })
          } else if (this.hd_status === '2') {
            // 指派
            const { id, hd_response_man_id } = this.ruleForm
            assignDanger(id, hd_response_man_id).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.disTab()
              this.showDialog = false
            })
          } else if (this.hd_status === '3') {
            // 治理
            const { id, hd_treat_result, hd_to_user_id } = this.ruleForm
            governDanger(
              id,
              hd_to_user_id,
              hd_treat_result,
              this.filesData.attachment_url,
              this.filesData.attachment_name,
              this.filesData.attachment_ext
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.disTab()
              this.showDialog = false
            })
          } else if (this.hd_status === '4') {
            // 验收
            const { id, check_status, remark } = this.ruleForm
            checkDanger(id, check_status, remark).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.disTab()
              this.showDialog = false
            })
          }
        }
      })
    },
    // 处理附件传参的格式
    handleBatch(array, field) {
      let str = ''
      array.forEach((item) => {
        str += item.raw[field] + '|'
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      return str
    },

    // 打开操作模态框
    openSaveDanger(sign, title, id) {
      this.now_hd_id = ''
      this.hd_status = sign
      this.showDialog = true
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.dialogTitle = title
      this.ruleForm.id = id
      if (sign !== '-1') {
        this.now_hd_id = id
      }
    },

    // 查看详情
    viewDetail(id) {
      if (this.functionList.includes('A28001')) {
        this.tabDetail = '1'
        this.viewNowId = id
        getDangerInfo(id).then((res) => {
          this.governmentDetailObj = res.data
          this.governmentDetailObj.fileList = []
          if (this.governmentDetailObj.attachment_url) {
            const attachment_url = this.governmentDetailObj.attachment_url.split(
              '|'
            )
            const attachment_name = this.governmentDetailObj.attachment_name.split(
              '|'
            )
            const attachment_ext = this.governmentDetailObj.attachment_ext.split(
              '|'
            )
            attachment_url.forEach((item, index) => {
              this.governmentDetailObj.fileList.push({
                attachment_url: item,
                attachment_name: attachment_name[index],
                attachment_ext: attachment_ext[index]
              })
            })
          }
          this.detailDialog = true
        })
        getDangerProgress(id).then((res) => {
          this.handleLog = res.data.handle_log
          this.handleLog.forEach((opt) => {
            opt.log_info = JSON.parse(opt.log_info)
            if (opt.hd_status === '1' || opt.hd_status === '4') {
              if (opt.attachment_url) {
                opt.fileList = []
                const attachment_url = opt.attachment_url.split('|')
                const attachment_name = opt.attachment_name.split('|')
                const attachment_ext = opt.attachment_ext.split('|')
                attachment_url.forEach((item, index) => {
                  opt.fileList.push({
                    attachment_url: item,
                    attachment_name: attachment_name[index],
                    attachment_ext: attachment_ext[index]
                  })
                })
              }
            }
          })
        })
      }
    },

    // 详情页操作按钮
    goPerform(title) {
      this.detailDialog = false
      this.openSaveDanger(
        this.governmentDetailObj.hd_status,
        title,
        this.viewNowId
      )
    },
    // 选择指派处理人
    changeSelected(value) {
      this.ruleForm.hd_response_man_id = value
    },

    // 上报隐患选择隐患类型时获取当前类型的负责人
    selectCategory(type_id) {
      if (type_id) {
        getRelationList(type_id).then((res) => {
          this.$refs.selectUser.recommend(res.data)
        })
      } else {
        this.$refs.selectUser.recommend([])
      }
    },

    // 比较时间大小
    compareDate(date1, date2) {
      var oDate1 = new Date(formatDateTime(date1))
      var oDate2 = new Date()
      if (oDate1.getTime() > oDate2.getTime()) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.notice_no_data {
  text-align: center;
  line-height: 28px;
  color: #626466;
  font-size: 14px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #3399ff;
  font-size: 14px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.riskidentify-btn {
  text-align: right;
}
.emergency-group-body {
  .el-col {
    margin-bottom: 15px;
  }
  .grid-content,
  .bg-purple {
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    height: 302px;
    color: #313233;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        max-width: 50%;
      }
      .right {
        font-size: 12px;
        text-align: right;
        color: #939699;
      }
      .image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .text {
        margin-left: 10px;
        font-weight: bold;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .content-wrapper {
      height: 200px;
    }
    .content {
      display: flex;
      line-height: 20px;
      font-size: 14px;
      line-height: 25px;
      .left-text {
        width: 100px;
        color: #939699;
      }
      .right-text {
        width: calc(100% - 70px);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    .grid-btn {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      min-height: 30px;
      .left {
        font-size: 14px;
        color: #f76d02;
      }
      .right {
        .spp-btn {
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
    }
  }
}
.government-tab {
  position: relative;
  height: 50px;
  .add-danger {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
  }
}
</style>
