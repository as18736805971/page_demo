<template>
  <div>
    <div class="detailtab_wrapper">
      <el-radio-group v-model="detailTab">
        <el-radio-button
          v-for="(item, k) in detailtab_name"
          :key="k"
          :label="k"
        >{{ item }}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="detailTab === '1'" class="detail_wrapper">
      <div class="common-item">
        <span class="title">风险项目:</span>
        <span class="content">{{
          riskDetail.risk_detail.risk_relation_name
        }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险名称:</span>
        <span class="content">{{ riskDetail.risk_detail.risk_name }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险类型:</span>
        <span class="content">{{
          riskDetail.risk_detail.risk_category_name
        }}</span>
      </div>
      <div class="common-item">
        <span class="title">项目潜在风险点:</span>
        <span class="content" v-html="riskDetail.risk_detail.potential_risk" />
      </div>
      <div class="common-item">
        <span class="title">可能导致后果:</span>
        <span class="content" v-html="riskDetail.risk_detail.risk_result" />
      </div>
      <div class="common-item">
        <span class="title">管控措施:</span>
        <span class="content" v-html="riskDetail.risk_detail.control_measure" />
      </div>
      <div class="common-item">
        <span class="title">应急措施:</span>
        <span class="content" v-html="riskDetail.risk_detail.emergency_measure" />
      </div>
      <div class="common-item">
        <span class="title">风险依据:</span>
        <span class="content">{{ riskDetail.risk_detail.risk_according }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险评估类型:</span>
        <span class="content">{{
          risk_way[riskDetail.risk_detail.estimate_type]
        }}</span>
      </div>
      <div class="common-item">
        <span class="title">风险等级:</span>
        <span class="content">{{
          risk_level[riskDetail.risk_detail.risk_rank]
        }}</span>
      </div>
    </div>
    <div v-if="detailTab === '2'" class="detail_wrapper">
      <div class="common-item">
        <span class="title">管理层级:</span>
        <span class="content">
          <span>{{ control_level[riskDetail.risk_detail.control_level] }}</span>
        </span>
      </div>
      <div class="common-item">
        <span class="title">责任部门:</span>
        <span class="content">{{
          riskDetail.risk_detail.responsible_dept_name
        }}</span>
      </div>
      <div class="common-item">
        <span class="title">责任人:</span>
        <span class="content">{{
          riskDetail.risk_detail.responsible_man_name
        }}</span>
      </div>
      <div class="common-item">
        <span class="title">警示标志:</span>
        <div class="warnsign-wrapper">
          <div
            v-for="(opt, index) in riskDetail.danger_icon"
            :key="index"
            class="sign-item"
          >
            <el-image
              fit="fill"
              class="sign-image"
              :src="down_url + '/' + opt.icon_url"
              @click="see_pic(down_url + '/' + opt.icon_url)"
            />
          </div>
        </div>
      </div>
      <div class="common-item">
        <span class="title">剩余风险:</span>
        <span class="content">{{ riskDetail.risk_detail.remaining_risk }}</span>
      </div>
    </div>
    <div v-if="detailTab === '3'" class="detail_wrapper">
      <MeasureTab
        :selected-id="riskIdSelected"
        :risk-category="riskCategory"
        @viewEmergencyDetail="viewEmergencyDetail"
      />
    </div>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[pic_url]"
      style="z-index: 2000"
    />
  </div>
</template>
<script>
import MeasureTab from '@/components/MeasureTab'
import { mapState } from 'vuex'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'RiskDetail',
  components: { MeasureTab, ElImageViewer },
  props: {
    riskDetail: {
      type: Object,
      default: () => {}
    },
    riskIdSelected: {
      type: String,
      default: () => ''
    },
    riskCategory: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: ['first', 'second', 'third'],
      showViewer: false,
      pic_url: [],
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
      risk_category: this.riskCategory,
      detailTab: '1',
      detailtab_name: {
        1: '风险点详情',
        2: '基本信息',
        3: '管控信息'
      },
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.risk_category['0'] = '通用风险'
  },
  methods: {
    see_pic(url) {
      this.pic_url = url
      this.showViewer = true
    },
    closeViewer: function() {
      this.showViewer = false
    },
    viewEmergencyDetail: function(id) {
      this.$emit('viewEmergencyDetail', id)
    }
  }
}
</script>
<style lang="scss" scoped>
.warnsign-wrapper {
  display: flex;
  flex-wrap: wrap;
  .sign-image {
    width: 122px;
    height: 162px;
  }
}
.sign-item {
  position: relative;
  margin-right: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 4px;
}
.detail_wrapper {
  margin-top: 30px;
}
</style>
<style lang="scss">
.detailtab_wrapper {
  .el-radio-group {
    width: 100%;
  }
  .el-radio-button {
    width: 33.3%;
  }
  .el-radio-button--medium .el-radio-button__inner {
    width: 100%;
  }
}
</style>
