<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="main_menu_view">
      <div class="logo_view">
        <img src="@/assets/images/logo.png">
      </div>
      <div v-for="(item, index) in menus" :key="index" @click="choiceMenu(item)">
        <div v-if="select_model_id == item.model_id" class="menu_view_active">
          <div class="menu_icon_view">
            <svg-icon :icon-class="item.model_icon" />
          </div>
          <div>{{ item.model_name }}</div>
        </div>
        <div v-else class="menu_view">
          <div class="menu_icon_view">
            <svg-icon :icon-class="item.model_icon" />
          </div>
          <div>{{ item.model_name }}</div>
        </div>
      </div>
    </div>
    <sidebar v-show="menu && menu.length > 0" ref="sidebar" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView, 'main_not_container' : menu.length === 0 }" class="main-container">
      <div :class="{'fixed-header':fixedHeader, 'fixed-not-header': menu.length === 0 }">
        <navbar @changeSkin="changeSkin" />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import Bus from '@/utils/bus'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar
  },
  mixins: [ResizeMixin],
  data() {
    return {
      skin: true,
      menu: [],
      menus: [],
      more_menus: [],
      select_model_id: '',
      select_menu_info: {}
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        // openSidebar: this.sidebar.opened,
        hideSidebar: false,
        openSidebar: false,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    ...mapGetters(['sidebar', 'device', 'model', 'model_menu', 'model_url'])
  },
  mounted() {
    var path = this.$route.path.substr(1)
    for (var item in this.model_menu) {
      this.model_menu[item].map((vv) => {
        if (vv.menu_url === path) {
          this.select_menu_info = vv
          this.select_menu_info.select_model_id = item
        }
      })
    }
    this.model.map((item) => {
      if (this.select_menu_info.menu_pid) {
        if (item.menu_id === this.select_menu_info.menu_pid) {
          this.select_menu_info.sidebar_title = item.menu_name
        }
      } else {
        if (item.menu_url === path) {
          this.select_menu_info.select_model_id = item.menu_id
          this.select_menu_info.menu_name = item.menu_name
        }
      }
    })
    this.select_model_id = this.select_menu_info.select_model_id
    this.formatTopMenus(this.select_menu_info.select_model_id)
    document.getElementById('sidebar_title').innerHTML = this.select_menu_info.sidebar_title || '默认页'
    document.getElementById('select_menu').innerHTML = this.select_menu_info.menu_name || '默认页'
    const menu = this.model_menu[this.select_model_id]
    this.menu = menu || []
    Bus.$emit('menu', menu)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    changeSkin() {
      this.$refs.sidebar.changeSkin()
    },
    formatTopMenus(selected_id) {
      this.model.forEach(item => {
        const tmp = {
          model_id: item.menu_id,
          model_name: item.menu_name,
          menu_url: item.menu_url,
          model_icon: item.menu_icon,
          child_menu: item.child_menu,
          checked: item.model_id === selected_id
        }
        this.menus.push(tmp)
      })
    },
    choiceMenu(item) {
      this.model.forEach(model => {
        model.checked = false
      })
      var select_menu = {
        select_model_id: item.model_id,
        sidebar_title: item.model_name,
        select_menu: item.child_menu.length > 0 ? item.child_menu[0].menu_name : item.model_name
      }
      this.select_model_id = select_menu.select_model_id
      const menu = this.model_menu[this.select_model_id]
      this.menu = menu || []
      Bus.$emit('menu', menu)
      item.checked = true
      document.getElementById('sidebar_title').innerHTML = select_menu.sidebar_title
      document.getElementById('select_menu').innerHTML = select_menu.select_menu
      if (menu) {
        this.$router.push({
          path: menu[0].menu_url ? '/' + menu[0].menu_url : 'admin/home/home'
        })
      } else {
        this.$router.push({
          path: item.menu_url ? '/' + item.menu_url : 'admin/home/home'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.main-container{
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: $sideBarWidth + 68;
  position: relative;
  background-color: #f0f2f5 !important;
}

.main_not_container {
  margin-left: $sideBarWidth - 151;
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth + 69});
  transition: width 0.28s;
  border-bottom: 1px solid #E1E3E6;
}

.fixed-not-header {
  width: calc(100% - #{ $sideBarWidth - 150});
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

// .mobile .fixed-header {
//   width: 100%;
// }
.main_menu_view{
  width: 68px !important;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #4968FF;
  .logo_view{
    height: 63px;
    text-align: center;
    img{
      width: 48px;
      margin-top: 15px;
    }
  }
  .menu_view{
    color: rgba(255,255,255,.6);
    font-size: 12px;
    text-align: center;
    margin: 24px 0;
    cursor: pointer;
    .menu_icon_view{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255,255,255,.2);
      width: 32px;
      height: 32px;
      border-radius: 10px;
      text-align: center;
      margin: 0 auto 8px;
    }
    .svg-icon{
      width: 20px;
      height: 20px;
      color: rgba(255,255,255,.2);
    }
  }
  .menu_view_active{
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    margin: 24px 0;
    .menu_icon_view{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: #ffffff;
      border-radius: 10px;
      text-align: center;
      margin: 0 auto 8px;
    }
  }
  .svg-icon{
    width: 20px;
    height: 20px;
    color: #4968FF;
  }
}
</style>
