<template>
  <div class="app-container page-container right-side-dialog page-have-tab">
    <div class="safety-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="未上报" name="0" />
        <el-tab-pane label="已上报" name="1" />
      </el-tabs>
      <div v-if="functionList.includes('A50001')" class="add-accident">
        <span
          class="spp-btn spp-btn-primary"
          @click="addAccident"
        ><svg-icon icon-class="add" />新增事故</span>
      </div>
    </div>
    <div class="header-search single_line safety-search">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="事故名称：">
            <el-input v-model="search.acc_name" placeholder="请输入事故名称" />
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
              v-model="search.begin_time"
              value-format="yyyyMMddHHmmss"
              type="datetime"
              placeholder="请选择开始时间"
            />
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="search.end_time"
              value-format="yyyyMMddHHmmss"
              type="datetime"
              placeholder="请选择结束时间"
            />
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
    <div class="safety-accident-body">
      <div v-if="data.length > 0">
        <el-row :gutter="20">
          <el-col v-for="(item, index) in data" :key="index" :span="12">
            <div
              class="safety-content"
              style="cursor: pointer"
              @click.prevent="viewDetail(item.acc_id)"
            >
              <div class="title">
                <div class="left school-left">
                  <img src="../../assets/images/avatardefault.png" alt="">
                  <div>
                    <div class="name">{{ item.create_oper_name }}</div>
                    <div class="time">{{ item.create_time | fgTime }}</div>
                  </div>
                </div>
                <div
                  v-if="item.report_status === '0'"
                  class="right"
                  @click.stop
                >
                  <el-dropdown
                    trigger="click"
                    style="width: 30px; text-align: right"
                  >
                    <img
                      src="../../assets/images/spot.png"
                      alt=""
                      class="spot el-dropdown-link"
                    >
                    <el-dropdown-menu
                      slot="dropdown"
                      style="text-align: center"
                    >
                      <el-dropdown-item
                        v-if="functionList.includes('A50004')"
                        @click.native="submitAccident(item.acc_id)"
                      >上报教育局</el-dropdown-item>
                      <el-dropdown-item
                        v-if="functionList.includes('A50002')"
                        @click.native="editAccident(item.acc_id)"
                      >编辑</el-dropdown-item>
                      <el-dropdown-item
                        v-if="functionList.includes('A50003')"
                        style="color: #f9644e"
                        @click.native="delAccident(item.acc_id)"
                      >删除</el-dropdown-item>
                    </el-dropdown-menu></el-dropdown>
                </div>
                <div v-else class="right">
                  <span
                    v-if="item.report_status === '1'"
                    class="not_approved"
                  >已上报</span>
                  <span
                    v-else-if="item.report_status === '2'"
                    class="have_approved"
                  >已批示</span>
                </div>
              </div>
              <div class="content">
                <div class="content_title single-hidden">
                  {{ item.acc_name }}
                </div>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <span class="left_title">事故地点：</span>
                    <span class="right_content">{{ item.acc_place }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="left_title">事故损失：</span>
                    <span class="right_content">{{ item.acc_lost }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="left_title">发生时间：</span>
                    <span class="right_content">{{
                      item.occurrence_time | fgTime
                    }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span class="left_title">人员伤亡：</span>
                    <span class="right_content">{{ item.people_lost }}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="safety_accident_nodata">暂无数据</div>

      <pagination
        v-show="total > 0"
        style="background: #f0f2f5; padding: 0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <!-- 详情模态框 -->
    <el-drawer
      v-if="showDialog"
      title="事故详情"
      :visible.sync="showDialog"
      class="spp-drawer right-all-content safety-accident-dialog"
      :wrapper-closable="false"
    >
      <div class="safety_detailtab_wrapper">
        <el-radio-group v-model="detailTab">
          <el-radio-button
            v-for="(item, k) in detailtab_name"
            :key="k"
            :label="k"
          >{{ item }}</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="detailTab === '1'" class="detail_wrapper">
        <div class="common-item">
          <span class="title">事故名称:</span>
          <span class="content">{{ detail.acc_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">事故地点:</span>
          <span class="content">{{ detail.acc_place }}</span>
        </div>
        <div class="common-item">
          <span class="title">发生时间:</span>
          <span class="content">{{ detail.occurrence_time }}</span>
        </div>
        <div class="common-item">
          <span class="title">发生原因:</span>
          <span class="content">{{ detail.acc_reason }}</span>
        </div>
        <div class="common-item">
          <span class="title">财产损失:</span>
          <span class="content">{{ detail.money_lost }}</span>
        </div>
        <div class="common-item">
          <span class="title">人员伤亡:</span>
          <span class="content">{{ detail.people_lost }}</span>
        </div>
        <div class="common-item">
          <span class="title">处理情况:</span>
          <span class="content">{{ detail.acc_progress }}</span>
        </div>
        <div class="common-item">
          <span class="title">损失情况:</span>
          <span class="content">{{ detail.acc_lost }}</span>
        </div>
        <AttachmentList
          v-if="detail.attachment_list && detail.attachment_list.length > 0"
          :attachment="detail.attachment_list"
          style="margin-top: 10px"
        />
      </div>
      <div v-show="detailTab === '2'" class="detail_wrapper">
        <div v-if="detail.report_status === '2'">
          <div class="common-item">
            <span class="title">处理意见:</span>
            <span class="content">{{ detail.handle_result }}</span>
          </div>
          <div class="common-item">
            <span class="title">结案意见:</span>
            <span class="content">{{ detail.finish_result }}</span>
          </div>
        </div>
        <div v-else class="spp-home-no-content">
          <div class="content">
            <img
              src="../../assets/images/home-no-content.png"
              alt
              class="not-found"
            >
            <div class="text">还没有批示</div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 新增或者编辑模态框 -->
    <el-dialog
      v-if="addDialog"
      :title="dialogTitle"
      :visible.sync="addDialog"
      width="720px"
      class="right-noall-content"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="事故名称" prop="acc_name">
          <el-input v-model="ruleForm.acc_name" placeholder="请输入事故名称" />
        </el-form-item>
        <el-form-item label="事故地点" prop="acc_place">
          <el-input v-model="ruleForm.acc_place" placeholder="请输入事故地点" />
        </el-form-item>
        <el-form-item label="发生时间" prop="occurrence_time">
          <el-date-picker
            v-model="ruleForm.occurrence_time"
            type="datetime"
            placeholder="请选择安全事故发生时间"
            value-format="yyyyMMddHHmmss"
          />
        </el-form-item>
        <el-form-item label="发生原因" prop="acc_reason">
          <el-input
            v-model="ruleForm.acc_reason"
            type="textarea"
            :rows="4"
            placeholder="请输入安全事故发生原因 "
          />
        </el-form-item>
        <el-form-item label="财产损失" prop="money_lost">
          <el-input
            v-model="ruleForm.money_lost"
            placeholder="请输入财产损失情况(没有写无)"
          />
        </el-form-item>
        <el-form-item label="人员伤亡" prop="people_lost">
          <el-input
            v-model="ruleForm.people_lost"
            placeholder="请输入人员伤亡情况(没有写无)"
          />
        </el-form-item>
        <el-form-item label="处理情况" prop="acc_progress">
          <el-input
            v-model="ruleForm.acc_progress"
            type="textarea"
            :rows="4"
            placeholder="请输入安全事故处理情况 "
          />
        </el-form-item>
        <el-form-item label="损失情况" prop="acc_lost">
          <el-input
            v-model="ruleForm.acc_lost"
            type="textarea"
            :rows="4"
            placeholder="请输入安全事故损失情况 "
          />
        </el-form-item>
        <el-form-item v-if="!ruleForm.acc_id" label="上传附件">
          <Uploadfile @getFileList="getFileList" />
        </el-form-item>
        <div v-else>
          <el-form-item label="上传附件">
            <Uploadfile :show-file="false" @getFileList="getEditfileList" />
          </el-form-item>
          <AttachmentList
            v-if="attachment_list && attachment_list.length > 0"
            :attachment="attachment_list"
            :editable="true"
            @deleteAttachment="deleteAttach"
          />
        </div>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="addDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="saveAccident">提交</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginate,
  saveAccident,
  updateAccident,
  detailAccident,
  delAccident,
  submitAccident,
  addAttachment,
  deleteAttach
} from '@/api/school_safety'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import AttachmentList from '@/components/AttachmentList'
import Uploadfile from '@/components/Uploadfile'
import { processAttach } from '@/utils'
export default {
  name: 'SchoolSafety',
  components: { Pagination, AttachmentList, Uploadfile },
  data() {
    return {
      activeName: 'all',
      search: {
        acc_name: '',
        begin_time: '',
        end_time: ''
      },
      data: [],
      page: 1,
      page_size: 6,
      total: 0,
      showDialog: false,
      addDialog: false,
      dialogTitle: '',
      detailTab: '1',
      detailtab_name: {
        1: '事故详情',
        2: '批示详情'
      },
      detail: {},
      ruleForm: {
        acc_id: '',
        acc_name: '',
        acc_place: '',
        occurrence_time: '',
        money_lost: '',
        people_lost: '',
        acc_reason: '',
        acc_progress: '',
        acc_lost: ''
      },
      rules: {
        acc_name: [
          { required: true, message: '请输入事故名称', trigger: 'blur' }
        ],
        acc_place: [
          { required: true, message: '请输入事故地点', trigger: 'blur' }
        ],
        occurrence_time: [
          {
            required: true,
            message: '请选择安全事故发生时间',
            trigger: 'blur'
          }
        ],
        money_lost: [
          {
            required: true,
            message: '请输入财产损失情况(没有写无)',
            trigger: 'blur'
          }
        ],
        people_lost: [
          {
            required: true,
            message: '请输入人员伤亡情况(没有写无)',
            trigger: 'blur'
          }
        ],
        acc_reason: [
          {
            required: true,
            message: '请输入安全事故发生原因',
            trigger: 'blur'
          }
        ],
        acc_progress: [
          {
            required: true,
            message: '请输入安全事故处理情况',
            trigger: 'blur'
          }
        ],
        acc_lost: [
          {
            required: true,
            message: '请输入安全事故损失情况',
            trigger: 'blur'
          }
        ]
      },
      filesData: {},
      attachment_list: []
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  async created() {
    this.getData()
  },
  methods: {
    // 获取所上传的附件
    getFileList(files) {
      this.filesData = processAttach(files)
    },
    getEditfileList(files) {
      const file = files[Object.keys(files)[Object.keys(files).length - 1]]
      addAttachment(
        this.ruleForm.acc_id,
        file.attachment_url,
        file.attachment_name,
        file.attachment_ext
      ).then((response) => {
        this.$message({
          message: '附件上传成功',
          type: 'success',
          duration: 3000
        })
        this.getAttach()
      })
    },
    // 删除附件
    deleteAttach(item) {
      this.$confirm('您确定要删除该附件吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAttach(item.id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getAttach()
          })
        })
        .catch(() => {})
    },
    getAttach() {
      this.attachment_list = []
      detailAccident(this.ruleForm.acc_id).then((res) => {
        this.attachment_list = res.data.attachment_list
      })
    },
    // tab栏切换
    handleClick(tab, event) {
      this.activeName = tab.name
      this.resetForm()
      this.searchData()
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const { acc_name, begin_time, end_time } = this.search
      this.data = []
      paginate(
        acc_name,
        this.activeName === 'all' ? '' : this.activeName,
        begin_time,
        end_time,
        this.page,
        this.page_size
      ).then((res) => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    viewDetail(acc_id) {
      this.detailTab = '1'
      detailAccident(acc_id).then((res) => {
        this.detail = res.data
        this.showDialog = true
      })
    },
    addAccident() {
      this.filesData = {}
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
      this.addDialog = true
      this.dialogTitle = '上报事故'
    },
    editAccident(acc_id) {
      this.filesData = {}
      detailAccident(acc_id).then((res) => {
        this.ruleForm = res.data
        this.attachment_list = res.data.attachment_list
        this.addDialog = true
        this.dialogTitle = '修改事故'
      })
    },
    saveAccident() {
      if (!this.ruleForm.acc_id) {
        // 新增
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const {
              acc_name,
              acc_place,
              occurrence_time,
              money_lost,
              people_lost,
              acc_reason,
              acc_progress,
              acc_lost
            } = this.ruleForm
            saveAccident(
              acc_name,
              acc_place,
              occurrence_time,
              money_lost,
              people_lost,
              acc_reason,
              acc_progress,
              acc_lost,
              this.filesData.attachment_url,
              this.filesData.attachment_name,
              this.filesData.attachment_ext
            ).then((response) => {
              this.addDialog = false
              this.$message({
                message: '事故上报成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const {
              acc_id,
              acc_name,
              acc_place,
              occurrence_time,
              money_lost,
              people_lost,
              acc_reason,
              acc_progress,
              acc_lost
            } = this.ruleForm
            updateAccident(
              acc_id,
              acc_name,
              acc_place,
              occurrence_time,
              money_lost,
              people_lost,
              acc_reason,
              acc_progress,
              acc_lost
            ).then((response) => {
              this.addDialog = false
              this.$message({
                message: '事故修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    submitAccident(acc_id) {
      this.$confirm('您确定要把该事故上报到教育局吗？', '上报提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          submitAccident(acc_id).then((response) => {
            this.$message({
              type: 'success',
              message: '上报成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    delAccident(acc_id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAccident(acc_id).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.safety-tab {
  position: relative;
  height: 50px;
  .add-accident {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
  }
}
</style>
<style lang="scss">
.safety-search {
  .el-form .el-form-item input[type="text"] {
    width: 220px;
  }
}
</style>
