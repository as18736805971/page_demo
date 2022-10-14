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
        <img class="login-logo" src="../assets/login-logo.png">
        <el-form-item prop="account">
          <div class="choice" :class="{ 'choiceActive': focusStatus.account }">
            <template v-if="focusStatus.account">
              <img class="left-img" src="../assets/login_user_select.png">
            </template>
            <template v-else>
              <img class="left-img" src="../assets/login_user.png">
            </template>
            <el-input v-model="form.account" class="input-txt" placeholder="请输入手机号" @focus="focusStatus.account=true" @blur="focusStatus.account=false" />
          </div>
        </el-form-item>
        <el-form-item prop="sms_code">
          <div class="choice" :class="{ 'choiceActive': focusStatus.sms_code }">
            <template v-if="focusStatus.sms_code">
              <img class="left-img" src="../assets/login_sms_select.png">
            </template>
            <template v-else>
              <img class="left-img" src="../assets/login_sms.png">
            </template>
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
import { decrypt, httpRequest, setToken } from '@/utils/auth'
export default {
  name: 'PageLogin',
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
    countDown() {
      if (this.time <= 0) {
        clearInterval(this.timer)
      } else {
        this.time--
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          httpRequest('/api/login/web/smsCode', {
            account: this.form.account,
            sms_code: this.form.sms_code
          }).then((res) => {
            const roles = JSON.parse(decrypt(res.data))
            localStorage.setItem('audio', true)
            localStorage.setItem('audio_num', 10)
            setToken(roles[0].token)
            httpRequest('/api/login/user/info', {}).then((ret) => {
              const info = JSON.parse(decrypt(ret.data))
              httpRequest('/api/sys/school/schoolInfo', {
                sclId: info.scl_id
              }).then((ret) => {
                const type = JSON.parse(decrypt(ret.data))
                localStorage.setItem('equ_type', Number(type.equ_apply_type))
                this.loading = false
                if (Number(type.equ_apply_type) === 0) {
                  this.$router.push({ path: '/audio_index' })
                } else {
                  if (type.video_formart) {
                    if (Number(type.video_formart) === 0) {
                      this.$router.push({ path: '/screen_index' })
                    } else {
                      this.$router.push({ path: '/screen_rtsp' })
                    }
                  } else {
                    this.$router.push({ path: '/screen_rtsp' })
                  }
                }
              })
            })
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

<style>
.login-container {
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.login-container .login-center {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/login_bg.gif") no-repeat center;
  background-size: 100% 100%;
}

.login-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 346px;
  background: #FFFFFF;
  box-shadow: 0 4px 8px 0 rgba(71,81,99,0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.login-logo {
  width: 178px;
  height: 30px;
  margin-top: 40px;
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
}

.choice .left-img {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.choiceActive {
  border: 1px solid #3272FF;
}

.get-sms {
  width: 142px;
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
  width: 282px;
  height: 36px;
  background: #3272FF !important;
  border: 1px solid #3272FF !important;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #FFFFFF !important;
}

.el-input input {
  height: 36px;
  line-height: 36px !important;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0 !important;
}

.el-button:hover {
  color: #FFFFFF;
  border-color: #3272FF;
  background-color: #3272FF;
}
</style>
