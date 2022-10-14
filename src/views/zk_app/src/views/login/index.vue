<template>
  <section class="login-container">
    <section class="login-top">
      <div class="top-center">
        <img src="@/assets/images/login_logo.png" alt class="login-logo">
        <span
          v-if="loginUser === 'eduLogin'"
          class="login-edutext login-common-text"
        >教育局端</span>
        <!-- <span
          v-if="loginUser === 'schLogin'"
          class="login-schtext login-common-text"
        >学校端</span> -->
      </div>
    </section>
    <section
      v-if="!login_status"
      class="login-center"
      :class="{
        'login-edu': loginUser === 'eduLogin',
        'login-sch': loginUser === 'schLogin',
      }"
    >
      <div class="login-main">
        <el-form
          v-if="loginFrame"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <div class="title">系统管理端登录</div>

          <el-form-item
            prop="account"
            :class="{ choiceActive: focusStatus.account }"
          >
            <img
              v-show="!focusStatus.account"
              src="../../assets/images/account-normal.png"
              alt
              class="left-img"
            >
            <img
              v-show="focusStatus.account"
              src="../../assets/images/account-select.png"
              alt
              class="left-img"
            >
            <el-input
              v-model="loginForm.account"
              name="loginName"
              type="text"
              placeholder="账号"
              @focus="focusStatus.account = true"
              @blur="focusStatus.account = false"
            />
          </el-form-item>

          <el-form-item
            prop="password"
            :class="{ choiceActive: focusStatus.pwd }"
          >
            <img
              v-show="!focusStatus.pwd"
              src="../../assets/images/pwd-normal.png"
              alt
              class="left-img"
            >
            <img
              v-show="focusStatus.pwd"
              src="../../assets/images/pwd-select.png"
              alt
              class="left-img"
            >
            <el-input
              v-model="loginForm.password"
              :type="see_password ? 'text' : 'password'"
              name="password"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
              @focus="focusStatus.pwd = true"
              @blur="focusStatus.pwd = false"
            />
            <img v-if="see_password" src="../../assets/images/see.png" class="see_password" @click="see_password = false">
            <img v-if="!see_password" src="../../assets/images/no_see.png" class="see_password" @click="see_password = true">
          </el-form-item>

          <div class="login-yzm">
            <el-form-item
              prop="captcha_val"
              :class="{ choiceActive: focusStatus.captcha }"
            >
              <img
                v-show="!focusStatus.captcha"
                src="../../assets/images/captcha-normal.png"
                alt
                class="left-img"
              >
              <img
                v-show="focusStatus.captcha"
                src="../../assets/images/captcha-select.png"
                alt
                class="left-img"
              >
              <el-input
                v-model="loginForm.captcha_val"
                type="text"
                placeholder="验证码"
                @keyup.enter.native="handleLogin"
                @focus="focusStatus.captcha = true"
                @blur="focusStatus.captcha = false"
              />
            </el-form-item>
            <span class="captcha" @click="refreshCode">
              <img :src="captcha_url" class="captcha-img">
            </span>
            <div style="clear: both" />
          </div>
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <div class="login-wjma">
            <span v-if="loginUser==='insideLogin'" class="switch_sch" @click="switch_sch">切换到校园端</span>
            <span class="text" @click="resetForm">忘记密码？</span>
          </div>
        </el-form>
        <!-- 忘记密码 -->
        <el-form
          v-else
          ref="forgetPwdForm"
          :model="forgetPwdForm"
          :rules="forgetPwdRules"
          class="login-form"
          label-position="left"
        >
          <div class="title">找回密码</div>

          <el-form-item prop="new_password">
            <el-input
              v-model="forgetPwdForm.new_password"
              type="password"
              name="new_password"
              placeholder="请输入新密码"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="sure_password">
            <el-input
              v-model="forgetPwdForm.sure_password"
              type="password"
              name="sure_password"
              placeholder="再次输入新密码"
            />
          </el-form-item>

          <el-form-item prop="wjma_account">
            <el-input
              v-model="forgetPwdForm.wjma_account"
              name="wjma_account"
              type="text"
              placeholder="请输入手机号"
            />
          </el-form-item>

          <el-form-item prop="sms_code" class="vertify-code">
            <el-input
              v-model="forgetPwdForm.sms_code"
              name="sms_code"
              type="text"
              placeholder="请输入手机验证码"
            />
            <span
              v-show="!time"
              class="code-text"
              @click="getVertifyCode"
            >获取验证码</span>
            <span
              v-show="time"
              class="code-text code-get-text"
            >{{ time }}秒后重新获取</span>
          </el-form-item>

          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="confirmChangePwd"
          >确定</el-button>
          <div class="login-wjma">
            <span class="text" @click="resetForm">返回登录</span>
          </div>
        </el-form>
      </div>
    </section>
    <section v-else class="login-choice-role">
      <section class="choice-role-dialog">
        <div class="title">选择机构</div>
        <div
          v-for="(item, index) in scl_list"
          :key="index"
          class="school"
          @click="choice_role(item)"
        >
          {{ item.org_name }}
        </div>
      </section>
    </section>
    <footer class="login-foot" />
  </section>
