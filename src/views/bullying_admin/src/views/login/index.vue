<template>
  <section class="login-container">
    <img class="bg-left" src="@/assets/images/login-bg-left.png">
    <div class="login-main">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
        <div class="login-logo">
          <img src="../../assets/images/login_logo.png" alt>
        </div>
        <el-form-item prop="account" :class="{'choiceActive': focusStatus.account}">
          <svg-icon class="left-img" icon-class="login_phone" />
          <el-input v-model="loginForm.account" style="padding-right: 95px" name="loginName" type="text" placeholder="请输入手机号" @focus="focusStatus.account=true" @blur="focusStatus.account=false" />
          <span v-show="!time" class="code-text" @click="getVertifyCode">获取验证码</span>
          <span v-show="time" class="code-text code-get-text">{{ time }}秒后重新获取</span>
        </el-form-item>
        <el-form-item prop="sms_code" :class="{'choiceActive': focusStatus.sms_code}">
          <svg-icon class="left-img" icon-class="login_code" />
          <el-input v-model="loginForm.sms_code" name="sms_code" type="text" placeholder="请输入验证码" @focus="focusStatus.sms_code=true" @blur="focusStatus.sms_code=false" @keyup.enter.native="handleLogin()" />
        </el-form-item>
        <el-button :loading="loading" size="medium" class="login_submit" native-type="submit" @click.native.prevent="handleLogin">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
      </el-form>
    </div>
    <!-- <footer class="login-foot" /> -->
  </section>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入手机号'))
      } else {
        const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!reg_tel.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    const smsCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('短信验证码为6位'))
      } else {
        callback()
      }
    }
    return {
      focusStatus: {
        account: false,
        sms_code: false
      },
      loginForm: {
        account: '',
        sms_code: ''
      },
      loginRules: {
        // 登录校验格式
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        sms_code: [{ required: true, trigger: 'blur', validator: smsCode }]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      time: 0,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['model'])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          var data = {
            account: this.loginForm.account,
            sms_code: this.loginForm.sms_code
          }
          httpRequest('/api/login/web/smsCode', data).then(res => {
            sessionStorage.setItem('roles', res.data)
            var roles = JSON.parse(decrypt(res.data))
            if (roles.length > 1) {
              this.$store.dispatch('user/storeRoles', roles).then(res => {
                this.loading = false
                this.$router.push({ path: '/role' })
              }).catch(() => {
                this.loading = false
              })
            } else {
              this.$store.dispatch('user/setRole', roles[0]).then(res => {
                sessionStorage.setItem('role', JSON.stringify(roles[0]))
                httpRequest('/api/login/authWeb', {}).then(auth => {
                  var info = JSON.parse(decrypt(auth.data))
                  this.loading = false
                  if (info.menu[0].menu_url) {
                    this.$router.push({ path: info.menu[0].menu_url })
                  } else if (info.menu[0].child_menu.length !== 0) {
                    this.$router.push({ path: info.menu[0].child_menu[0].menu_url })
                  } else {
                    this.$router.push({ path: '/' })
                  }
                })
              }).catch(() => {
                this.loading = false
              })
            }
          })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击获取验证码
    getVertifyCode() {
      const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!reg_tel.test(this.loginForm.account)) {
        return false
      } else {
        httpRequest('/api/login/sms', {
          account: this.loginForm.account
        }).then(res => {
          this.time = 300
          this.timer = setInterval(this.countDown, 1000)
        })
      }
    },
    // 获取验证码倒计时处理
    countDown() {
      if (this.time <= 0) {
        clearInterval(this.timer)
      } else {
        this.time--
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000000;
$cursor: #939699;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 56px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 56px !important;
      color: #313233;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #313233 !important;
      }
    }
  }

  .el-form-item {
    height: 56px;
    border-radius: 32px;
    background: rgba(147,148,153,0.1);
    color: #454545;
    margin: 0 0 32px 0 !important;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #4968FF;
    }
    &:hover .left-img {
      color: #4968FF;
    }
  }
  .choiceActive {
    border: 1px solid #4968FF;

    .left-img {
      color: #4968FF;
    }
  }
  .login-yzm {
    position: relative;
    .el-form-item {
      width: 146px;
      float: left;
      margin-bottom: 32px;
    }
    .captcha {
      position: absolute;
      right: 0;
      .captcha-img {
        cursor: pointer;
        border-radius: 4px;
        width: 98px;
        height: 38px;
      }
    }
    .el-input {
      width: 100px;
    }
  }
}
</style>
<style lang="scss" scoped>
$light_gray: #fff;

.login-container {
  width: 100%;
  height: 100vh;
  background: url("../../assets/images/login-bg.png") no-repeat center;
  background-size:cover;
  position: relative;
  .bg-left {
    position: absolute;
    width: 598px;
    height: 566px;
    top: 50%;
    left: 50%;
    transform: translate(-90%, -50%);
  }
  .login-main {
    position: absolute;
    width: 572px;
    height: 832px;
    top: 50%;
    right: 48px;
    padding: 114px 80px 190px;
    transform: translate(0, -50%);
    background: rgba(255,255,255,0.90);
    border-radius: 20px;
    box-shadow: 1px 1px 0 0 #ffffff inset;
    backdrop-filter: blur(6px);
  }
  .login-form {
    width: 100%;
    height: 100%;
  }
  .login-logo {
    text-align: center;
    margin-bottom: 103px;
  }
  .login-logo img{
    width: 60%;
  }
  .left-img {
    width: 24px;
    margin-left: 24px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
  .login-wjma {
    text-align: right;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #626466;
    .text {
      cursor: pointer;
    }
  }
  .code-text {
    position: absolute;
    right: 24px;
    cursor: pointer;
    text-align: right;
    font-size: 14px;
    color: #4968FF;
    line-height: 56px;
  }
  .code-get-text {
    color: #939699;
  }
  .login_submit{
    margin-top: 24px;
    width: 100%;
    height: 56px;
    background: #4968ff;
    border-radius: 32px;
    color: #ffffff;
  }

  @media screen and (max-width: 1600px) {
    .login-main {
      width: 470px !important;
      height: 650px !important;
      right: 48px !important;
      padding: 84px 60px 80px !important;
    }
    .login-logo {
      margin-bottom: 73px !important;
    }
  }

  @media screen and (max-height: 800px) {
    .login-main {
      width: 470px !important;
      height: 650px !important;
      right: 48px !important;
      padding: 84px 60px 80px !important;
    }
    .login-logo {
      margin-bottom: 73px !important;
    }
  }

  @media screen and (max-width: 1600px) {
    .bg-left {
      width: 458px !important;
      height: 426px !important;
    }
  }

  @media screen and (max-height: 800px) {
    .bg-left {
      width: 458px !important;
      height: 426px !important;
    }
  }
}
</style>
