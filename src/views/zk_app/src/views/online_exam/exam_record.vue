<template>
  <div
    class="app-container page-container right-side-dialog exam_record_container"
  >
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="考试状态：">
            <el-select
              v-model="search.exam_status"
              clearable
              placeholder="请选择"
            >
              <el-option label="未开始" value="1" />
              <el-option label="已开始" value="2" />
              <el-option label="已结束 " value="3" />
              <el-option label="已取消 " value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="考试名称：">
            <el-input v-model="search.exam_name" placeholder="请输入考试名称" />
          </el-form-item>
          <el-form-item label="起始时间：">
            <el-date-picker
              v-model="search.exam_begin_time"
              value-format="yyyyMMddHHmmss"
              type="datetime"
              placeholder="请选择起始时间"
            />
          </el-form-item>
          <el-form-item label="终止时间：">
            <el-date-picker
              v-model="search.exam_end_time"
              value-format="yyyyMMddHHmmss"
              type="datetime"
              placeholder="请选择终止时间"
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
    <div class="main-header">
      <span
        v-if="functionList.includes('A49001')"
        class="spp-btn spp-btn-primary"
        @click="addExam()"
      >
        <svg-icon icon-class="add" />新增考试
      </span>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="考试名称" prop="exam_name" />
        <el-table-column label="题数" prop="total_num" />
        <el-table-column label="限时(分钟)" prop="limit_time" />
        <el-table-column label="起始时间" width="180">
          <template slot-scope="scope">{{
            scope.row.exam_begin_time | fgTime
          }}</template>
        </el-table-column>
        <el-table-column label="终止时间" width="180">
          <template slot-scope="scope">{{
            scope.row.exam_end_time | fgTime
          }}</template>
        </el-table-column>
        <el-table-column label="参考人数">
          <template slot-scope="scope">
            <div>
              {{ scope.row.person_num }}
              <svg-icon
                v-if="
                  scope.row.publish_status === '0' &&
                    functionList.includes('A49005')
                "
                icon-class="edit"
                class="icon_btn"
                @click="referTo(scope.row.exam_org_id)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.publish_status === '0'">未发布</span>
            <span v-else-if="scope.row.exam_status === '1'">已发布</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="viewDetail(scope.row.exam_org_id)"
            >详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="functionList.includes('A49004')"
                    :disabled="scope.row.publish_status === '1'"
                    @click.native="publishExam(scope.row.exam_org_id)"
                  >发布</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A49002')"
                    :disabled="scope.row.publish_status === '1'"
                    @click.native="editExam(scope.row.exam_org_id)"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A49003')"
                    :disabled="scope.row.publish_status === '1'"
                    @click.native="delItem(scope.row.exam_org_id)"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
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
    <!-- 新增或者编辑模态框 -->
    <el-dialog
      v-if="showDialog"
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="738px"
      class="right-noall-content"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="103px"
        class="demo-ruleForm"
      >
        <el-form-item label="考试名称" prop="exam_name">
          <el-input v-model="ruleForm.exam_name" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="题目数量" prop="total_num">
          <el-select
            v-model="ruleForm.total_num"
            clearable
            placeholder="请选择题目数量"
            :disabled="ruleForm.org_exam_id!==null"
          >
            <el-option
              v-for="(item, key) in totalObj"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合格标准" prop="pass_standard">
          <el-input
            v-model="ruleForm.pass_standard"
            type="number"
            min="1"
            placeholder="答对多少题合格"
          />
        </el-form-item>
        <el-form-item label="限时" prop="limit_time">
          <el-select
            v-model="ruleForm.limit_time"
            clearable
            placeholder="请选择考试限定时长"
          >
            <el-option
              v-for="(item, key) in limitObj"
              :key="key"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="exam_begin_time">
          <el-date-picker
            v-model="ruleForm.exam_begin_time"
            type="datetime"
            placeholder="请选择起始时间"
            value-format="yyyyMMddHHmmss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="exam_end_time">
          <el-date-picker
            v-model="ruleForm.exam_end_time"
            type="datetime"
            placeholder="请选择终止时间"
            value-format="yyyyMMddHHmmss"
          />
        </el-form-item>
        <el-form-item label="是否重复考试" prop="exam_repeat_flag">
          <el-select
            v-model="ruleForm.exam_repeat_flag"
            clearable
            placeholder="是否重复考试"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!ruleForm.org_exam_id"
          label="参考人员"
          prop="exam_person_id"
        >
          <el-transfer
            v-model="ruleForm.exam_person_id"
            :props="{ key: 'user_id', label: 'user_name' }"
            :data="personnelList"
            :titles="['人员列表', '已选择人员']"
            filterable
            filter-placeholder="搜索人员名称"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
      </div>
    </el-dialog>
    <!-- 参考人员 -->
    <el-dialog
      v-if="personnelDialog"
      title="参考人员"
      :visible.sync="personnelDialog"
      width="720px"
      class="right-noall-content"
      :close-on-click-modal="false"
    >
      <el-form
        ref="personnelForm"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="参考人员" prop="exam_person_id">
          <el-transfer
            v-model="ruleForm.exam_person_id"
            :data="personnelList"
            :props="{ key: 'user_id', label: 'user_name' }"
            :titles="['人员列表', '已选择人员']"
            filterable
            filter-placeholder="搜索人员名称"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="personnelDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="addperson">提交</span>
      </div>
    </el-dialog>
    <el-drawer
      v-if="detailDialog"
      title="考试详情"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      width="720px"
      class="spp-drawer spp-child-exam-drawer right-all-content"
      :wrapper-closable="false"
    >
      <div class="common-item">
        <span class="title">考试名称：</span>
        <span class="content">{{ detailObj.exam_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">考试状态：</span>
        <span v-if="detailObj.exam_status === '1'" class="content">未开始</span>
        <span
          v-else-if="detailObj.exam_status === '2'"
          class="content"
        >已开始</span>
        <span
          v-else-if="detailObj.exam_status === '3'"
          class="content"
        >已结束</span>
        <span
          v-else-if="detailObj.exam_status === '4'"
          class="content"
        >已取消</span>
      </div>
      <div class="common-item">
        <span class="title">题目数量：</span>
        <span class="content">
          <span>{{ detailObj.total_num }}</span>
          <span
            style="color: #3399ff; margin-left: 8px; cursor: pointer"
            @click="viewExambank"
          >查看</span>
        </span>
      </div>
      <div class="common-item">
        <span class="title">合格标准：</span>
        <span class="content">{{ detailObj.pass_standard }}</span>
      </div>
      <div class="common-item">
        <span class="title">限时：</span>
        <span class="content">{{ detailObj.limit_time }}</span>
      </div>
      <div class="common-item">
        <span class="title">起始时间：</span>
        <span class="content">{{ detailObj.exam_begin_time | fgTime }}</span>
      </div>
      <div class="common-item">
        <span class="title">终止时间：</span>
        <span class="content">{{ detailObj.exam_end_time | fgTime }}</span>
      </div>
      <div class="common-item">
        <span class="title">是否重复考试：</span>
        <span v-if="detailObj.exam_repeat_flag === '1'" class="content">是</span>
        <span v-else class="content">否</span>
      </div>
      <div class="common-item">
        <span class="title">参考人数：</span>
        <span class="content">{{ detailObj.person_num }}</span>
      </div>
      <div class="common-item">
        <span class="title">考试结果：</span>
      </div>
      <el-tabs type="card">
        <el-tab-pane :label="'合格(' + detailObj.pass_person_list.length + ')'">
          <div
            v-if="detailObj.pass_person_list.length > 0"
            class="exam_record_collapse"
          >
            <el-collapse>
              <el-collapse-item
                v-for="(item, index) in detailObj.pass_person_list"
                :key="index"
                :title="item.person_name"
              >
                <div class="exam_record_content">
                  <div class="left_wrapper">
                    <span class="left_span">正确：{{ item.right_num }}</span>
                    <span>错误：{{ item.wrong_num }}</span>
                  </div>
                  <div class="right_wrapper">
                    <span class="time">{{ item.answer_time | fgTime }}</span>
                    <span
                      class="view_exam"
                      @click="viewReport(item)"
                    >查看试卷</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else class="exam_record_nodata">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane
          :label="'不合格(' + detailObj.no_pass_person_list.length + ')'"
        >
          <div
            v-if="detailObj.no_pass_person_list.length > 0"
            class="exam_record_collapse"
          >
            <el-collapse>
              <el-collapse-item
                v-for="(item, index) in detailObj.no_pass_person_list"
                :key="index"
                :title="item.person_name"
              >
                <div class="exam_record_content">
                  <div class="left_wrapper">
                    <span class="left_span">正确：{{ item.right_num }}</span>
                    <span>错误：{{ item.wrong_num }}</span>
                  </div>
                  <div class="right_wrapper">
                    <span class="time">{{ item.answer_time | fgTime }}</span>
                    <span
                      class="view_exam"
                      @click="viewReport(item)"
                    >查看试卷</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else class="exam_record_nodata">暂无数据</div>
        </el-tab-pane>
        <el-tab-pane
          :label="'未考试(' + detailObj.not_exam_person_list.length + ')'"
        >
          <div
            v-if="detailObj.not_exam_person_list.length > 0"
            class="not_exam_list"
          >
            <div
              v-for="(item, index) in detailObj.not_exam_person_list"
              :key="index"
              class="item_list"
            >
              {{ item.person_name }}
            </div>
          </div>
          <div v-else class="exam_record_nodata">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
      <el-drawer
        title="题目"
        :append-to-body="true"
        :visible.sync="subjectDrawer"
        class="spp-child-drawer right-all-content spp-child-exam-drawer"
        :wrapper-closable="false"
      >
        <div
          v-for="(item, index) in examSubject"
          :key="index"
          class="exam_subject_item"
        >
          <div class="exam_type">
            {{ index + 1 }}、
            <span v-if="item.ques_type === '1'">单选题</span>
            <span v-else-if="item.ques_type === '2'">多选题</span>
            <span v-else-if="item.ques_type === '3'">是非题</span>
          </div>
          <div class="exam_title">{{ item.ques_title }}</div>
          <div
            v-for="(opt, key) in JSON.parse(item.option_answer)"
            :key="key"
            class="exam_option"
          >
            {{ opt.option }}、{{ opt.text }}
          </div>
        </div>
      </el-drawer>
      <el-drawer
        title="成绩单"
        :append-to-body="true"
        :visible.sync="schoolReport"
        class="spp-child-drawer right-all-content spp-child-exam-drawer"
        :wrapper-closable="false"
      >
        <div class="school_report_dialog">
          <div class="report_name">{{ stu_report.person_name }}的成绩单</div>
          <div class="report_num">
            <span class="common_status status_correct" />
            <span>正确：{{ stu_report.right_num }}</span>
            <span class="common_status status_wrong" />
            <span>错误：{{ stu_report.wrong_num }}</span>
          </div>
          <div class="report_detail">
            <div
              v-for="(item, index) in reportList"
              :key="index"
              class="report_detail_item"
              :class="{
                correct_status: item.answer_status === '1',
                wrong_status: item.answer_status === '2',
                check_status: item.checkd,
              }"
              @click="checkQuestion(item, index)"
            >
              {{ index + 1 }}
            </div>
          </div>
          <div v-if="checkd_ques" class="exam_subject_item">
            <div class="exam_type">
              {{ checkd_ques.num }}、
              <span v-if="checkd_ques.ques_type === '1'">单选题</span>
              <span v-else-if="checkd_ques.ques_type === '2'">多选题</span>
              <span v-else-if="checkd_ques.ques_type === '3'">是非题</span>
            </div>
            <div class="exam_title">{{ checkd_ques.ques_title }}</div>
            <div
              v-for="(opt, key) in JSON.parse(checkd_ques.option_answer)"
              :key="key"
              class="exam_option"
            >
              {{ opt.option }}、{{ opt.text }}
            </div>
            <div
              :class="{
                result_answer_1: checkd_ques.answer_status === '1',
                result_answer_2: checkd_ques.answer_status === '2',
              }"
            >
              选择：{{ checkd_ques.result_answer }}
            </div>
            <div class="real_answer">
              正确答案：{{ checkd_ques.real_answer }}
            </div>
          </div>
        </div>
      </el-drawer>
    </el-drawer>
  </div>
