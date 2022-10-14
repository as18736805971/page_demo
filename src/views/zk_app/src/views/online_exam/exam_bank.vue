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
          <el-form-item label="试题类型：">
            <el-select
              v-model="search.ques_type"
              clearable
              placeholder="请选择"
            >
              <el-option label="单选题" value="1" />
              <el-option label="多选题" value="2" />
              <el-option label="是非题 " value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目名称：">
            <el-input
              v-model="search.ques_title"
              placeholder="请输入题目名称"
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
      <div class="left">
        <span
          v-if="functionList.includes('A48001')"
          class="spp-btn spp-btn-primary"
          @click="addExam()"
        >
          <svg-icon icon-class="add" />新增试题
        </span>
        <span
          v-if="functionList.includes('A48002')"
          class="spp-btn"
          @click="editExam()"
        >
          <svg-icon icon-class="edit" />编辑
        </span>
        <span
          v-if="functionList.includes('A48003')"
          class="spp-btn"
          @click="delBatch()"
        >
          <svg-icon icon-class="delete" />删除
        </span>
      </div>
    </div>
    <div class="main-body">
      <div v-if="data.length > 0" class="exam_collapse">
        <el-collapse accordion>
          <el-collapse-item v-for="(item, index) in data" :key="index">
            <template slot="title">
              <el-checkbox v-model="item.checked" />
              <span
                v-if="item.ques_type === '1'"
                class="exam_collapse_type exam_collapse_type_1"
              >单选题</span>
              <span
                v-if="item.ques_type === '2'"
                class="exam_collapse_type exam_collapse_type_2"
              >多选题</span>
              <span
                v-if="item.ques_type === '3'"
                class="exam_collapse_type exam_collapse_type_3"
              >是非题</span>
              <span class="exam_collapse_title">{{ item.ques_title }}</span>
            </template>
            <div class="exam_collapse_content">
              <div
                v-for="(opt, key) in JSON.parse(item.option_answer)"
                :key="key"
              >
                {{ opt.option }}：{{ opt.text }}
              </div>
              <div>
                <span>答案：</span>
                <span style="color: #3399ff">{{ item.real_answer }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else class="exam_bank_nodata">暂无数据</div>

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
        <el-form-item label="试题类型" prop="ques_type">
          <el-select
            v-model="ruleForm.ques_type"
            clearable
            placeholder="请选择试题类型"
            @change="selectChange"
          >
            <el-option label="单选题" value="1" />
            <el-option label="多选题" value="2" />
            <el-option label="是非题 " value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="试题名称" prop="ques_title">
          <el-input
            v-model="ruleForm.ques_title"
            type="textarea"
            :rows="4"
            placeholder="请输入试题名称 "
          />
        </el-form-item>
        <el-form-item label="答案选项" prop="option_answer">
          <AnswerOption v-model="ruleForm.option_answer" />
        </el-form-item>
        <el-form-item label="正确答案" prop="real_answer">
          <el-select
            v-model="ruleForm.real_answer"
            clearable
            :multiple="multiple"
            placeholder="请选择正确答案"
          >
            <el-option
              v-for="(item, k) in ruleForm.option_answer"
              :key="k"
              :label="item.option"
              :value="item.option"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { paginate, saveExam, updateExam, delExam } from '@/api/exam_bank'
import Pagination from '@/components/Pagination'
import AnswerOption from '@/components/AnswerOption'
import { mapState } from 'vuex'
export default {
  name: 'ExamBank',
  components: { Pagination, AnswerOption },
  data() {
    return {
      search: {
        ques_title: '',
        ques_type: ''
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      multiple: false,
      dialogTitle: '',
      ruleForm: {
        bank_id: '',
        ques_title: '',
        ques_type: '',
        real_answer: null,
        option_answer: []
      },
      rules: {
        ques_title: [
          { required: true, message: '请输入试题名称', trigger: 'blur' }
        ],
        ques_type: [
          { required: true, message: '请选择试题类型', trigger: 'blur' }
        ],
        real_answer: [
          { required: true, message: '请选择正确答案', trigger: 'blur' }
        ],
        option_answer: [
          { required: true, message: '请输入答案选项', trigger: 'blur' }
        ]
      }
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
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const { ques_title, ques_type } = this.search
      this.data = []
      paginate(ques_type, ques_title, this.page, this.page_size).then((res) => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    addExam() {
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
      this.showDialog = true
      this.dialogTitle = '新增试题'
    },
    editExam(id) {
      const bank_id_array = []
      this.data.forEach((item) => {
        if (item.checked) {
          bank_id_array.push(item)
        }
      })
      if (bank_id_array.length === 1) {
        this.ruleForm = {
          bank_id: bank_id_array[0].bank_id,
          ques_title: bank_id_array[0].ques_title,
          ques_type: bank_id_array[0].ques_type,
          real_answer: bank_id_array[0].real_answer,
          option_answer: JSON.parse(bank_id_array[0].option_answer)
        }
        if (this.ruleForm.ques_type === '2') {
          this.multiple = true
          this.ruleForm.real_answer = JSON.parse(
            JSON.stringify(this.ruleForm.real_answer.split(','))
          )
        } else {
          this.multiple = false
        }
        this.showDialog = true
        this.dialogTitle = '编辑试题'
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一项要编辑的数据'
        })
      }
    },
    delBatch() {
      const bank_id_array = []
      this.data.forEach((item) => {
        if (item.checked) {
          bank_id_array.push(item.bank_id)
        }
      })
      if (bank_id_array.length > 0) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delExam(bank_id_array.join(',')).then((response) => {
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
      if (!this.ruleForm.bank_id) {
        // 新增
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const {
              ques_type,
              ques_title,
              option_answer,
              real_answer
            } = this.ruleForm
            saveExam(
              ques_type,
              ques_title,
              JSON.stringify(option_answer),
              ques_type === '2' ? real_answer.sort().join(',') : real_answer
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
              ques_type,
              ques_title,
              option_answer,
              real_answer
            } = this.ruleForm
            updateExam(
              this.ruleForm.bank_id,
              ques_type,
              ques_title,
              JSON.stringify(option_answer),
              ques_type === '2' ? real_answer.sort().join(',') : real_answer
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
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    selectChange(value) {
      if (value === '2') {
        if (this.ruleForm.real_answer) {
          this.ruleForm.real_answer = this.ruleForm.real_answer.split(',')
        } else {
          this.ruleForm.real_answer = []
        }
        this.multiple = true
      } else {
        this.ruleForm.real_answer = null
        setTimeout(() => {
          this.multiple = false
        }, 10)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.exam_collapse {
  border-bottom: 1px solid #e1e3e6;
  .exam_collapse_content {
    padding: 5px 0 5px 26px;
  }
  .exam_collapse_type {
    font-size: 12px;
    padding: 3px 6px;
    border-radius: 2px;
    margin-left: 16px;
    margin-right: 8px;
  }
  .exam_collapse_type_1 {
    color: #3399ff;
    border: 1px solid #3399ff;
  }
  .exam_collapse_type_2 {
    color: #ff8a65;
    border: 1px solid #ff8a65;
  }
  .exam_collapse_type_3 {
    color: #4dcd70;
    border: 1px solid #4dcd70;
  }
  .exam_collapse_title {
    color: #313233;
    font-size: 14px;
    line-height: 25px;
    width: calc(100% - 110px);
  }
}
.exam_bank_nodata {
  line-height: 60px;
  color: #909399;
  border-bottom: 1px solid #e1e3e6;
  text-align: center;
  font-size: 14px;
}
</style>
<style lang="scss">
.exam_collapse {
  .el-collapse {
    border: none;
  }
  .el-collapse .el-collapse-item__header {
    background: #fff;
    height: auto;
    line-height: 14px;
    padding: 19px 16px;
  }
  .el-collapse .el-collapse-item__wrap {
    background: #f7f9fc;
    padding-top: 0;
  }
  .el-collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
