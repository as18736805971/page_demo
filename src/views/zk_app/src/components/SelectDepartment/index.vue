<template>
  <div>
    <el-cascader
      v-model="dept_id"
      style="width: 100%"
      :options="options"
      clearable
      :show-all-levels="false"
      :props="{ checkStrictly: true }"
      placeholder="请选择部门"
      @change="changeSelected"
    />
  </div>
</template>
<script>
import { getSclDeptList } from '@/api/school_dept'
import { formatDeptTree } from '@/utils/index'
export default {
  model: {
    prop: 'selected',
    event: 'changeSelected'
  },
  props: {
    selected: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      options: [],
      user_data: {},
      dept_id: ''
    }
  },
  created() {
    getSclDeptList().then(response => {
      const data = response.data
      const dept_data = formatDeptTree(data, '0')
      // 组装部门和用户
      this.options = dept_data
      this.dept_id = this.selected
    })
  },
  methods: {
    changeSelected(value) {
      this.$emit('changeSelected', value[value.length - 1])
    }
  }
}
</script>