</template>

<script>
import {
  paginate,
  detailExamOrg,
  orgUserlist,
  joinlist,
  delExamOrg,
  addperson,
  updateExamOrg,
  publishExam,
  getLimitTime,
  getTotalNum,
  saveExamOrg,
  exambank,
  banklist
} from '@/api/exam_record'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'ExamRecord',
  components: { Pagination },
  data() {
    return {
      search: {
        exam_status: '',
        exam_name: '',
        exam_begin_time: '',
        exam_end_time: ''
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      detailDialog: false,
      dialogTitle: '',
      personnelDialog: false,
      subjectDrawer: false,
      schoolReport: false,
      personnelList: [],
      limitObj: {},
      totalObj: {},
      ruleForm: {
        org_exam_id: null,
        exam_name: '',
        total_num: '',
        pass_standard: '',
        limit_time: '',
        exam_begin_time: '',
        exam_end_time: '',
        exam_person_id: [],
        exam_repeat_flag: ''
      },
      rules: {
        exam_name: [
          { required: true, message: '请输入考试名称', trigger: 'blur' }
        ],
        total_num: [
          { required: true, message: '请选择题目数量', trigger: 'blur' }
        ],
        pass_standard: [
          { required: true, message: '请输入合格标准', trigger: 'blur' }
        ],
        limit_time: [
          { required: true, message: '请选择考试限定时长', trigger: 'blur' }
        ],
        exam_begin_time: [
          { required: true, message: '请选择起始时间', trigger: 'blur' }
        ],
        exam_end_time: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        exam_person_id: [
          { required: true, message: '请选择参考人员', trigger: 'blur' }
        ],
        exam_repeat_flag: [
          { required: true, message: '请选择是否重复考试', trigger: 'blur' }
        ]
      },
      detailObj: {
        pass_person_list: [],
        no_pass_person_list: [],
        not_exam_person_list: []
      },
      examSubject: [],
      reportList: [],
      stu_report: {},
      checkd_ques: null
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  async created() {
    this.getData()
    this.getOrgUserlist()
    this.getLimitTime()
    this.getTotalNum()
  },
  methods: {
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const {
        exam_status,
        exam_name,
        exam_begin_time,
        exam_end_time
      } = this.search
      paginate(
        exam_status,
        exam_name,
        exam_begin_time,
        exam_end_time,
        this.page,
        this.page_size
      ).then((res) => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    getLimitTime() {
      getLimitTime().then((res) => {
        this.limitObj = res.data
      })
    },
    getTotalNum() {
      getTotalNum().then((res) => {
        this.totalObj = res.data
      })
    },
    viewDetail(id) {
      detailExamOrg(id).then((res) => {
        this.detailObj = res.data
        this.detailDialog = true
      })
    },
    // 获取学校的人员列表
    getOrgUserlist() {
      orgUserlist().then((res) => {
        this.personnelList = res.data
      })
    },
    // 获取参与考试的人员列表
    getJoinlist() {
      joinlist(this.ruleForm.org_exam_id).then((res) => {
        this.ruleForm.exam_person_id = res.data.map((item) => {
          return item.user_id
        })
        this.personnelDialog = true
      })
    },
    publishExam(exam_org_id) {
      publishExam(exam_org_id).then((response) => {
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
        this.getData()
      })
    },
    viewExambank() {
      exambank(this.detailObj.exam_org_id).then((res) => {
        this.examSubject = res.data
        this.subjectDrawer = true
      })
    },
    // 查看成绩单
    viewReport(obj) {
      this.checkd_ques = null
      banklist(obj.exam_person_id).then((res) => {
        this.reportList = res.data
        this.stu_report = obj
        this.schoolReport = true
      })
    },
    checkQuestion(obj, index) {
      this.reportList.forEach((item) => {
        item.checkd = false
      })
      obj.checkd = true
      this.checkd_ques = obj
      this.checkd_ques.num = index + 1
    },
    addExam() {
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
      this.showDialog = true
      this.dialogTitle = '新增试题'
    },
    editExam(id) {
      detailExamOrg(id).then((res) => {
        this.ruleForm = {
          org_exam_id: res.data.exam_org_id,
          exam_name: res.data.exam_name,
          total_num: res.data.total_num,
          pass_standard: res.data.pass_standard,
          limit_time: res.data.limit_time,
          exam_begin_time: res.data.exam_begin_time,
          exam_end_time: res.data.exam_end_time,
          exam_repeat_flag: res.data.exam_repeat_flag
        }
        this.showDialog = true
        this.dialogTitle = '修改试题'
      })
    },
    delItem(id) {
      if (id) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delExamOrg(id).then((response) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
    submit() {
      if (!this.ruleForm.org_exam_id) {
        // 新增
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const {
              exam_name,
              total_num,
              pass_standard,
              limit_time,
              exam_begin_time,
              exam_end_time,
              exam_repeat_flag,
              exam_person_id
            } = this.ruleForm
            saveExamOrg(
              exam_name,
              total_num,
              pass_standard,
              limit_time,
              exam_begin_time,
              exam_end_time,
              exam_repeat_flag,
              exam_person_id.join(',')
            ).then((response) => {
              this.showDialog = false
              this.$message({
                message: '试题添加成功',
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
              org_exam_id,
              exam_name,
              total_num,
              pass_standard,
              limit_time,
              exam_begin_time,
              exam_end_time,
              exam_repeat_flag
            } = this.ruleForm
            updateExamOrg(
              org_exam_id,
              exam_name,
              total_num,
              pass_standard,
              limit_time,
              exam_begin_time,
              exam_end_time,
              exam_repeat_flag
            ).then((response) => {
              this.showDialog = false
              this.$message({
                message: '试题修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    addperson() {
      this.$refs.personnelForm.validate((valid) => {
        if (valid) {
          addperson(
            this.ruleForm.org_exam_id,
            this.ruleForm.exam_person_id.join(',')
          ).then((response) => {
            this.personnelDialog = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        }
      })
    },
    // 参考人员
    referTo(org_exam_id) {
      this.ruleForm.org_exam_id = org_exam_id
      this.getJoinlist(org_exam_id)
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    }
  }
}
</script>
<style lang="scss" scoped>
.exam_record_container {
  .common-item .title {
    width: 100px;
  }
  .common-item .content {
    width: calc(100% - 100px);
  }
}
.exam_subject_item {
  border: 1px solid #e1e3e6;
  padding: 10px;
  font-size: 14px;
  color: #313233;
  margin-bottom: 10px;
  .exam_title {
    font-size: 16px;
    padding: 8px 0 14px 0;
    font-weight: bold;
  }
  .exam_option {
    padding-bottom: 9px;
    &:last-of-type {
      padding-bottom: 0;
    }
  }
  .real_answer {
    margin-top: 10px;
    color: #4dcd70;
  }
  .result_answer_1 {
    color: #4dcd70;
  }
  .result_answer_2 {
    color: #f9644e;
  }
}
.exam_record_collapse {
  .exam_record_content {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .left_wrapper {
      color: #313233;
      .left_span {
        margin-right: 26px;
      }
    }
    .right_wrapper {
      .time {
        color: #939699;
      }
      .view_exam {
        cursor: pointer;
        color: #3399ff;
        margin-left: 16px;
      }
    }
  }
}
.not_exam_list {
  border: 1px solid #d7d9db;
  .item_list {
    height: 40px;
    line-height: 40px;
    padding-left: 18px;
    background: #f0f5fa;
    font-size: 14px;
    border-bottom: 1px solid #d7d9db;
    &:last-of-type {
      border-bottom: none;
    }
  }
}
.school_report_dialog {
  .report_name {
    font-size: 18px;
    color: #313233;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .report_num {
    color: #313233;
    font-size: 16px;
    display: flex;
    align-items: center;
    .common_status {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
    .status_correct {
      background: #c4ffd8;
    }
    .status_wrong {
      background: #ffc4c1;
      margin-left: 20px;
    }
  }
  .report_detail {
    display: flex;
    margin-top: 9px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .report_detail_item {
      width: 40px;
      height: 40px;
      border: 1px solid #e1e3e6;
      margin-left: -1px;
      margin-top: -1px;
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
    .correct_status {
      background: #c4ffd8;
    }
    .wrong_status {
      background: #ffc4c1;
    }
    .check_status {
      color: #3399ff;
    }
  }
}
.exam_record_nodata {
  line-height: 60px;
  color: #909399;
  text-align: center;
  font-size: 14px;
}
</style>
<style lang="scss">
.exam_record_container {
  .el-select {
    width: 220px;
  }
  .el-transfer .el-transfer-panel {
    width: 242px;
  }
  .header-search {
    .el-form .el-form-item input[type="text"] {
      width: 220px;
    }
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tab-pane {
    border: 1px solid #e1e3e6;
    border-top: none;
    padding: 11px;
  }
}
.spp-child-exam-drawer .el-drawer__body {
  margin-bottom: 0;
  padding: 20px 49px 20px 40px;
}
.exam_record_collapse {
  .el-collapse .el-collapse-item__wrap {
    padding-top: 0;
  }
  .el-collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
