<template>
  <div class="app-wrapper">
    <div class="app-header-top">
      <navbar />
      <tags-view />
    </div>
    <div class="app-center">
      <sidebar class="app-sidebar" :menus="show_model" :is-index="is_index" :active-model="active_model" :class="opened ? 'app-sidebar-show' : ''" />
      <app-main class="app-main" :class="[opened ? 'app-main-show' : '', crumbs_list.length !== 0 ? 'app-main-crumbs' : 'app-overflow']" />
    </div>
  </div>
</template>

<script>
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/Menus.vue'
import TagsView from './components/TagsView/index.vue'
import { routePathInfo } from '@/utils'
import {mapGetters} from 'vuex'
export default {
  name: 'Layout',
  components: { AppMain, Navbar, TagsView, Sidebar },
  data() {
    return {
      is_index: false,
      show_model: [],
      active_model: {}
    }
  },
  computed: {
    ...mapGetters(['opened', 'model', 'crumbs_list'])
  },
  watch: {
    '$route'() {
      this.show_model = []
      this.handleSetPath()
    }
  },
  mounted() {
    this.show_model = []
    this.handleSetPath()
    this.$store.dispatch('tagsView/closeSideBar')
  },
  methods: {
    handleSetPath() {
      const path = this.$route.path.substr(1)
      this.$store.dispatch('permission/setPageHome', this.model[0])
      if (path === 'admin/home/index') {
        this.is_index = true
        const menus = JSON.parse(JSON.stringify(this.model))
        this.show_model = menus.length !== 0 ? menus.splice(1) : menus
        this.$store.dispatch('permission/setCrumbsList', [])
      } else {
        this.is_index = false
        // 参考没有匹配到的情况 回到首页
        const pathInfo = routePathInfo(this.model, path, {}, [])
        if (pathInfo) {
          const hierarchy = pathInfo.hierarchy
          this.active_model = pathInfo.item
          const crumbs = JSON.parse(JSON.stringify(hierarchy))
          crumbs.push(pathInfo.item)
          this.$store.dispatch('permission/setCrumbsList', crumbs)
          const lastIndex = hierarchy.length - 1
          if (lastIndex >= 0) {
            const lastItem = hierarchy[lastIndex]
            this.show_model = lastItem.child_menu
          }
        } else {
          //
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .app-header-top {
    width: 100%;
    height: 90px;
    background: #ffffff;
    border-bottom: 1px solid var(--parting-line);
  }
  .app-center {
    display: flex;
    background: #ffffff;
    min-height: calc(100vh - 90px);
    .app-sidebar {
      width: 218px;
      height: calc(100vh - 90px);
      padding: 8px;
      background: var(--theme-bg);
      transition: width .28s;
    }
    .app-sidebar-show {
      width: 64px;
    }
    .app-main {
      width: calc(100% - 218px);
      height: calc(100vh - 90px);
      position: relative;
      transition: width .28s;
    }
    .app-main-crumbs {
      height: calc(100vh - 130px);
    }
    .app-overflow {
      overflow: auto;
    }
    .app-main-show {
      width: calc(100% - 64px);
    }
  }
}
</style>
