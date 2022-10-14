<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="检查名称：">
            <el-input v-model="search.si_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="检查状态：">
            <el-select v-model="search.inspection_status" clearable placeholder="请选择">
              <el-option label="未发布" :value="0" />
              <el-option label="已发布" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建开始：">
            <el-date-picker v-model="search.start_time" type="date" placeholder="请选择" style="width: 200px" />
          </el-form-item>
          <el-form-item label="创建结束：">
            <el-date-picker v-model="search.end_time" type="date" placeholder="请选择" style="width: 200px" />
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
        <span v-if="functionList.includes('A24002')" class="spp-btn spp-btn-primary" @click="addPlan()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A24004')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="检查名称" prop="si_name" />
        <el-table-column label="检查方式" prop="inspection_type" width="120">
          <template slot-scope="scope">{{ inspection_type[scope.row.inspection_type] }}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="170">
          <template slot-scope="scope">{{ scope.row.start_time ? formatDateTime(scope.row.start_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="170">
          <template slot-scope="scope">{{ scope.row.end_time ? formatDateTime(scope.row.end_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="inspection_status" width="100">
          <template slot-scope="scope">{{ scope.row.inspection_status === '1' ? '已发布' : '未发布' }}</template>
        </el-table-column>
        <el-table-column label="参与学校数" prop="school_count" width="120" />
        <el-table-column label="检查项目数" prop="item_count" width="120" />
        <el-table-column label="创建时间" prop="create_time" width="170">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="user_name" />
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A24005')" type="text" :disabled="scope.row.inspection_status === '1'" @click="publish(scope.row.si_id)">发布</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A24003')" :disabled="scope.row.inspection_status === '1'" @click.native="edit(scope.row.si_id)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A24004')" @click.native="del(scope.row.si_id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-steps class="step_class" :active="stepActive" align-center style="margin-bottom: 16px;">
          <el-step title="专项检查信息" />
          <el-step title="检查项目" />
        </el-steps>
        <div v-show="stepActive === 0">
          <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="检查名称" prop="si_name">
              <el-input v-model="form.si_name" placeholder="请输入检查名称" />
            </el-form-item>
            <el-form-item label="检查方式" prop="inspection_type">
              <el-select v-model="form.inspection_type" clearable placeholder="请选择检查方式">
                <el-option v-for="(item, k) in inspection_type" :key="k" :label="item" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="合格分数" prop="inspection_type">
              <el-input v-model="form.pass_score" type="number" placeholder="请输入合格分数" />
            </el-form-item>
            <el-form-item label="开始时间" prop="start_time">
              <el-date-picker v-model="form.start_time" type="datetime" placeholder="选择开始日期" />
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
              <el-date-picker v-model="form.end_time" type="datetime" placeholder="选择结束日期" />
            </el-form-item>
          </el-form>
        </div>
        <div v-show="stepActive === 1">
          <div class="spp-add-btn" @click="addItem">新增检查项目</div>
          <div v-for="(item, k) in stepList" :key="k">
            <div class="plan_step">
              <div class="header">
                <b>{{ item.item_title }}</b>
                <span class="right_del_icon" @click="delStep(item.sii_id)">
                  <svg-icon icon-class="delete" />
                </span>
              </div>
              <el-form label-width="80px">
                <el-form-item class="detail-el-form-item narrow_item" label="项目内容：">
                  {{ item.item_content }}
                </el-form-item>
                <el-form-item class="detail-el-form-item narrow_item" label="项目分值：">
                  {{ item.item_score }}
                </el-form-item>
                <el-form-item class="detail-el-form-item narrow_item" label="评分内容：">
                  {{ item.item_score_standrad }}
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span v-if="stepActive > 0" class="spp-btn" @click="stepPre">上一步</span>
        <span v-if="stepActive < 1" class="spp-btn" @click="stepNext">下一步</span>
        <span v-if="stepActive == 1" class="spp-btn spp-btn-primary" @click="stepFinish">完成</span>
      </div>
    </el-dialog>
    <el-dialog
      title="新增检查项目"
      :visible.sync="showAddItemDialog"
      :close-on-click-modal="false"
      width="480px"
      class="draw_dialog"
    >
      <el-form v-if="showAddItemDialog" ref="checkForm" :model="checkForm" :rules="checkRules" label-width="120px">
        <el-form-item label="检查标题" prop="item_title">
          <el-input v-model="checkForm.item_title" placeholder="请输入检查标题" />
        </el-form-item>
        <el-form-item label="检查内容" prop="item_content">
          <el-input v-model="checkForm.item_content" type="textarea" :rows="4" placeholder="请输入检查内容" />
        </el-form-item>
        <el-form-item label="检查分数" prop="item_score">
          <el-input v-model="checkForm.item_score" type="number" placeholder="请输入检查分数" />
        </el-form-item>
        <el-form-item label="检查标准" prop="item_score_standrad">
          <el-input v-model="checkForm.item_score_standrad" type="textarea" :rows="4" placeholder="请输入检查标准" />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showAddItemDialog=false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="addCheck">提交</span>
      </div>
    </el-dialog>
    <el-dialog
      title="请选择要发布的学校"
      :visible.sync="showPublishDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-transfer v-model="send_school" :data="schoolList" :titles="['学校列表', '已选学校']" filterable filter-placeholder="搜索学校名称" />
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showPublishDialog=false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submitPublish()">发布</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  info_paginate,
  add_inspection,
  getInspectionInfo,
  edit_inspection,
  delete_inspection,
  add_inspection_item,
  delete_inspection_item,
  get_edu_scl,
  publish_inspection
} from '@/api/special_inspection'
import Pagination from '@/components/Pagination'
import { formatDateTime, getDateString, unformatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'SpecialInfo',
  components: { Pagination },
  data() {
    return {
      search: {
        si_name: '',
        inspection_status: '',
        start_time: '',
        end_time: ''
      },
      inspection_type: {
        1: '上级督察',
        2: '学校自查',
        3: '部门联查'
      },
      height: window.innerHeight - 130,
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showPublishDialog: false,
      showAddItemDialog: false,
      dialogTitle: '',
      stepActive: 0,
      detail: {},
      form: {
        id: '',
        si_name: '',
        inspection_type: '',
        pass_score: '',
        start_time: '',
        end_time: ''
      },
      rules: {
        si_name: [
          { required: true, message: '请输入检查名称', trigger: 'blur' }
        ],
        inspection_type: [
          { required: true, message: '请选择检查方式', trigger: 'blur' }
        ],
        pass_score: [
          { required: true, message: '请输入合格分数', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        end_time: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      },
      stepList: [],
      checkForm: {
        item_title: '',
        item_content: '',
        item_score: '',
        item_score_standrad: ''
      },
      checkRules: {
        item_title: [
          { required: true, message: '请输入检查标题', trigger: 'blur' }
        ],
        item_content: [
          { required: true, message: '请输入检查内容', trigger: 'blur' }
        ],
        item_score: [
          { required: true, message: '请输入检查分数', trigger: 'blur' }
        ],
        item_score_standrad: [
          { required: true, message: '请输入检查标准', trigger: 'blur' }
        ]
      },
      schoolList: [],
      send_school: [],
      publish_id: ''
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.height = window.innerHeight - 125
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const search = {
        si_name: this.search.si_name,
        inspection_status: this.search.inspection_status,
        start_time: this.search.start_time ? (getDateString(this.search.start_time, 'yyyyMMdd') + '000000') : '',
        end_time: this.search.end_time ? (getDateString(this.search.end_time, 'yyyyMMdd') + '235959') : ''
      }
      info_paginate(search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    addPlan() {
      Object.assign(this.form, this.$options.data().form)
      this.stepActive = 0
      this.dialogTitle = '新增专项检查'
      this.showDialog = true
    },
    addCheck() {
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          const data = {
            si_id: this.form.id,
            item_title: this.checkForm.item_title,
            item_content: this.checkForm.item_content,
            item_score: this.checkForm.item_score,
            item_score_standrad: this.checkForm.item_score_standrad
          }
          add_inspection_item(data).then(response => {
            getInspectionInfo(this.form.id).then(response => {
              this.stepList = response.data.item_list
              this.showAddItemDialog = false
            })
          })
        } else {
          return false
        }
      })
    },
    delStep(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete_inspection_item(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          getInspectionInfo(this.form.id).then(response => {
            this.stepList = response.data.item_list
          })
        })
      }).catch(() => {})
    },
    edit(id) {
      getInspectionInfo(id).then(response => {
        const detail = response.data
        this.showDialog = true
        this.dialogTitle = '编辑专项检查'
        this.stepActive = 0
        this.form = {
          id: detail.si_id,
          si_name: detail.si_name,
          inspection_type: detail.inspection_type,
          pass_score: detail.pass_score,
          start_time: formatDateTime(detail.start_time),
          end_time: formatDateTime(detail.end_time)
        }
        this.stepList = detail.item_list
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delete_inspection(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? str = str.substring(0, str.length - 1) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_inspection(str).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    publish(id) {
      this.schoolList = []
      get_edu_scl().then(response => {
        const school = response.data
        school.forEach(item => {
          this.schoolList.push({
            key: item.scl_id,
            label: item.scl_name
          })
        })
        this.showPublishDialog = true
        this.publish_id = id
      })
    },
    submitPublish() {
      const scl_id = this.send_school.join(',')
      if (!scl_id) {
        this.$message.error('请选择学校')
        return false
      }
      publish_inspection(this.publish_id, scl_id).then(response => {
        this.showPublishDialog = false
        this.getData()
      })
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    resetForm() {
      this.search = {
        si_name: '',
        inspection_status: '',
        date_range: []
      }
    },
    stepPre() {
      this.stepActive--
    },
    stepNext() {
      if (this.stepActive === 0) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const data = {
              si_name: this.form.si_name,
              inspection_type: this.form.inspection_type,
              start_time: (typeof this.form.start_time === 'string') ? unformatDateTime(this.form.start_time) : getDateString(this.form.start_time, 'yyyyMMddhhmmss'),
              end_time: (typeof this.form.end_time === 'string') ? unformatDateTime(this.form.end_time) : getDateString(this.form.end_time, 'yyyyMMddhhmmss'),
              pass_score: this.form.pass_score
            }
            if (!this.form.id) {
              const result = await add_inspection(data)
              this.form.id = result.data
            } else {
              await edit_inspection(data, this.form.id)
            }
            this.getData()
            this.stepActive++
          }
        })
      }
    },
    stepFinish() {
      this.stepActive = 0
      this.showDialog = false
    },
    addItem() {
      this.showAddItemDialog = true
      Object.assign(this.checkForm, this.$options.data().checkForm)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
