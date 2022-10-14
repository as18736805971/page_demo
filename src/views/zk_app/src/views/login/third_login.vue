<template>
  <div>
    <section v-if="login_status" class="login-choice-role">
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
  </div>
</template>

<script>
import { mumu_login } from '@/api/user'
import { encrypt } from '@/utils/auth'
export default {
  name: 'ThirdLogin',
  data() {
    return {
      scl_list: [],
      login_status: false
    }
  },
  mounted() {
    this.mumu_login()
  },
  methods: {
    // 获取风险类型
    mumu_login() {
      mumu_login(this.$route.query.accessToken).then((res) => {
        if (res.data.length > 1) {
          this.login_status = true
          this.scl_list = res.data
        } else {
          this.$store.dispatch('user/setRole', res.data[0]).then((res) => {
            localStorage.setItem('loginPage', '/sch')
            this.$router.push({
              path: this.redirect || '/',
              query: this.otherQuery
            })
          })
        }
      })
    },
    choice_role(obj) {
      this.$store.dispatch('user/setRole', obj).then((res) => {
        sessionStorage.setItem('roles', encrypt(JSON.stringify(this.scl_list)))
        localStorage.setItem('loginPage', '/sch')
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
      })
    }
  }
}
</script>
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
