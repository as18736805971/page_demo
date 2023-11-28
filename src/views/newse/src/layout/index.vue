<template>
  <div class="app-wrapper">
    <div class="app-header-top">
      <navbar />
      <tags-view />
    </div>
    <div class="app-center">
      <sidebar class="app-sidebar" :menus="show_model" :class="opened ? 'app-sidebar-show' : ''" />
      <app-main class="app-main" :class="opened ? 'app-main-show' : ''" />
    </div>
  </div>
</template>

<script>
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/Menus.vue'
import TagsView from './components/TagsView/index.vue'
import {routePathChild, routePathInfo} from '@/utils'
import {mapGetters} from 'vuex'
export default {
  name: 'Layout',
  components: { AppMain, Navbar, TagsView, Sidebar },
  data() {
    return {
      show_model: []
    }
  },
  computed: {
    ...mapGetters(['opened', 'model'])
  },
  watch: {
    '$route'() {
      this.show_model = []
      this.handleSetPath()
    }
  },
  created() {
  },
  mounted() {
    this.show_model = []
    this.handleSetPath()
    this.$store.dispatch('tagsView/closeSideBar')
  },
  methods: {
    handleSetPath() {
      const path = this.$route.path.substr(1)
      if (path === 'admin/home/index') {
        const model = JSON.parse(JSON.stringify(this.model))
        model.map((item) => {
          item.fold = false
        })
        this.show_model = model
        console.log(this.show_model, '898998')
      } else {
        console.log(path)
        // 参考没有匹配到的情况 回到首页
        const pathInfo = routePathInfo(this.model, path, {}, [])
        if (pathInfo) {
          const hierarchy = pathInfo.hierarchy
          const lastIndex = hierarchy.length - 1
          if (lastIndex >= 0) {
            const lastItem = hierarchy[lastIndex]
            this.show_model = lastItem.child_menu
          }
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
      overflow: auto;
      transition: width .28s;
    }
    .app-main-show {
      width: calc(100% - 64px);
    }
  }
}
</style>
