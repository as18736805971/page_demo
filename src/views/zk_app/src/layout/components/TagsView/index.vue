<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-wrapper oper-go-left">
      <span class="tags-view-item" style="width: 100%;" @click="go_left">
        <svg-icon icon-class="go-left" class="tag-oper-icon" />
      </span>
    </div>
    <scroll-pane ref="scrollPane" class="tags-view-wrapper tags">
      <draggable>
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        >
          <span>
            <svg-icon v-if="!isAffix(tag)" icon-class="page" class="tag-icon" />
            <svg-icon v-else icon-class="home" class="tag-icon" />
          </span>
          <span class="tag-title">{{ tag.title }}</span>
          <span v-if="!isAffix(tag)" class="tag-close" @click.prevent.stop="closeSelectedTag(tag)">
            <svg-icon icon-class="close" />
          </span>
        </router-link>
      </draggable>
    </scroll-pane>
    <div class="tags-view-wrapper tag-view-right">
      <div class="tags-view-item oper-go-right" @click="go_right">
        <svg-icon icon-class="go-right" class="tag-oper-icon" />
      </div>
      <div class="tags-view-item">
        <el-dropdown class="hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <span>页面操作</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="refreshSelectedTag()">刷新页面</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="closeOthersTags">关闭其他</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="closeAllTags()">关闭全部</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import draggable from 'vuedraggable'
import path from 'path'

export default {
  components: { ScrollPane, draggable },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      const that = this
      this.$store.state.tagsView.visitedViews.forEach((item) => {
        if (item.path === this.$route.path) {
          that.selectedTag = item
        }
      })
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag() {
      this.$store
        .dispatch('tagsView/delCachedView', this.selectedTag)
        .then(() => {
          const { fullPath } = this.selectedTag
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch('tagsView/delView', view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store
        .dispatch('tagsView/delOthersViews', this.selectedTag)
        .then(() => {
          this.moveToCurrentTag()
        })
    },
    closeAllTags() {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === this.selectedTag.path)) {
          return
        }
        this.toLastView(visitedViews, this.selectedTag)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Homepage') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    go_left() {
      const elem = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap
      elem.scrollLeft = elem.scrollLeft > 0 ? elem.scrollLeft - 200 : 0
    },
    go_right() {
      const elem = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap
      elem.scrollLeft =
        elem.scrollLeft < elem.scrollWidth
          ? elem.scrollLeft + 200
          : elem.scrollWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #f5f7fa;
  box-shadow: 0px 0px 6px #e1e6eb;
  .oper-go-left {
    width: 48px;
    text-align: center;
  }
  .tags {
    width: calc(100% - 187px);
  }
  .tag-view-right {
    word-spacing: -10px;
    .tags-view-item {
      border-left: 1px solid #dce1e5;
      border-right: none !important;
    }
  }
  .tags-view-wrapper {
    height: 48px;
    .oper-go-right {
      width: 48px;
      text-align: center;
    }
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 47px;
      line-height: 48px;
      border-right: 1px solid #dce1e5;
      color: #495060;
      background: #f5f7fa;
      padding: 0 10px;
      font-size: 14px;
      .tag-title {
        padding: 0 8px 0 4px;
      }
      .tag-oper-icon {
        width: 12px !important;
        height: 12px !important;
        color: #969799;
      }
      .tag-oper-icon:hover {
        color: #3399ff;
      }
      .tag-icon {
        color: #939699;
        &:hover {
          color: #3399ff;
        }
        width: 14px !important;
        height: 14px !important;
      }
      // &:first-of-type {
      //   width: 48px;
      //   text-align: center;
      //   background: #e1e6eb
      // }
      &.active {
        background-color: #fff;
        color: #3399ff;
        border-bottom: 2px solid #3399ff;
        .tag-close {
          color: #626466;
          &:hover {
            color: #3399ff;
          }
        }
        .tag-icon {
          color: #3399ff;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .tag-close {
      color: #abafb2;
      line-height: 14px;
      svg {
        width: 8px !important;
        height: 8px !important;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
