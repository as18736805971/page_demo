<template>
  <div class="app-container page-container right-side-dialog">
    <h3>欢迎欢迎</h3>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'PajxBatchUpdate',
  components: { },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {}
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {},
  created() {
    this.permissionAuth()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {}
  }
}
</script>
<style lang="scss">
</style>
