<template>
  <div class="navbar">
    <div class="navbar-menu small-scrollbarx">
      <!-- <span class="spp-btn">返回</span> -->
      <div id="select_menu" />
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/images/avatardefault.png" class="user-avatar">
          <span>{{ role.user_name }}</span>
          <img src="@/assets/images/up.png" class="el-icon-caret-bottom">
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="cutRole">切换角色</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-badge :value="888" :max="99" class="right-icon">
        <img class="message-icon" src="../../assets/images/message.png">
      </el-badge>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { decrypt } from '@/utils/auth'
export default {
  data() {
    return {
      skin: true,
      menus: [],
      more_menus: [],
      role: {},
      select_model_id: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'model', 'model_menu', 'model_url', 'user_info'])
  },
  mounted() {
    setTimeout(() => {
      var login_role = sessionStorage.getItem('login_role')
      this.role = JSON.parse(decrypt(login_role))
    }, 500)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      this.$store.dispatch('user/logout').then(res => {
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
  height: 63px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px 0 16px;

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
    color: #323338;
    width: calc(100% - 300px);
    white-space: nowrap;
    display: flex;
    align-items: center;
    //margin-left: 16px;

    #select_menu {
      font-weight: 500;
      font-size: 20px;
    }

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
    //position: absolute;
    //right: 0;
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
        color: #323338;
        line-height: 64px;
        height: 64px;
        margin-right: 24px;

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
          width: 12px;
          height: 12px;
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

    .right-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      .message-icon {
        width: 22px;
        height: 22px;
        cursor: pointer;
      }

      ::v-deep .el-badge__content {
        line-height: 17px !important;
      }
    }
  }
  // .edit-password {
  //   padding: 0 100px 0 20px;
  // }
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
</style>
<style>
/* .el-dialog {
  background: rgba(49, 68, 107, 0.9);
}
.el-dialog .el-dialog__header {
  border-color: transparent;
}
.el-dialog__body {
  position: relative;
  bottom: 30px;
} */
</style>
