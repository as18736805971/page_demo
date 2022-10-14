<template>
  <div>
    <el-cascader
      v-model="user_id"
      style="width: 100%"
      :options="options"
      :props="{ multiple: multiple }"
      clearable
      :show-all-levels="false"
      filterable
      @change="changeSelected"
    />
  </div>
</template>
<script>
import { getSclDeptList } from '@/api/school_dept'
import { getSclUserList } from '@/api/school_user'
import { getHiddenUser } from '@/api/government'
export default {
  model: {
    prop: 'selected',
    event: 'changeSelected'
  },
  props: {
    selected: {
      type: String,
      default: () => ''
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    haveRecommend: {
      type: Boolean,
      default: () => false
    },
    nowHdId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      options: [],
      user_data: {},
      user_id: '',
      temporary: []
    }
  },
  async created() {
    const result_dept = await getSclDeptList()
    const dept = result_dept.data
    const result_user = await getSclUserList()
    const user = result_user.data
    user.forEach((item) => {
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
    if (this.multiple) {
      this.selected.split(',').forEach((item, index) => {
        this.temporary[index] = []
        this.formatUserTree(dept, item, index)
      })
      this.user_id = this.temporary
    } else {
      this.user_id = this.selected
    }

    if (this.haveRecommend) {
      this.options.unshift({
        label: '推荐人选',
        value: '0',
        children: []
      })
    }
    if (this.nowHdId) {
      this.options.unshift({
        label: '推荐人选',
        value: '0',
        children: []
      })
      getHiddenUser(this.nowHdId).then((res) => {
        this.recommend(res.data)
      })
    }
  },
  methods: {
    changeSelected(value) {
      if (!this.multiple) {
        this.$emit('changeSelected', value[value.length - 1])
      } else {
        this.$emit('getCheckuser', value)
      }
    },
    formatDeptTree(data, parent_id) {
      const tree = []
      data.forEach((e) => {
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
    },
    formatUserTree(dept, parent_id, index) {
      dept.forEach((item) => {
        if (item.dept_id === null) {
          item.dept_id = 'null1'
        }
        if (item.dept_id === parent_id) {
          this.temporary[index].unshift(item.dept_id)
          if (item.parent_id !== '0') {
            this.formatUserTree(dept, item.parent_id, index)
          }
        }
      })
    },
    resetUserid() {
      this.user_id = ''
    },
    recommend(userList) {
      const user = []
      userList.forEach((item) => {
        user.push({
          label: item.user_name,
          value: item.user_id
        })
      })
      this.options[0].children = user
      if (userList.length > 0) {
        this.user_id = ['0', userList[0].user_id]
        this.$emit('changeSelected', userList[0].user_id)
      } else {
        this.user_id = ''
        this.$emit('changeSelected', '')
      }
    }
  }
}
</script>
