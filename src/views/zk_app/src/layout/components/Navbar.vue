<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="navbar-menu">
      <span
        v-for="(item, index) in menus"
        :key="index"
        class="menu-name"
        :class="{ checkmenu: item.checked }"
        @click="choiceMenu(item)"
      >{{ item.menu_name }}</span>
    </div>
    <div class="right-menu">
      <div v-if="user_type === '0'" class="skin-wrapper">
        <svg-icon
          icon-class="switch_sch"
          class="skin-peeler"
          @click="switch_sch"
        />
      </div>
      <div class="skin-wrapper">
        <svg-icon
          icon-class="skin-peeler"
          class="skin-peeler"
          @click="changeSkin"
        />
      </div>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            src="../../assets/images/avatardefault.png"
            class="user-avatar"
          >
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="scl_list.length > 1">
            <span @click="change_role = true">切换角色</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="editPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      v-if="editPasswordVisible"
      title="修改密码"
      :visible.sync="editPasswordVisible"
      :append-to-body="true"
      width="520px"
    >
      <section class="edit-password">
        <el-form
          ref="sendForm"
          :model="sendForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码" prop="old_password">
            <el-input
              v-model="sendForm.old_password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input
              v-model="sendForm.new_password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="sure_password">
            <el-input
              v-model="sendForm.sure_password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <span
              class="spp-btn spp-btn-primary left-btn"
              @click="submitSend"
            >提交</span>
            <span
              class="spp-btn"
              @click="editPasswordVisible = false"
            >取消</span>
          </el-form-item>
        </el-form>
      </section>
    </el-dialog>
    <el-dialog
      v-if="change_role"
      :visible.sync="change_role"
      :append-to-body="true"
      class="change_role_dialog"
      width="520px"
    >
      <div class="title">选择机构</div>
      <div
        v-for="(item, index) in scl_list"
        :key="index"
        class="school"
        :class="{ checkd_role: item.token === choice_token }"
        @click="choice_role(item)"
      >
        <span>{{ item.org_name }}</span>
        <div v-show="item.token === choice_token" class="checkd_role_text">
          当前选中
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Bus from '@/utils/bus'
import { decrypt } from '@/utils/auth'
import { clearscl } from '@/api/user'
export default {
  name: 'Navbar',
  components: {
    Hamburger
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.sendForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      editPasswordVisible: false,
      sendForm: {
        old_password: '',
        new_password: '',
        sure_password: ''
      },
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_password: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        sure_password: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ]
      },
      skin: true,
      change_role: false,
      scl_list: [],
      choice_scl: false,
      choice_token: localStorage.getItem('token')
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'device', 'user_type', 'menus'])
  },
  created() {
    this.menus[0].checked = true
    Bus.$emit('menu', this.menus[0].child)
    if (sessionStorage.getItem('roles')) {
      this.scl_list = JSON.parse(decrypt(sessionStorage.getItem('roles')))
    }
  },
  methods: {
    choiceMenu(item) {
      if (item.menu_url) {
        if (item.menu_type === '1') {
          this.$router.push({ path: item.menu_url })
        } else {
          const router_url = this.$router.resolve({ path: item.menu_url })
          window.open(router_url.href, '_blank')
        }
        return
      }
      this.menus.forEach((opt) => {
        opt.checked = false
      })
      item.checked = true
      Bus.$emit('menu', item.child)
      this.$forceUpdate()
    },
    // 切换角色
    choice_role(item) {
      this.$store.dispatch('user/changeRole').then((res) => {
        this.$store.dispatch('user/setRole', item).then((res) => {
          location.reload()
        })
      })
    },
    // 切换学校
    switch_sch() {
      this.$emit('switch_sch')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    // 退出登录
    async logout() {
      if (this.user_type === '0') {
        clearscl().then((res) => {
          localStorage.removeItem('scl_name')
          this.$store.dispatch('user/logout').then((res) => {
            location.reload()
          })
        })
      } else {
        this.$store.dispatch('user/logout').then((res) => {
          location.reload()
        })
      }
    },

    // 点击修改密码
    editPassword() {
      Object.assign(this.$data.sendForm, this.$options.data().sendForm)
      this.editPasswordVisible = true
    },

    // 提交修改密码
    submitSend() {
      this.$refs.sendForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('user/changePasswd', this.sendForm)
            .then((res) => {
              this.editPasswordVisible = false
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 3000
              })
              if (localStorage.getItem('loginPage')) {
                this.$router.push(
                  `${localStorage.getItem('loginPage')}/login?redirect=${
                    this.$route.fullPath
                  }`
                )
              } else {
                this.$router.push(
                  `/admin/login?redirect=${this.$route.fullPath}`
                )
              }
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },

    changeSkin() {
      this.$emit('changeSkin')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #3399ff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;

  .hamburger-container {
    padding: 0 10px;
    cursor: pointer;
    height: 100%;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .navbar-menu {
    color: #ffffff;
    width: calc(100% - 300px);
    white-space: nowrap;
    display: flex;
    .menu-name {
      cursor: pointer;
      height: 64px;
      line-height: 64px;
      padding: 0 25px;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #ffffff;
      }
    }
    .checkmenu {
      background: rgba(0, 0, 0, 0.1);
      color: #ffffff;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding-left: 10px;
      padding-right: 30px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        font-size: 14px;
        color: #ffffff;
        line-height: 64px;
        height: 64px;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          vertical-align: middle;
          margin-right: 8px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 27px;
          font-size: 12px;
        }
      }
    }

    .skin-wrapper {
      padding: 0 10px;
      .skin-peeler {
        font-size: 22px;
        cursor: pointer;
        height: 64px;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
  .edit-password {
    padding: 0 100px 0 20px;
  }
}
.change_role_dialog {
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
    position: relative;
    &:hover {
      border: 1px solid #3399ff;
    }
  }
  .checkd_role {
    color: #3399ff;
  }
  .checkd_role_text {
    position: absolute;
    top: 0;
    right: 0;
    width: 56px;
    height: 18px;
    background: #3399ff;
    border-radius: 0px 4px 0px 4px;
    font-size: 12px;
    line-height: 18px;
    color: #ffffff;
    text-align: center;
  }
}
</style>
<style lang="scss">
.change_role_dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog .el-dialog__body {
    padding: 0 72px 40px 72px;
  }
}
</style>
