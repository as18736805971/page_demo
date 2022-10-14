<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item v-if="user_type === '1'" label="学校">
            <el-input v-model="search.scl_name" placeholder="请选择" @focus="choiceSchool" />
          </el-form-item>
          <el-form-item label="风险点分类：">
            <el-select v-model="search.risk_type" clearable placeholder="请选择">
              <el-option label="建筑物风险" value="1" />
              <el-option label="活动风险" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="风险点名称：">
            <el-input v-model="search.risk_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="风险点等级：">
            <el-select v-model="search.risk_rank" clearable placeholder="请选择">
              <el-option v-for="(item, k) in risk_level" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="reset">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="riskcontrol-container">
      <div class="main-body risk-list-column">
        <el-table ref="multipleTable" :data="data">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="风险项目" prop="risk_relation_name" />
          <el-table-column label="风险点名称" prop="risk_name" />
          <el-table-column label="风险点位置" prop="building_name" />
          <el-table-column label="风险点分类" prop="risk_type" width="120">
            <template slot-scope="scope">{{ scope.row.risk_type | riskType }}</template>
          </el-table-column>
          <el-table-column label="风险点等级" prop="risk_rank" width="110">
            <template slot-scope="scope">
              <span v-show="scope.row.risk_rank === '1'" class="risk_label big_risk">重大风险</span>
              <span v-show="scope.row.risk_rank === '2'" class="risk_label middle_risk">较大风险</span>
              <span v-show="scope.row.risk_rank === '3'" class="risk_label small_risk">一般风险</span>
              <span v-show="scope.row.risk_rank === '4'" class="risk_label micro_risk">低风险</span>
            </template>
          </el-table-column>
          <el-table-column label="建议措施" prop="control_measures" width="200">
            <template slot-scope="scope">
              <div style="display: flex">
                <div
                  v-for="(item,index) in groupFlag(scope.row.control_measures)"
                  :key="index"
                  style="display: flex;flex-direction:column;align-items: center;margin-right: 15px"
                >
                  <el-tooltip class="item" :content="measures_name[item]" placement="top">
                    <img v-if="item === '1'" src="../../assets/images/manage.png" style="width: 20px">
                  </el-tooltip>
                  <el-tooltip class="item" :content="measures_name[item]" placement="top">
                    <img v-if="item === '2'" src="../../assets/images/emergency.png" style="width: 20px">
                  </el-tooltip>
                  <el-tooltip class="item" :content="measures_name[item]" placement="top">
                    <img v-if="item === '3'" src="../../assets/images/engineering.png" style="width: 20px">
                  </el-tooltip>
                  <el-tooltip class="item" :content="measures_name[item]" placement="top">
                    <img v-if="item === '4'" src="../../assets/images/Train.png" style="width: 20px">
                  </el-tooltip>
                  <el-tooltip class="item" :content="measures_name[item]" placement="top">
                    <img v-if="item === '5'" src="../../assets/images/protection.png" style="width: 20px">
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" fixed="right" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row.risk_id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="search.page_num"
          :limit.sync="search.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      title="风险点详情"
      :visible.sync="dialogVisible"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <RiskDetail v-if="dialogVisible" :risk-detail="riskDetailObj" :risk-id-selected="risk_id_selected" :risk-category="risk_category" @viewEmergencyDetail="viewEmergencyDetail" />
      </el-scrollbar>
    </el-dialog>
    <el-dialog
      title="应急预案详情"
      :visible.sync="showDetailEmergencyDialog"
      width="600px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <EmergencyDetail v-if="showDetailEmergencyDialog" :id="selected_id" :risk-category="risk_category" />
      </el-scrollbar>
    </el-dialog>
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
import {
  riskCategory,
  controlPaginate,
  gainControlDetail
} from '@/api/risk_point'
import { edupaginate } from '@/api/school'
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import EmergencyDetail from '@/components/EmergencyDetail'
import RiskDetail from './components/risk_detail'
import SelectSchool from '@/components/SelectSchool'
import { mapGetters } from 'vuex'
export default {
  name: 'RiskList',
  components: { Pagination, EmergencyDetail, RiskDetail, SelectSchool },
  data() {
    return {
      height: window.innerHeight - 90,
      search: {
        scl_id: '',
        scl_name: '',
        risk_type: '',
        risk_category: '',
        risk_name: '',
        risk_rank: '',
        page_num: 1,
        page_size: 10
      },
      risk_id_selected: '',
      risk_category: {},
      risk_level: {
        1: '重大风险',
        2: '较大风险',
        3: '一般风险',
        4: '低风险'
      },
      control_level: {
        1: '校级',
        2: '部门级',
        3: '组级',
        4: '岗位级'
      },
      risk_way: {
        1: '风险矩阵法-1（LS-1）',
        2: '风险矩阵法-2（LS-2）',
        3: '作业条件危险性分析法（LEC）'
      },
      measures_name: {
        1: '管理措施',
        2: '应急措施',
        3: '工程技术措施',
        4: '培训教育措施',
        5: '个人防护措施'
      },
      data: [],
      total: 0,
      selected_id: '',
      dialogVisible: false,
      showDetailEmergencyDialog: false,
      riskDetailObj: {},
      schoolDialog: false,
      sclList: []
    }
  },
  computed: {
    ...mapGetters(['functionList', 'user_type'])
  },
  async created() {
    if (this.user_type === '1') {
      const { data } = await edupaginate('', 1, 1)
      this.sclList = data.list
      if (data.list.length > 0) {
        this.search.scl_id = data.list[0].scl_id
        this.search.scl_name = data.list[0].scl_name
      }
    }
    this.getCategory()
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getCategory() {
      riskCategory().then(res => {
        this.risk_category = res.data
      })
    },
    searchData() {
      this.search.page_num = 1
      this.getData()
    },
    getData() {
      controlPaginate(
        this.search.scl_id,
        this.search.risk_type,
        this.search.risk_category,
        this.search.risk_name,
        this.search.risk_rank,
        '1',
        this.search.page_num,
        this.search.page_size
      ).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    async getDetail(risk_id) {
      this.risk_id_selected = risk_id
      gainControlDetail(risk_id).then(res => {
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
        this.tabMeasure = '1'
        this.dialogVisible = true
      })
    },
    groupFlag(str) {
      return str ? Array.from(new Set(str.split(','))).sort() : []
    },
    reset() {
      this.search = {
        scl_id: this.sclList[0].scl_id,
        scl_name: this.sclList[0].scl_name,
        risk_type: '',
        risk_category: '',
        risk_name: '',
        risk_rank: '',
        page_num: 1,
        page_size: 10
      }
    },
    viewEmergencyDetail(id) {
      this.selected_id = id
      this.showDetailEmergencyDialog = true
    },
    choiceSchool() {
      this.schoolDialog = true
    },
    selectSchool(data) {
      this.schoolDialog = false
      this.search.scl_id = data.scl_id
      this.search.scl_name = data.scl_name
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
<style lang="scss">
  .risk-list-column {
    .el-table--fit {
      border-radius: 10px;
    }
  }
</style>
<style lang="scss" scoped>
  .risk-list-column {
    border-radius: 10px;
  }
</style>
