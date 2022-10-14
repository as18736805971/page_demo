<template>
  <section class="report_body">
    <h1 class="report_title">风险公告</h1>
    <table class="report_table">
      <tr>
        <td class="table_title">风险点位置</td>
        <td class="table_body" :colspan="2">{{ risk_detail.risk_relation_name }}</td>
      </tr>
      <tr>
        <td class="table_title">主要风险因素</td>
        <td class="table_body" colspan="2">{{ risk_detail.potential_risk }}</td>
      </tr>
      <tr>
        <td class="table_title">可能导致的事故类型</td>
        <td class="table_body" colspan="2">{{ risk_detail.risk_category_name }}</td>
      </tr>
      <tr v-for="(item, index) in control_measures" :key="index">
        <td v-if="index === 0" :rowspan="control_measures.length" class="table_title">管控措施</td>
        <td class="table_sub_title">{{ risk_category[item.risk_category] }}</td>
        <td>
          <p v-for="(v, i) in item.measures_content" :key="i">({{ i + 1 }}) {{ v.text }}</p>
        </td>
      </tr>
      <tr v-for="(item, index) in emer_measures" :key="index">
        <td v-if="index === 0" :rowspan="emer_measures.length" class="table_title">应急措施</td>
        <td class="table_sub_title">{{ risk_category[item.risk_category] }}</td>
        <td>
          <p v-for="(v, i) in item.plan_content" :key="i">({{ i + 1 }}) {{ v.text }}</p>
        </td>
      </tr>
      <tr v-for="(item, index) in tech_measures" :key="index">
        <td v-if="index === 0" :rowspan="tech_measures.length" class="table_title">工程技术措施</td>
        <td class="table_sub_title">{{ risk_category[item.risk_category] }}</td>
        <td>
          <p v-for="(v, i) in item.measures_content" :key="i">({{ i + 1 }}) {{ v.text }}</p>
        </td>
      </tr>
      <tr v-for="(item, index) in edu_measures" :key="index">
        <td v-if="index === 0" :rowspan="edu_measures.length" class="table_title">培训教育措施</td>
        <td class="table_sub_title">{{ risk_category[item.risk_category] }}</td>
        <td>
          <p v-for="(v, i) in item.measures_content" :key="i">({{ i + 1 }}) {{ v.text }}</p>
        </td>
      </tr>
      <tr v-for="(item, index) in self_measures" :key="index">
        <td v-if="index === 0" :rowspan="self_measures.length" class="table_title">个人防护措施</td>
        <td class="table_sub_title">{{ risk_category[item.risk_category] }}</td>
        <td>
          <p v-for="(v, i) in item.measures_content" :key="i">({{ i + 1 }}) {{ v.text }}</p>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <img v-for="(item, index) in danger_icon" :key="index" class="icon_img" :src="item.icon_url">
        </td>
      </tr>
    </table>
  </section>
</template>

<script>
import { riskCategory, gainControlDetail, getEmergencyrelation } from '@/api/risk_point'
export default {
  name: 'RiskReport',
  data() {
    return {
      risk_detail: {},
      risk_category: {},
      control_measures: [],
      emer_measures: [],
      tech_measures: [],
      edu_measures: [],
      self_measures: [],
      danger_icon: []
    }
  },
  created() {
    this.getCategory()
    this.init()
  },
  methods: {
    getCategory() {
      riskCategory().then(res => {
        this.risk_category = res.data
      })
    },
    init() {
      const id = this.$route.query.id
      // 使用id获取详情
      gainControlDetail(id).then(res => {
        getEmergencyrelation(id).then(result => {
          this.risk_detail = res.data.risk_detail
          const control_measures = res.data.control_measures
          const emergency_measures = result.data
          control_measures.forEach(item => {
            switch (item.measures_type) {
              case '1':
                item.measures_content = JSON.parse(item.measures_content)
                this.control_measures.push(item)
                break
              case '3':
                item.measures_content = JSON.parse(item.measures_content)
                this.tech_measures.push(item)
                break
              case '4':
                item.measures_content = JSON.parse(item.measures_content)
                this.edu_measures.push(item)
                break
              case '5':
                item.measures_content = JSON.parse(item.measures_content)
                this.self_measures.push(item)
                break
            }
          })
          emergency_measures.forEach(item => {
            item.plan_content = JSON.parse(item.plan_content)
            this.emer_measures.push(item)
          })
          this.danger_icon = res.data.danger_icon
        })
      })
    }
  }
}
</script>
<style lang="scss">
.report_body{
  max-width: 800px;
  margin:auto;
  .report_title{
    background: red;
    color: #fff;
    text-align: center;
    line-height: 64px;
  }
  .report_table {
    width: 100%;
    border-collapse:collapse;
    border: 1px solid #000000;
    td {
      border-collapse:collapse;
      border: 1px solid #000;
      padding: 8px;
    }
    .table_title {
      width: 120px;
      text-align: center;
      vertical-align: middle;
    }
    .table_sub_title {
      width: 100px;
      text-align: center;
      vertical-align: middle;
    }
    .icon_img {
      margin-left: 8px;
      width: 120px;
    }
  }
}
</style>
