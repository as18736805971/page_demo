<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container" style="padding-top: 0">
      <div class="riskidentify-crumbs">
        <span
          class="common-nav"
          :class="{crumbscolor: risk_type === 1}"
          @click="changeType(1)"
        >设施风险点</span>
        <span
          class="common-nav"
          :class="{crumbscolor: risk_type === 2}"
          @click="changeType(2)"
        >活动风险点</span>
      </div>
      <div class="common-filter">
        <div class="filter-left">
          <div class="filter-item">
            <label class="label">风险类型：</label>
            <el-select v-model="riskidentifyObj.risk_category" clearable placeholder="请选择">
              <el-option v-for="(item, key) in categoryObj" :key="key" :label="item" :value="key" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="label">风险点名称：</label>
            <el-input v-model="riskidentifyObj.risk_name" placeholder="请输入" />
          </div>
        </div>
        <div class="filter-right">
          <div class="filter-btn">
            <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
            <span class="spp-btn" @click="resetData">重置</span>
          </div>
        </div>
      </div>
    </section>
    <div class="riskidentify-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A32002')"
            class="spp-btn spp-btn-primary"
            @click="openDialog(1)"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
          <span v-if="functionList.includes('A32004')" class="spp-btn" @click="batchDelete">
            <svg-icon icon-class="delete" />
            <span>删除</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="riskidentifyData">
          <el-table-column type="selection" width="55" />>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="风险点名称" prop="risk_name" />
          <el-table-column label="风险点分类" prop="risk_type">
            <template slot-scope="scope">{{ scope.row.risk_type | riskType }}</template>
          </el-table-column>
          <el-table-column label="风险类型" prop="risk_category_name" />>
          <el-table-column label="创建时间" prop="create_time">
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column label="创建人" prop="create_oper_name" />
          <el-table-column prop="address" label="操作" width="130" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="functionList.includes('A32001')"
                type="text"
                @click="viewDetail(scope.row.model_id)"
              >详情</el-button>
              <el-button type="text">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="functionList.includes('A32003')"
                      @click.native="openDialog(2, scope.row.model_id)"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A32004')"
                      @click.native="deleteItem(scope.row.model_id)"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="riskidentifyObj.page_num"
          :limit.sync="riskidentifyObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <!-- 详情模态框 -->
    <el-dialog
      v-if="dialogVisible"
      title="风险点详情"
      :visible.sync="dialogVisible"
      width="720px"
      class="right-all-content riskidentify-detail-content"
    >
      <div class="common-item">
        <span class="title">风险点分类：</span>
        <span class="content">{{ riskDetailObj.risk_type | riskType }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险名称：</span>
        <span class="content">{{ riskDetailObj.risk_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险类型：</span>
        <span class="content">{{ riskDetailObj.risk_category_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">项目潜在风险点：</span>
        <span class="content">{{ riskDetailObj.potential_risk }}</span>
      </div>
      <div class="common-item">
        <span class="title">可能导致后果：</span>
        <span class="content">
          {{ riskDetailObj.risk_result }}
          <br>
        </span>
      </div>
      <div class="common-item">
        <span class="title">风险依据：</span>
        <span class="content">
          {{ riskDetailObj.risk_according }}
          <br>
        </span>
      </div>
    </el-dialog>
    <!-- 新增或者编辑模态框 -->
    <el-dialog
      v-if="showDialog"
      :title="eldialog"
      :visible.sync="showDialog"
      width="720px"
      class="right-noall-content"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="风险名称" prop="risk_name">
          <el-input v-model="ruleForm.risk_name" placeholder="请输入风险名称" />
        </el-form-item>
        <el-form-item label="风险类型" prop="risk_category">
          <el-select v-model="ruleForm.risk_category" multiple clearable placeholder="请选择风险类型">
            <el-option v-for="(item, key) in categoryObj" :key="key" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目潜在风险点" prop="potential_risk">
          <el-input
            v-model="ruleForm.potential_risk"
            type="textarea"
            :rows="4"
            placeholder="请输入项目潜在风险点"
          />
        </el-form-item>
        <el-form-item label="可能导致后果" prop="risk_result">
          <el-input
            v-model="ruleForm.risk_result"
            type="textarea"
            :rows="4"
            placeholder="请输入可能导致后果"
          />
        </el-form-item>
        <el-form-item label="风险依据" prop="risk_according">
          <el-input
            v-model="ruleForm.risk_according"
            type="textarea"
            :rows="4"
            placeholder="请输入风险依据"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-btn riskidentify-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  modelPaginate,
  riskCategory,
  saveModelRisk,
  updateModelRisk,
  deleteModelRisk,
  gainRiskModelDetail
} from '@/api/risk_point'
import { mapGetters } from 'vuex'
export default {
  name: 'Risktemplate',
  components: { Pagination },
  data() {
    return {
      riskidentifyObj: {
        risk_category: '',
        risk_name: '',
        page_num: 1,
        page_size: 10
      },
      risk_type: 1,
      categoryObj: {}, // 风险类型字典
      riskidentifyData: [], // 列表数据List
      riskDetailObj: {}, // 详情数据对象
      total: 0,
      dialogVisible: false, // 详情模态框
      eldialog: '', // 模态框标题
      showDialog: false, // 新增或编辑模态框
      ruleForm: {
        risk_relation_id: '',
        model_name: '',
        risk_name: '',
        risk_category: '',
        potential_risk: '',
        risk_result: '',
        risk_according: ''
      },
      transferSign: {
        sign: '', // 1代表新增  2代表编辑
        Id: ''
      },
      buildingModelList: [], // 设施风险模型列表
      activityModelList: [], // 活动风险模型列表
      rules: {
        risk_name: [
          { required: true, message: '请输入风险名称', trigger: 'blur' }
        ],
        risk_category: [
          { required: true, message: '请选择风险类型', trigger: 'blur' }
        ],
        potential_risk: [
          { required: true, message: '请输入项目潜在风险点', trigger: 'blur' }
        ],
        risk_result: [
          { required: true, message: '请输入可能导致后果', trigger: 'blur' }
        ],
        risk_according: [
          { required: true, message: '请输入风险依据', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
    this.getCategory()
  },
  methods: {
    // 风险分类切换
    changeType(type) {
      this.risk_type = type
      this.getData()
    },

    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.riskidentifyObj,
        this.$options.data().riskidentifyObj
      )
    },

    // 获取风险类型
    getCategory() {
      riskCategory().then(res => {
        this.categoryObj = res.data
      })
    },

    searchData() {
      this.riskidentifyObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      const {
        risk_category,
        risk_name,
        page_num,
        page_size
      } = this.riskidentifyObj
      modelPaginate(
        this.risk_type,
        risk_category,
        risk_name,
        page_num,
        page_size
      ).then(res => {
        this.riskidentifyData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 查看详情
    viewDetail(model_id) {
      gainRiskModelDetail(model_id).then(res => {
        this.riskDetailObj = res.data
        this.dialogVisible = true
      })
    },

    // 批量删除
    batchDelete() {
      let str = ''
      this.$refs.multipleTable.store.states.selection.forEach(item => {
        str += item.model_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },

    // 删除风险点辨识
    deleteItem(Id) {
      this.$confirm('您确定要删除该风险点吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteModelRisk(Id).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    // 重置编辑数据
    resetEditData() {
      this.$refs.ruleForm.resetFields()
    },
    // 新增 或者 编辑教育局信息
    openDialog(sign, id) {
      this.$options.data().ruleForm
      this.transferSign = {
        sign: sign,
        Id: id
      }
      if (sign === 1) {
        if (this.risk_type === 1) {
          this.eldialog = '新增设施风险点'
        } else {
          this.eldialog = '新增活动风险点'
        }
        this.ruleForm = {
          risk_relation_id: '',
          model_name: '',
          risk_name: '',
          risk_category: '',
          potential_risk: '',
          risk_result: '',
          risk_according: ''
        }
        this.showDialog = true
      } else {
        if (this.risk_type === 1) {
          this.eldialog = '编辑设施风险点'
        } else {
          this.eldialog = '编辑活动风险点'
        }
        gainRiskModelDetail(id).then(res => {
          this.ruleForm = res.data
          this.ruleForm.risk_category = this.ruleForm.risk_category.split(',')
          this.showDialog = true
        })
      }
    },

    // 提交编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {
            risk_name,
            risk_category,
            potential_risk,
            risk_result,
            risk_according
          } = this.ruleForm
          if (this.transferSign.sign === 1) {
            // 新增
            saveModelRisk(
              this.risk_type,
              risk_name,
              risk_category.join(','),
              potential_risk,
              risk_result,
              risk_according
            ).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          } else {
            // // 编辑
            updateModelRisk(
              this.transferSign.Id,
              risk_name,
              this.risk_type,
              risk_category.join(','),
              potential_risk,
              risk_result,
              risk_according
            ).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          }
        } else {
          console.log('error submit!!')
        }
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
    font-size: 16px;
    cursor: pointer;
    height: 56px;
    line-height: 56px;
    margin-left: 20px;
  }
  .crumbscolor {
    color: #3399ff;
    border-bottom: 2px solid #3399FF;
  }
}
.riskidentify-btn {
  text-align: right;
}
.riskidentify-detail-content {
  .title {
    width: 112px;
  }
}
</style>
