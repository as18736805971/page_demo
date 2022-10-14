<template>
  <div>
    <div class="common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">风险点名称：</label>
          <el-input v-model="riskidentifyObj.risk_name" placeholder="请输入" />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    categoryObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      riskidentifyObj: {
        risk_category: '',
        risk_name: ''
      }
    }
  },
  created() {},
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.riskidentifyObj,
        this.$options.data().riskidentifyObj
      )
    },
    getData() {
      this.$emit('getData', this.riskidentifyObj)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
