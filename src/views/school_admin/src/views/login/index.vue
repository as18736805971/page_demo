<template>
  <section class="login-container">
    <section class="login-center">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="login-main"
        label-position="left"
      >
        <img class="login-logo" src="../../assets/images/login-logo.png">
        <el-form-item prop="account">
          <div class="choice" :class="{ 'choiceActive': focusStatus.account }">
            <svg-icon class="left-img" icon-class="login_user" />
            <el-input v-model="form.account" class="input-txt" placeholder="请输入手机号" @focus="focusStatus.account=true" @blur="focusStatus.account=false" />
          </div>
        </el-form-item>
        <el-form-item prop="sms_code">
          <div class="choice" :class="{ 'choiceActive': focusStatus.sms_code }">
            <svg-icon class="left-img" icon-class="login_sms" />
            <el-input v-model="form.sms_code" class="input-txt" style="width: 90px" placeholder="请输入验证码" @focus="focusStatus.sms_code=true" @blur="focusStatus.sms_code=false" />
            <div v-show="!time" class="get-sms" @click="getVerificationCode()">获取验证码</div>
            <div v-show="time" class="get-sms code-get-text">{{ time }}秒后重新获取</div>
          </div>
        </el-form-item>
        <el-button :loading="loading" class="login-btn" native-type="submit" @click="onSubmit()">登录</el-button>
      </el-form>
    </section>
  </section>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
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
      form: {
        account: '',
        sms_code: ''
      },
      rules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        sms_code: [{ required: true, trigger: 'blur', validator: smsCode }]
      },
      loading: false,
      time: 0,
      timer: null
    }
  },
  methods: {
    // 获取验证码
    getVerificationCode() {
      const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!reg_tel.test(this.form.account)) {
        return false
      } else {
        httpRequest('/api/login/sms', {
          account: this.form.account
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
    // 登录
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          httpRequest('/api/login/web/smsCode', {
            account: this.form.account,
            sms_code: this.form.sms_code
          }).then(res => {
            localStorage.setItem('school_roles', res.data)
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
                httpRequest('/api/login/auth/tea', {}).then(auth => {
                  var info = JSON.parse(decrypt(auth.data))
                  this.loading = false
                  try {
                    if (info.menu[0].menu_url) {
                      this.$router.push({ path: info.menu[0].menu_url })
                    } else if (info.menu[0].child_menu.length !== 0) {
                      this.$router.push({ path: info.menu[0].child_menu[0].menu_url })
                    } else {
                      this.$router.push({ path: '/' })
                    }
                  } catch (err) {
                    this.$router.push({ path: '/' })
                  }
                })
              }).catch(() => {
                this.loading = false
              })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: #ffffff;

  .login-center {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: url("~@/assets/images/login_bg.png") no-repeat center;
    background-size: 100% 100%;

    .login-main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 326px;
      height: 346px;
      padding: 40px 33px 56px;
      background: #FFFFFF;
      box-shadow: 0 4px 8px 0 rgba(71,81,99,0.18);
      border-radius: 10px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .login-logo {
        width: 178px;
        height: 32px;
        margin-bottom: 43px;
      }

      .choice {
        display: flex;
        align-items: center;
        width: 260px;
        height: 34px !important;
        padding: 0 12px 0 8px;
        border-radius: 4px;
        border: 1px solid #D3D7DB;

        .svg-icon {
          width: 14px;
          height: 14px;
          color: #C4C7CC;
          margin-right: 8px;
        }
      }

      .choiceActive {
        border: 1px solid #3272FF;

        .svg-icon {
          color: #3272FF;
        }
      }

      .choice:hover {
        border: 1px solid #3272FF;
      }

      .choice:hover .svg-icon {
        color: #3272FF;
      }

      .get-sms {
        width: 120px;
        height: 34px;
        line-height: 34px;
        font-weight: 400;
        font-size: 14px;
        color: #3272FF;
        letter-spacing: 0;
        text-align: right;
        cursor: pointer;
        margin-left: 6px;
      }

      .code-get-text {
        color: #939699;
      }

      .el-form-item {
        margin: 0 0 24px 0 !important;
      }

      .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
        width: 260px;
        height: 36px;
        background: #3272FF;
        border: 1px solid #3272FF;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        color: #FFFFFF;
      }
    }
  }
}

::v-deep .el-input input {
  height: 36px;
  line-height: 36px !important;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0 !important;
}
</style>
