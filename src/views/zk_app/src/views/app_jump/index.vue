<template>
  <section />
</template>

<script>
import { getInfo } from '@/api/user'
import { setToken } from '@/utils/auth'
export default {
  name: 'AppJump',
  data() {
    return {}
  },
  created() {
    this.$store.commit('permission/DEL_FUNCTION_LIST', [])
    this.getInfo()
  },
  methods: {
    getQueryString(name) {
      var reg = new RegExp('(^|&?)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.href.match(reg)
      if (r != null) {
        return unescape(r[2])
      } else {
        return null
      }
    },
    getInfo() {
      const token = this.getQueryString('token')
      setToken(token)
      getInfo(token).then(res => {
        const { data } = res
        if (data) {
          if (data.user_type === '1') {
            this.$router.push('/eduBigScreen')
          } else if (data.user_type === '2') {
            this.$router.push('/schBigScreen')
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
