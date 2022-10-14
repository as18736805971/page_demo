<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar ref="sidebar" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @changeSkin="changeSkin" @switch_sch="switch_sch" />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
    <el-drawer
      v-if="choice_scl"
      title="选择学校"
      :visible.sync="choice_scl"
      :wrapper-closable="false"
      :modal-append-to-body="false"
      class="spp-drawer right-noall-content"
    >
      <InsideSelectSchool @selectSchool="selectSchool" />
    </el-drawer>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import InsideSelectSchool from '@/components/InsideSelectSchool'
import { insideScl } from '@/api/user'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    InsideSelectSchool
  },
  mixins: [ResizeMixin],
  data() {
    return {
      choice_scl: false
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },

    changeSkin() {
      this.$refs.sidebar.changeSkin()
    },

    switch_sch() {
      this.choice_scl = true
    },

    selectSchool(data) {
      insideScl(data.scl_id).then((res) => {
        this.$message({
          message: '选择成功',
          type: 'success',
          duration: 3000
        })
        localStorage.setItem('scl_name', data.scl_name)
        this.$refs.sidebar.get_name()
        this.choice_scl = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.main-container {
  background-color: #f0f2f5 !important;
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
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
