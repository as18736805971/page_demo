<template>
  <div class="app-tags-view">
    <div class="tag-view-left">
      <div class="tags-icon" @click="goLeft()">
        <svg-icon class="svg" name="arrow_left" />
      </div>
      <div class="tags-icon tags-index" @click="backHome()">
        <svg-icon class="svg svg-txt" name="index" />首页
      </div>
    </div>
    <scroll-pane ref="scrollPane">
      <router-link
        v-for="(tag, index) in visitedViews"
        ref="tag"
        :key="index"
        :class="isActive(tag) ? 'tags-active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
      >
        <svg-icon class="svg" name="tag" />
        <span class="tag-title">{{ tag.title }}</span>
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
export default {
  name: 'TagsView',
  components: { ScrollPane },
  data() {
    return {
      sel_tag: {}
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
    }
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
    // 返回首页
    backHome() {},
    // 刷新页面
    refreshPage() {},
    // 关闭其他
    closeOther() {},
    // 关闭全部
    closeAll() {},
    // 关闭标签页
    closeTag() {}
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
      width: 56px;
      font-size: 12px;
      color: var(--font-text2);
      .svg-txt {
        margin-right: 4px;
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
    color: var(--theme-color);
    background: var(--theme-shallow);
    .svg {
      color: var(--theme-color);
    }
  }
}
</style>
