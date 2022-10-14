<template>
  <div style="text-align:center;margin-top:300px;">
    <img src="../../assets/images/loading.gif">
    <p style="color: #999;font-size: 16px;">登陆中，请稍候</p>
  </div>
</template>
<script>
import { getLoginCode } from '@/api/pajx'
export default {
  name: 'PAJX',
  data() {
    return {}
  },
  created() {
    getLoginCode().then(response => {
      const code = response.data.spp_code
      window.location.href = process.env.VUE_APP_PAJX_ATT_URL + '/code=' + code
    })
  }
}
</script>
