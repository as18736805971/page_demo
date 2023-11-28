<template>
  <div>
    <el-form ref="loginForm" label-position="left">
      <el-form-item prop="account">
        <el-input v-model="form.account" type="text" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="sms_code">
        <el-input v-model="form.sms_code" type="text" placeholder="请输入验证码" />
      </el-form-item>
      <el-button @click="handleLogin()">登录</el-button>
      <el-button type="primary" @click="handleSms()">获取验证码</el-button>
      <el-button type="primary" @click="handleAuth()">获取权限</el-button>
    </el-form>
  </div>
</template>

<script>
import { routePath } from '@/utils'
import { decrypt } from '@/utils/auth'
import {authWeb, getCode, getSms} from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      form: {
        account: '13200000001',
        sms_code: '000000'
      }
    }
  },
  methods: {
    handleSms() {
      getSms({
        account: this.form.account
      }).then((res) => {
        console.log(res, '4444')
      })
    },
    handleLogin() {
      getCode(this.form).then((res) => {
        localStorage.setItem('role_group', res.data)
        const roles = JSON.parse(decrypt(res.data))
        if (roles.length > 1) {
          this.$router.push({ path: '/role' })
        } else {
          this.$store.dispatch('user/setUser', roles[0]).then(() => {
            authWeb().then((res) => {
              console.log(res)
            })
          })
        }
      })
    },
    handleAuth() {
      authWeb().then((res) => {
        console.log(res)
        const auth = res.data
        // const path = routePath(auth.menu) || '/'
        console.log(path, '地址')
        // setTimeout(() => {
        //   this.$router.push({ path: path })
        // }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
