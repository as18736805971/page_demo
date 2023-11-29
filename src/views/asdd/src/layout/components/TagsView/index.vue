<template>
  <div class="app-tags-view">
    <div class="tag-view-left">
      <div class="tags-icon" @click="goLeft()">
        <svg-icon class="svg" name="arrow_left" />
      </div>
      <div
        class="tags-index"
        :class="sel_tag.path === '/admin/home/index' ? 'tags-active' : ''"
        @click="backHome()"
      >
        <svg-icon class="svg svg-txt" :name="page_home.menu_icon" />
        <div class="home-txt">{{ page_home.menu_name }}</div>
      </div>
    </div>
    <scroll-pane ref="scrollPane">
      <router-link
        v-for="(tag, index) in visitedViews"
        ref="tag"
        :key="index"
        :class="isActive(tag) ? 'tags-active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
      >
        <svg-icon class="svg" name="tag" />
        <span class="tag-title">{{ tag.meta.title }}</span>
        <img
          v-if="visitedViews.length > 1"
          class="tag-close"
          src="@/assets/images/close1.png"
          @click.prevent.stop="closeTag(tag)"
        >
      </router-link>
    </scroll-pane>
    <div class="tag-view-left tag-view-right">
      <div class="tags-icon" @click="goRight()">
        <svg-icon class="svg" name="arrow_right" />
      </div>
      <el-dropdown trigger="click">
        <div class="tags-icon" style="margin-right: 0">
          <svg-icon class="svg" name="arrow_down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div class="drop_div" @click="refreshPage()">刷新页面</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="drop_div" @click="closeOther()">关闭其他</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="drop_div" @click="closeAll()">关闭全部</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'TagsView',
  components: { ScrollPane },
  data() {
    return {
      sel_tag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      const that = this
      this.$store.state.tagsView.visitedViews.forEach(item => {
        if (item.path === this.$route.path) {
          that.sel_tag = item
        }
      })
      return this.$store.state.tagsView.visitedViews
    },
    ...mapGetters(['page_home'])
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    }
  },
  mounted() {
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    goLeft() {
      const elem = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap
      elem.scrollLeft = elem.scrollLeft > 0 ? (elem.scrollLeft - 200) : 0
    },
    goRight() {
      const elem = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap
      elem.scrollLeft = elem.scrollLeft < elem.scrollWidth ? (elem.scrollLeft + 200) : elem.scrollWidth
    },
    addTags() {
      const { name, path } = this.$route
      if (name && path !== '/admin/home/index') {
        this.$store.dispatch('tagsView/addView', this.$route)
      } else {
        this.sel_tag = this.$route
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (!tags) return
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    backHome() {
      if (this.sel_tag.path !== '/admin/home/index') {
        this.$router.push({
          path: '/admin/home/index'
        })
      }
    },
    refreshPage() {
      this.$store.dispatch('tagsView/delCachedView', this.sel_tag).then(() => {
        const { path } = this.sel_tag
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + path
          })
        })
      })
    },
    closeOther() {
      this.$store.dispatch('tagsView/delOthersViews', this.sel_tag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAll() {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === this.sel_tag.path)) {
          return
        }
        this.toLastView(visitedViews, this.sel_tag)
      })
    },
    toLastView(visitedViews) {
      const latestView = visitedViews.slice(-1)[0]
      if (!latestView) {
        this.$router.push({
          path: '/admin/home/index'
        })
      }
    },
    closeTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/style/comm/mixins";
.app-tags-view {
  height: 34px;
  padding: 0 8px;
  display: flex;
  .tag-view-left {
    display: flex;
    .tags-icon {
      width: 28px;
      height: 28px;
      background: var(--theme-bg);
      border-radius: 6px;
      @include flex-center();
      cursor: pointer;
      margin-right: 4px;
      .svg {
        width: 12px;
        height: 12px;
        color: #939499;
      }
    }
    .tags-index {
      padding: 0 8px;
      height: 28px;
      background: var(--theme-bg);
      border-radius: 6px;
      @include flex-center();
      cursor: pointer;
      margin-right: 4px;
      color: var(--font-text2);
      .svg-txt {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
      .home-txt {
        max-width: 72px;
        @include ellipsis()
      }
    }
    .tags-index:hover {
      color: var(--theme-color);
      background: var(--theme-shallow);
      .svg {
        color: var(--theme-color);
      }
    }
    .tags-icon:hover {
      color: var(--theme-color);
      background: var(--theme-shallow);
      .svg {
        color: var(--theme-color);
      }
    }
  }
  .tags-view-item {
    width: 120px;
    height: 28px;
    display: inline-block;
    cursor: pointer;
    padding: 8px;
    background: var(--theme-bg);
    border-radius: 6px;
    margin-right: 4px;
    font-size: 12px;
    line-height: 12px;
    color: var(--font-text2);
    .svg {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
    .tag-title {
      width: 72px;
      display: inline-block;
      @include ellipsis()
    }
    .tag-close {
      width: 12px;
      height: 12px;
      margin-left: 4px;
    }
  }
  .tags-view-item:hover {
    color: var(--theme-color);
    background: var(--theme-shallow);
    .svg {
      color: var(--theme-color);
    }
  }
  .tags-active {
    color: var(--theme-color) !important;
    background: var(--theme-shallow) !important;
    .svg {
      color: var(--theme-color) !important;
    }
  }
}
</style>
