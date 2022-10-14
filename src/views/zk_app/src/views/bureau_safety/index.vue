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
          <el-form-item label="学校名称：">
            <el-input
              v-model="search.scl_name"
              placeholder="请选择"
              @focus="choiceSchool"
            />
          </el-form-item>
          <el-form-item label="事故名称：">
            <el-input v-model="search.acc_name" placeholder="请输入事故名称" />
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
              @click="viewDetail(item.acc_id)"
            >
              <div class="title">
                <div class="left">
                  <div class="name">{{ item.scl_name }}</div>
                  <div class="time">{{ item.create_time | fgTime }}</div>
                </div>
                <div class="right">
                  <span
                    v-if="item.report_status === '1'"
                    class="not_approved"
                  >未批示</span>
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
        style="background: #f0f2f5; padding:0"
        :total="total"
        :page.sync="search.page_num"
        :limit.sync="search.page_size"
        @pagination="getData"
      />
    </div>
    <!-- 详情模态框 -->
    <el-drawer
      v-if="showDialog"
      title="事故详情"
      :visible.sync="showDialog"
      class="spp-drawer safety-accident-dialog"
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
      <div
        v-if="detail.report_status !== '2' && functionList.includes('A50005')"
        class="dialog-btn"
        style="text-align: right"
      >
        <span
          class="spp-btn spp-btn-primary"
          @click="approvedDialog = true"
        >批示</span>
      </div>
      <el-drawer
        title="批示"
        :append-to-body="true"
        :visible.sync="approvedDialog"
        :wrapper-closable="false"
        class="spp-child-drawer right-noall-content"
      >
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="处理意见" prop="handle_result">
            <el-input
              v-model="ruleForm.handle_result"
              type="textarea"
              :rows="6"
              placeholder="请输入处理意见"
            />
          </el-form-item>
          <el-form-item label="结案意见" prop="finish_result">
            <el-input
              v-model="ruleForm.finish_result"
              type="textarea"
              :rows="6"
              placeholder="请输入结案意见"
            />
          </el-form-item>
        </el-form>
        <div class="dialog-btn btn">
          <span class="spp-btn" @click="approvedDialog = false">取消</span>
          <span
            class="spp-btn spp-btn-primary"
            @click="saveApproved"
          >保存</span>
        </div>
      </el-drawer>
    </el-drawer>
    <el-dialog
      v-if="schoolDialog"
      title="选择学校"
      :visible.sync="schoolDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <SelectSchool @selectSchool="selectSchool" />
    </el-dialog>
  </div>
</template>

<script>
import { paginate, submitAccident } from '@/api/bureau_safety'
import { detailAccident } from '@/api/school_safety'
import Pagination from '@/components/Pagination'
import { edupaginate } from '@/api/school'
import { mapState } from 'vuex'
import AttachmentList from '@/components/AttachmentList'
import SelectSchool from '@/components/SelectSchool'
export default {
  name: 'BureauSafety',
  components: { Pagination, AttachmentList, SelectSchool },
  data() {
    return {
      search: {
        scl_id: '',
        scl_name: '',
        acc_name: '',
        page_num: 1,
        page_size: 6
      },
      data: [],
      total: 0,
      showDialog: false,
      detailTab: '1',
      detailtab_name: {
        1: '事故详情',
        2: '批示详情'
      },
      approvedList: [{}, {}, {}],
      approvedDialog: false,
      ruleForm: {
        handle_result: '',
        finish_result: ''
      },
      rules: {
        handle_result: [
          { required: true, message: '请输入处理意见', trigger: 'blur' }
        ],
        finish_result: [
          { required: true, message: '请输入结案意见', trigger: 'blur' }
        ]
      },
      schoolDialog: false,
      sclList: [],
      detail: {}
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  async created() {
    const { data } = await edupaginate('', 1, 1)
    this.sclList = data.list
    if (data.list.length > 0) {
      this.search.scl_id = data.list[0].scl_id
      this.search.scl_name = data.list[0].scl_name
    }
    this.getData()
  },
  methods: {
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const { scl_id, acc_name, page_num, page_size } = this.search
      this.data = []
      paginate(scl_id, acc_name, page_num, page_size).then((res) => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    resetForm() {
      this.search = {
        scl_id: this.sclList[0].scl_id,
        scl_name: this.sclList[0].scl_name,
        acc_name: '',
        page_num: 1,
        page_size: 6
      }
    },
    viewDetail(acc_id) {
      this.detailTab = '1'
      detailAccident(acc_id).then((res) => {
        this.detail = res.data
        this.showDialog = true
      })
    },
    // 选择学校
    choiceSchool() {
      this.schoolDialog = true
    },

    // 确认选择
    selectSchool(data) {
      this.schoolDialog = false
      this.search.scl_id = data.scl_id
      this.search.scl_name = data.scl_name
    },
    saveApproved() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { handle_result, finish_result } = this.ruleForm
          submitAccident(this.detail.acc_id, handle_result, finish_result).then(
            (res) => {
              this.$message({
                message: '批示成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.approvedDialog = false
              this.getData()
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
