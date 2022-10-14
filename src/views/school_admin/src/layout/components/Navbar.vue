<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img src="@/assets/images/avatardefault.png" class="user-avatar">
          <span>{{ role.user_name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="cutRole()">切换角色</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import { decrypt } from '@/utils/auth'
export default {
  components: {
    Hamburger
  },
  data() {
    return {
      skin: true,
      role: {}
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'model', 'model_menu', 'model_url'])
  },
  mounted() {
    setTimeout(() => {
      this.role = JSON.parse(decrypt(sessionStorage.getItem('login_role')))
    }, 500)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      this.$store.dispatch('user/logout').then((res) => {
        location.reload()
      })
    },
    changeSkin() {
      this.$emit('changeSkin')
    },
    // 切换角色
    cutRole() {
      this.$router.push({
        path: '/role'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #3272ff;
  box-shadow: 0px 1px 3px 0px rgba(44, 46, 51, 0.1);
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

  // .breadcrumb-container {
  //   float: left;
  // }
  .navbar-menu {
    color: #ffffff;
    width: calc(100% - 300px);
    white-space: nowrap;
    display: flex;
    .menu-name {
      cursor: pointer;
      text-align: center;
      font-size: 14px;
      padding: 0 16px;
      color: #fff;
      height: 48px;
      line-height: 48px;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #ffffff;
      }
      .menu-icon {
        width: 20px;
        margin-bottom: 5px;
      }
      .more_model {
        line-height: 44px;
        font-size: 26px;
      }
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
          width: 25px;
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
}
.el-dialog {
  background: #000 !important ;
  .model_col {
    margin: 10px;
    text-align: center;
    padding: 10px 0;
    border-radius: 5px;
    background: rgba(49, 68, 107, 0.5);
    .model_name {
      color: #fff;
      margin-top: 10px;
      background: transparent;
      border-color: transparent;
      width: 90%;
      overflow: hidden;
      padding: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.edit_password {
  .el-form-item {
    margin-bottom: 20px!important;
    &:last-child {
      margin-bottom: 0!important;
    }
  }
}
</style>
<style lang="scss">
</style>
