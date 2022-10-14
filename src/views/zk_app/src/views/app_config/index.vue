<template>
  <div class="app-container page-container">
    <div class="col_bg" style="border-radius: 4px;position:relative; padding-top: 8px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="学校列表" name="first">
          <SchoolList :function-list="functionList" />
        </el-tab-pane>
        <el-tab-pane label="模块管理" name="second">
          <AuthList :function-list="functionList" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import AuthList from './components/auth_list'
import SchoolList from './components/school_list'
import { mapState } from 'vuex'
export default {
  name: 'Notice',
  components: { AuthList, SchoolList },
  data() {
    return {
      activeName: 'first'
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
