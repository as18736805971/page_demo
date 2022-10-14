<template>
  <div>
    <el-cascader
      v-model="user_id"
      :options="options"
      clearable
      :props="{ multiple: true }"
      :show-all-levels="false"
      @change="changeSelected"
    />
  </div>
</template>
<script>
import { getSclDeptList } from '@/api/school_dept'
import { getSclUserList } from '@/api/school_user'
export default {
  data() {
    return {
      options: [],
      user_data: {},
      user_id: ''
    }
  },
  async created() {
    const result_dept = await getSclDeptList()
    const dept = result_dept.data
    const result_user = await getSclUserList()
    const user = result_user.data
    user.forEach(item => {
      if (item.dept_id === null) {
        item.dept_id = 'null1'
      }
      const tmp = {
        dept_id: item.user_id,
        parent_id: item.dept_id,
        dept_name: item.user_name,
        is_user: true
      }
      dept.push(tmp)
    })
    // 构建一个未分组部门
    const ungroup = {
      dept_id: 'null1',
      parent_id: '0',
      dept_name: '未分组'
    }
    dept.push(ungroup)
    const dept_data = this.formatDeptTree(dept, '0')
    // 组装部门和用户
    this.options = dept_data
    this.user_id = this.selected
  },
  methods: {
    changeSelected(value) {
      this.$emit('changeSelected', value)
    },
    formatDeptTree(data, parent_id) {
      const tree = []
      data.forEach(e => {
        if (e.dept_id === null) {
          e.dept_id = 'null1'
        }
        if (parent_id === e.parent_id) {
          const tmp = {
            value: e.dept_id,
            label: e.dept_name
          }
          if (!e.hasOwnProperty('is_user')) {
            tmp.children = this.formatDeptTree(data, e.dept_id)
          }
          tree.push(tmp)
        }
      })
      return tree
    }
  }
}
</script>