</template>

<script>
/**
 * 登陆页面
 * */
import md5 from 'js-md5'
import { captcha, getPubKey, getSms, loginUppwd } from '@/api/user'
import { encryptPassword, getRandomKey, encrypt } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入账户'))
      } else {
        if (/^1[0-9]{10}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请填写正确的手机号'))
        }
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入至少6位密码'))
      } else {
        callback()
      }
    }
    const captcha = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码为4位'))
      } else {
        callback()
      }
    }

    const validatePassAgree = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.forgetPwdForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
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
        pwd: false,
        captcha: false
      },
      loginForm: {
        // 登录密码表单
        account: '',
        password: '',
        captcha_val: '',
        captcha_key: ''
      },
      forgetPwdForm: {
        // 忘记密码表单
        new_password: '',
        sure_password: '',
        wjma_account: '',
        sms_code: ''
      },
      loginRules: {
        // 登录校验格式
        account: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha_val: [{ required: true, trigger: 'blur', validator: captcha }]
      },
      forgetPwdRules: {
        // 忘记密码校验格式
        wjma_account: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        new_password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        sure_password: [
          { required: true, trigger: 'blur', validator: validatePassAgree }
        ],
        sms_code: [{ required: true, trigger: 'blur', validator: smsCode }]
      },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      captcha_url: '', // 验证码url
      loginFrame: true, // 登录弹框
      time: 0,
      timer: null,
      loginUser: 'insideLogin',
      login_status: false,
      scl_list: [],
      see_password: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.judgeLogintype()
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.judgeLogintype()
    this.getIndetifyCode()
    this.getPubKey()
  },
  methods: {
    /**
     * 区分用户登录标识
     * * 内部用户登录   insideLogin
     * * 教育局用户登录 eduLogin
     * * 学校用户登录   schLogin
     * */
    judgeLogintype() {
      let url = window.location.href
      if (url.indexOf('?') !== -1) {
        url = url.split('?')[0]
      }
      if (url.indexOf('edu') !== -1) {
        this.loginUser = 'eduLogin'
      } else if (url.indexOf('sch') !== -1) {
        this.loginUser = 'schLogin'
      } else {
        this.loginUser = 'insideLogin'
      }
    },
    // 切换到校园版
    switch_sch() {
      window.location.href = window.location.href.replace(/admin/g, 'sch')
    },
    /**
     * 获取验证码
     * */
    getIndetifyCode() {
      this.captcha_url = captcha(this.getCaptchaKey())
    },

    // 刷新验证码
    refreshCode() {
      this.getIndetifyCode()
    },

    // 获取pub_key
    getPubKey() {
      getPubKey().then((res) => {
        this.$store.commit('user/SET_PUBKEY', res.data.public_key)
      })
    },

    // 登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/' + this.loginUser, this.loginForm)
            .then((res) => {
              this.loading = false
              if (res.data.length > 1) {
                this.login_status = true
                this.scl_list = res.data
              } else {
                this.$store
                  .dispatch('user/setRole', res.data[0])
                  .then((res) => {
                    localStorage.setItem(
                      'loginPage',
                      this.loginUser === 'eduLogin'
                        ? '/edu'
                        : this.loginUser === 'schLogin'
                          ? '/sch'
                          : '/admin'
                    )
                    this.$router.push({
                      path: this.redirect || '/',
                      query: this.otherQuery
                    })
                  })
              }
            })
            .catch(() => {
              this.loading = false
              this.getIndetifyCode()
            })
        }
      })
    },

    choice_role(obj) {
      this.$store.dispatch('user/setRole', obj).then((res) => {
        sessionStorage.setItem('roles', encrypt(JSON.stringify(this.scl_list)))
        localStorage.setItem(
          'loginPage',
          this.loginUser === 'eduLogin'
            ? '/edu'
            : this.loginUser === 'schLogin'
              ? '/sch'
              : '/admin'
        )
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
      })
    },

    // 获取验证码url
    getCaptchaKey() {
      var captcha_key = sessionStorage.getItem('captcha_key')
      if (!captcha_key) {
        captcha_key = md5(
          Date.parse(new Date()).toString() +
            Math.floor(Math.random() * 10000).toString()
        )
        sessionStorage.setItem('captcha_key', captcha_key)
      }
      return captcha_key
    },

    // 登录框和忘记密码框切换
    resetForm() {
      if (this.loginFrame) {
        this.loginFrame = false
        this.$refs['loginForm'].resetFields()
      } else {
        this.loginFrame = true
        this.$refs['forgetPwdForm'].resetFields()
      }
    },

    // 点击获取验证码
    getVertifyCode() {
      const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (!myreg.test(this.forgetPwdForm.wjma_account)) {
        this.$message({
          message: '请填写手机号',
          type: 'error',
          duration: 3000
        })
        return
      }
      getSms(this.forgetPwdForm.wjma_account).then((res) => {
        this.time = 300
        this.timer = setInterval(this.countDown, 1000)
      })
    },

    // 获取验证码倒计时处理
    countDown() {
      if (this.time <= 0) {
        clearInterval(this.timer)
      } else {
        this.time--
      }
    },

    // 确定修改密码
    confirmChangePwd() {
      this.$refs.forgetPwdForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const encrypted_info = encryptPassword(
            getRandomKey(),
            this.forgetPwdForm.new_password,
            this.$store.state.user.pubkey
          )
          loginUppwd(
            this.forgetPwdForm.wjma_account.trim(),
            this.forgetPwdForm.sms_code,
            encrypted_info.aes_password,
            encrypted_info.key
          )
            .then((res) => {
              this.loading = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.resetForm()
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
            })
        }
      })
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
    height: 36px;
    width: 80%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 30px;
      color: #313233;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #313233 !important;
      }
    }
  }

  .el-form-item {
    width: 260px;
    height: 36px;
    border-radius: 5px;
    background: #ffffff;
    border: 1px solid #d3d7db;
    color: #454545;
    margin-bottom: 20px;
    &:hover {
      border: 1px solid #3399ff;
    }
  }
  .choiceActive {
    border: 1px solid #3399ff;
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
  height: 100%;
  background: #ffffff;
  .login-top {
    width: 100%;
    height: 80px;
    position: relative;
    .top-center {
      position: absolute;
      width: 1200px;
      height: 80px;
      left: 50%;
      margin-left: -600px;
      line-height: 80px;
      .login-logo {
        width: 196px;
        height: 38px;
        vertical-align: middle;
      }
      .login-title {
        vertical-align: middle;
        font-size: 24px;
        color: #313233;
        margin-left: 16px;
        font-weight: 500;
      }
      .login-common-text {
        vertical-align: middle;
        display: inline-block;
        text-align: center;
        margin-left: 16px;
        height: 22px;
        line-height: 20px;
        font-size: 16px;
        border-radius: 4px;
      }
      .login-edutext {
        width: 80px;
        color: #3399ff;
        border: 1px solid #3399ff;
        background: #e6f2ff;
      }
      .login-schtext {
        width: 64px;
        color: #4dcd70;
        border: 1px solid #4dcd70;
        background: #def6e4;
      }
    }
  }
  .login-center {
    width: 100%;
    height: 560px;
    background: url("../../assets/images/login-bg.jpg") no-repeat center;
    position: relative;
    .login-main {
      position: absolute;
      width: 1200px;
      left: 50%;
      margin-left: -600px;
      height: 100%;
    }
    .login-form {
      position: absolute;
      right: 0;
      top: 88px;
      max-width: 100%;
      padding: 0 32px 30px 32px;
      background: $light_gray;
      border-radius: 4px;
      .title {
        padding: 40px 0 32px 0;
        font-size: 20px;
        color: #3399ff;
      }
      .left-img {
        width: 14px;
        margin-left: 14px;
        vertical-align: middle;
        position: relative;
        top: -1px;
      }
      .see_password {
        width: 18px;
        margin-left: 14px;
        vertical-align: middle;
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;
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
        .switch_sch {
          position: absolute;
          left: 32px;
          cursor: pointer;
          &:hover {
            color: #3399ff;
          }
        }
      }
      .vertify-code {
        .el-input {
          width: 60%;
        }
        .code-text {
          position: absolute;
          right: 8px;
          cursor: pointer;
          text-align: right;
          font-size: 14px;
          color: #3399ff;
        }
        .code-get-text {
          color: #939699;
        }
      }
    }
  }
  .login-edu {
    background: url("../../assets/images/loginedu-bg.jpg") no-repeat center;
  }
  .login-sch {
    background: url("../../assets/images/loginsch-bg.jpg") no-repeat center;
  }
  .login-foot {
    margin-top: 32px;
    font-size: 12px;
    color: #939699;
    text-align: center;
    letter-spacing: 1px;
  }
}
</style>
<style lang="scss" scoped>
.login-choice-role {
  height: calc(100% - 80px);
  background: #f2f5fb;
  position: relative;
}
.choice-role-dialog {
  width: 624px;
  position: absolute;
  top: 88px;
  left: 50%;
  margin-left: -312px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0 72px 40px 72px;
  .title {
    color: #313233;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 40px 0;
  }
  .school {
    padding: 0 20px;
    height: 64px;
    font-size: 16px;
    line-height: 64px;
    margin-bottom: 24px;
    border: 1px solid #ebf0f5;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      border: 1px solid #3399ff;
    }
  }
}
</style>
