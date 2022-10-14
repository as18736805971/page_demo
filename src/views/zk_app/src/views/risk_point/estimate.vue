<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">风险点分类：</label>
          <el-select
            v-model="riskestimateObj.risk_type"
            clearable
            placeholder="请选择风险点分类"
          >
            <el-option label="设施风险" value="1" />
            <el-option label="活动风险" value="2" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">风险点名称：</label>
          <el-input v-model="riskestimateObj.risk_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">是否已评估：</label>
          <el-select
            v-model="riskestimateObj.is_estimate"
            clearable
            placeholder="请选择"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
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
    <div class="riskestimate-container spp-no-control">
      <div class="main-body">
        <el-table ref="multipleTable" :data="estimateData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="风险项目" prop="risk_relation_name" />
          <el-table-column label="风险点名称" prop="risk_name" />
          <el-table-column label="风险点位置" prop="building_name" />
          <el-table-column label="风险点分类" prop="risk_type">
            <template slot-scope="scope">{{
              scope.row.risk_type | riskType
            }}</template>
          </el-table-column>
          <el-table-column label="风险评估类型" prop="estimate_type">
            <template slot-scope="scope">
              <span
                v-show="scope.row.estimate_type === '1'"
              >风险矩阵法-1（LS-1）</span>
              <span
                v-show="scope.row.estimate_type === '2'"
              >风险矩阵法-2（LS-2）</span>
              <span
                v-show="scope.row.estimate_type === '3'"
              >作业条件危险性分析法（LEC-1）</span>
              <span
                v-show="scope.row.estimate_type === '4'"
              >作业条件危险性分析法（LEC-2）</span>
            </template>
          </el-table-column>
          <el-table-column label="评估状态" prop="estimate_status">
            <template slot-scope="scope">
              <span v-show="scope.row.estimate_status === '0'">未评估</span>
              <span v-show="scope.row.estimate_status === '1'">已评估</span>
            </template>
          </el-table-column>
          <el-table-column label="风险点等级" prop="risk_rank">
            <template slot-scope="scope">
              <span
                v-show="scope.row.risk_rank === '1'"
                class="risk_label big_risk"
              >重大风险</span>
              <span
                v-show="scope.row.risk_rank === '2'"
                class="risk_label middle_risk"
              >较大风险</span>
              <span
                v-show="scope.row.risk_rank === '3'"
                class="risk_label small_risk"
              >一般风险</span>
              <span
                v-show="scope.row.risk_rank === '4'"
                class="risk_label micro_risk"
              >低风险</span>
            </template>
          </el-table-column>
          <el-table-column label="评估时间" prop="estimate_time">
            <template slot-scope="scope">{{
              scope.row.estimate_time | fgTime
            }}</template>
          </el-table-column>
          <el-table-column label="评估人" prop="estimate_user_name" />
          <el-table-column
            prop="address"
            label="操作"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.estimate_status === '0' &&
                    functionList.includes('A15004')
                "
                class="edit common_text"
                @click="openDialog(scope.row.risk_id)"
              >评估</span>
              <span
                v-if="
                  scope.row.estimate_status === '1' &&
                    functionList.includes('A15004')
                "
                class="edit common_text"
                @click="openDialog(scope.row.risk_id)"
              >重新评估</span>
              <span
                v-if="functionList.includes('A15006')"
                class="edit common_text"
                @click="viewDetail(scope.row.risk_id)"
              >详情</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="riskestimateObj.page_num"
          :limit.sync="riskestimateObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <!-- 详情模态框 -->
    <el-dialog
      v-if="dialogVisible"
      title="风险点评估详情"
      :visible.sync="dialogVisible"
      width="720px"
      class="right-all-content"
    >
      <el-collapse v-model="activeName">
        <el-collapse-item title="风险点详情" name="first">
          <div class="common-item">
            <span
              v-show="riskDetailObj.risk_detail.risk_type === '1'"
              class="title"
            >设施:</span>
            <span
              v-show="riskDetailObj.risk_detail.risk_type === '2'"
              class="title"
            >教学活动:</span>
            <span class="content">{{
              riskDetailObj.risk_detail.risk_relation_name
            }}</span>
          </div>
          <div class="common-item">
            <span class="title">风险名称:</span>
            <span class="content">{{
              riskDetailObj.risk_detail.risk_name
            }}</span>
          </div>
          <div class="common-item">
            <span class="title">风险类型:</span>
            <span class="content">{{
              riskDetailObj.risk_detail.risk_category_name
            }}</span>
          </div>
          <div class="common-item">
            <span class="title">项目潜在风险点:</span>
            <span class="content" v-html="riskDetailObj.risk_detail.potential_risk" />
          </div>
          <div class="common-item">
            <span class="title">可能导致后果:</span>
            <span class="content" v-html="riskDetailObj.risk_detail.risk_result" />
          </div>
          <div class="common-item">
            <span class="title">管控措施:</span>
            <span class="content" v-html="riskDetailObj.risk_detail.control_measure" />
          </div>
          <div class="common-item">
            <span class="title">应急措施:</span>
            <span class="content" v-html="riskDetailObj.risk_detail.emergency_measure" />
          </div>
          <div class="common-item">
            <span class="title">风险依据:</span>
            <span
              class="content"
              v-html="
                riskDetailObj.risk_detail.risk_according
                  ? riskDetailObj.risk_detail.risk_according.replace(
                    /\n/g,
                    '<br>'
                  )
                  : ''
              "
            />
          </div>
        </el-collapse-item>
        <el-collapse-item title="风险点评估内容" name="second">
          <div v-if="riskDetailObj.estimate_detail">
            <div class="risk-detail-title">风险点评估内容</div>
            <div class="common-item">
              <span class="title">评估类型:</span>
              <span
                v-show="riskDetailObj.estimate_detail.estimate_type === '1'"
                class="content"
              >风险矩阵法-1（LS-1）</span>
              <span
                v-show="riskDetailObj.estimate_detail.estimate_type === '2'"
                class="content"
              >风险矩阵法-2（LS-2）</span>
              <span
                v-show="riskDetailObj.estimate_detail.estimate_type === '3'"
                class="content"
              >作业条件危险性分析法（LEC-1）</span>
              <span
                v-show="riskDetailObj.estimate_detail.estimate_type === '4'"
                class="content"
              >作业条件危险性分析法（LEC-2）</span>
            </div>
            <div class="common-item">
              <div class="title">评估详情:</div>
              <div class="content">
                <Matrixarray
                  v-if="riskDetailObj.estimate_detail.estmate_result"
                  :type="
                    parseInt(riskDetailObj.estimate_detail.estimate_type) + 8
                  "
                  :detail-index="
                    JSON.parse(riskDetailObj.estimate_detail.estmate_result)
                  "
                />
              </div>
            </div>
            <div class="common-item">
              <span class="title">生成风险等级:</span>
              <span
                v-show="riskDetailObj.estimate_detail.risk_rank === '1'"
                class="content"
              >重大风险</span>
              <span
                v-show="riskDetailObj.estimate_detail.risk_rank === '2'"
                class="content"
              >较大风险</span>
              <span
                v-show="riskDetailObj.estimate_detail.risk_rank === '3'"
                class="content"
              >一般风险</span>
              <span
                v-show="riskDetailObj.estimate_detail.risk_rank === '4'"
                class="content"
              >低风险</span>
            </div>
            <div class="common-item">
              <span class="title">评估人:</span>
              <span class="content">{{
                riskDetailObj.estimate_detail.estimate_user_name
              }}</span>
            </div>
            <div class="common-item">
              <span class="title">评估时间:</span>
              <span class="content">{{
                riskDetailObj.estimate_detail.estimate_time | fgTime
              }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>

    <el-dialog
      v-if="estimateVisible"
      title="评估"
      :visible.sync="estimateVisible"
      width="720px"
      class="right-noall-content"
      :close-on-click-modal="false"
    >
      <el-steps class="step_class" :active="active" align-center>
        <el-step title="风险点详情" />
        <el-step title="选择评估类型" />
        <el-step title="评估详情" />
        <el-step title="生成风险等级" />
      </el-steps>
      <div v-show="active === 1" class="riskestimate-choice-detail">
        <!-- 风险点详情 -->
        <div class="common-item">
          <span class="title">风险点分类:</span>
          <span class="content">{{
            riskDetailObj.risk_detail.risk_type | riskType
          }}</span>
        </div>
        <div class="common-item">
          <span
            v-show="riskDetailObj.risk_detail.risk_type === '1'"
            class="title"
          >设施:</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_type === '2'"
            class="title"
          >教学活动:</span>
          <span class="content">{{
            riskDetailObj.risk_detail.risk_relation_name
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险名称:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险类型:</span>
          <span class="content">{{
            riskDetailObj.risk_detail.risk_category_name
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">项目潜在风险点:</span>
          <span
            class="content"
            v-html="
              riskDetailObj.risk_detail.potential_risk
                ? riskDetailObj.risk_detail.potential_risk.replace(
                  /\n/g,
                  '<br>'
                )
                : ''
            "
          />
        </div>
        <div class="common-item">
          <span class="title">可能导致后果:</span>
          <span
            class="content"
            v-html="
              riskDetailObj.risk_detail.risk_result
                ? riskDetailObj.risk_detail.risk_result.replace(/\n/g, '<br>')
                : ''
            "
          />
        </div>
        <div class="common-item">
          <span class="title">风险依据:</span>
          <span
            class="content"
            v-html="
              riskDetailObj.risk_detail.risk_according
                ? riskDetailObj.risk_detail.risk_according.replace(
                  /\n/g,
                  '<br>'
                )
                : ''
            "
          />
        </div>
      </div>
      <div v-show="active === 2" class="riskestimate-choice-type">
        <div class="matrix-common">
          <div class="matrix-title">
            <el-radio
              v-model="assessmentType"
              label="5"
            >风险矩阵法（L•S）1</el-radio>
          </div>
          <Matrixarray :type="1" />
        </div>
        <div class="matrix-common">
          <div class="matrix-title">
            <el-radio
              v-model="assessmentType"
              label="6"
            >风险矩阵法（L•S）2</el-radio>
          </div>
          <Matrixarray :type="2" />
        </div>
        <div class="matrix-common">
          <div class="matrix-title">
            <el-radio
              v-model="assessmentType"
              label="7"
            >教学条件危险性分析评价法（LEC-1）</el-radio>
          </div>
          <Matrixarray :type="3" />
        </div>
        <div class="matrix-common">
          <div class="matrix-title">
            <el-radio
              v-model="assessmentType"
              label="8"
            >教学条件危险性分析评价法（LEC-2）</el-radio>
          </div>
          <Matrixarray :type="4" />
        </div>
      </div>
      <Matrixarray
        v-show="active === 3"
        ref="matrixarrayChild"
        :type="parseInt(assessmentType)"
        @getRiskLevel="getRiskLevel"
      />
      <div v-show="active === 4" class="riskestimate-level">
        <div class="title">
          <img
            src="../../assets/images/confirm.png"
            alt
            class="confirm-image"
          >
        </div>
        <div class="text">最终评估风险等级为：</div>
        <div class="level">{{ riskLevel.level }}</div>
        <div class="matrixarray-wrapper">
          <div class="explain">
            <img
              src="../../assets/images/ellipse.png"
              alt
              class="ellipse-image"
            >
            <span style="margin-left: 10px">{{ riskLevel.level }}解释</span>
          </div>
          <Matrixarray
            :type="parseInt(assessmentType) - 4"
            :level-show="true"
            :xaxis="riskLevel.xaxis"
            :yaxis="riskLevel.yaxis"
            class="level-matrix"
          />
        </div>
      </div>
      <div class="dialog-btn riskestimate-btn">
        <span
          v-show="active !== 1"
          class="spp-btn"
          @click="previousStep"
        >上一步</span>
        <span
          v-show="active !== 4"
          class="spp-btn spp-btn-primary"
          @click="nextStep"
        >下一步</span>
        <span
          v-show="active === 4"
          class="spp-btn spp-btn-primary"
          @click="saveRiskestimate"
        >保存</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/components/Pagination'
import Matrixarray from '@/components/Matrixarray'
import {
  riskCategory,
  estimatePaginate,
  gainEstimateDetail,
  riskEstimate
} from '@/api/risk_point'
import { mapGetters } from 'vuex'
export default {
  name: 'Riskestimate',
  components: { Pagination, Matrixarray },
  data() {
    return {
      riskestimateObj: {
        risk_type: '',
        risk_category: '',
        risk_name: '',
        is_estimate: '',
        page_num: 1,
        page_size: 10
      },
      activeName: ['first', 'second'],
      categoryObj: {}, // 风险类型字典
      estimateData: [], // 列表数据List
      total: 0,
      riskDetailObj: {
        risk_detail: {},
        estimate_detail: {}
      }, // 详情数据对象
      dialogVisible: false, // 详情模态框
      estimateVisible: false, // 评估模态框
      active: 1,
      assessmentType: '5',
      riskLevel: {
        level: '',
        xaxis: 0,
        yaxis: 0,
        estmate_result: null
      },
      estimateRisk_id: '' // 当前评估功能点的id
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
    // 获取风险类型
    getCategory() {
      riskCategory().then((res) => {
        this.categoryObj = res.data
      })
    },

    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.riskestimateObj,
        this.$options.data().riskestimateObj
      )
    },

    searchData() {
      this.riskestimateObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      const {
        risk_type,
        risk_category,
        risk_name,
        is_estimate,
        page_num,
        page_size
      } = this.riskestimateObj
      estimatePaginate(
        risk_type,
        risk_category,
        risk_name,
        is_estimate,
        page_num,
        page_size
      ).then((res) => {
        this.estimateData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 查看详情
    viewDetail(risk_id) {
      gainEstimateDetail(risk_id).then((res) => {
        this.riskDetailObj = res.data
        if (this.riskDetailObj.risk_detail.potential_risk && this.isJSON(this.riskDetailObj.risk_detail.potential_risk)) {
          this.riskDetailObj.risk_detail.potential_risk = JSON.parse(this.riskDetailObj.risk_detail.potential_risk).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.risk_result && this.isJSON(this.riskDetailObj.risk_detail.risk_result)) {
          this.riskDetailObj.risk_detail.risk_result = JSON.parse(this.riskDetailObj.risk_detail.risk_result).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.control_measure && this.isJSON(this.riskDetailObj.risk_detail.control_measure)) {
          this.riskDetailObj.risk_detail.control_measure = JSON.parse(this.riskDetailObj.risk_detail.control_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.emergency_measure && this.isJSON(this.riskDetailObj.risk_detail.emergency_measure)) {
          this.riskDetailObj.risk_detail.emergency_measure = JSON.parse(this.riskDetailObj.risk_detail.emergency_measure).replace(/\n/g, '<br>')
        }
        this.dialogVisible = true
      })
    },

    // 打开评估风险点模态框
    openDialog(risk_id) {
      gainEstimateDetail(risk_id).then((res) => {
        this.riskDetailObj = res.data
        this.active = 1
        this.assessmentType = '5'
        this.estimateRisk_id = risk_id
        this.estimateVisible = true
      })
    },

    // 保存评价风险功能点
    saveRiskestimate() {
      riskEstimate(
        this.estimateRisk_id,
        parseInt(this.assessmentType) - 4,
        JSON.stringify(this.riskLevel.estmate_result)
      ).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.estimateVisible = false
        this.getData()
      })
    },

    // 点击下一步
    nextStep() {
      if (this.active === 3) {
        this.$refs.matrixarrayChild.nextTodo()
      }
      if (this.active < 4) {
        this.active++
      }
    },

    // 从子组件获取数据
    getRiskLevel(obj) {
      this.riskLevel = obj
    },

    // 点击上一步
    previousStep() {
      if (this.active > 1) {
        this.active--
      }
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
.riskestimate-filter {
  display: flex;
  justify-content: space-between;
  .filter-left {
    flex: 9;
  }
  .filter-right {
    text-align: right;
    width: 200px;
  }
}
.riskestimate-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebf0f5;
  }
  .common_text {
    font-size: 14px;
    cursor: pointer;
  }
  .edit {
    color: #3399ff;
    margin-left: 10px;
    &:first-of-type {
      margin-left: 0;
    }
  }
}
.riskestimate-btn {
  text-align: right;
  .spp-btn {
    margin-left: 0;
    margin-right: 20px;
  }
}
.riskestimate-choice-type {
  .matrix-common {
    .matrix-title {
      height: 50px;
      line-height: 50px;
    }
  }
}
.riskestimate-choice-detail {
  margin-top: 30px;
}
.riskestimate-level {
  .title {
    height: 148px;
    position: relative;
    .confirm-image {
      width: 68px;
      height: 80px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -40px;
      margin-left: -34px;
    }
  }
  .text,
  .level {
    text-align: center;
  }
  .text {
    color: #939699;
    font-size: 14px;
  }
  .level {
    color: #f75a53;
    font-size: 24px;
    line-height: 60px;
  }
  .matrixarray-wrapper {
    background: rgba(255, 247, 229, 1);
    border: 1px solid rgba(255, 224, 153, 1);
    padding: 20px;
    .explain {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .ellipse-image {
        width: 16px;
      }
    }
  }
}
</style>
