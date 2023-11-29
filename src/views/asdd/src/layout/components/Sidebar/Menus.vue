<template>
  <div class="menu-wrapper">
    <template v-if="opened">
      <div class="menu-list">
        <div v-for="(item, index) in menus" :key="index">
          <app-link :to="resolvePath(item.menu_url ? item.menu_url : '')">
            <div class="menu-item show-menu-item" :class="item.menu_url === activeModel.menu_url ? 'menu-active' : ''">
              <svg-icon class="menu-svg" name="index" />
            </div>
          </app-link>
        </div>
      </div>
      <div class="pack-line show-pack-line" />
      <div class="menu-item show-menu-item" @click="setFold(true)">
        <svg-icon class="menu-svg" name="pack_fold" />
      </div>
    </template>
    <template v-else>
      <div class="menu-list">
        <div v-for="(item, index) in menus" :key="index">
          <template v-if="isIndex">
            <div class="menu-item" @click="handleIsIndex(item)">
              <svg-icon class="menu-svg" name="index" />
              <div class="menu-title">{{ item.menu_name }}</div>
            </div>
          </template>
          <template v-else>
            <app-link :to="resolvePath(item.menu_url ? item.menu_url : '')">
              <div class="menu-item" :class="item.menu_url === activeModel.menu_url ? 'menu-active' : ''">
                <svg-icon class="menu-svg" name="index" />
                <div class="menu-title">{{ item.menu_name }}</div>
              </div>
            </app-link>
          </template>
        </div>
      </div>
      <div class="pack-line" />
      <div class="menu-item" @click="setFold(false)">
        <svg-icon class="menu-svg" name="pack_up" />
        <div class="menu-title">收起</div>
      </div>
    </template>
  </div>
</template>

<script>
import AppLink from './Link.vue'
import { mapGetters } from 'vuex'
import { isExternal } from '@/utils'
export default {
  components: { AppLink },
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    activeModel: {
      type: Object,
      default: () => {}
    },
    // 是否为首页
    isIndex: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['opened'])
  },
  methods: {
    setFold() {
      this.$store.dispatch('tagsView/toggleSideBar')
    },
    handleIsIndex(item) {
      console.log(item, '首页进行锚点定位')
    },
    resolvePath(path) {
      if (isExternal(path)) {
        return path
      }
      return path.startsWith('/') ? path : `/${path}`
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/style/comm/mixins";
.menu-list {
  height: calc(100% - 57px);
  overflow-y: auto;
}
.menu-list::-webkit-scrollbar {
  display: none;
}
.menu-item {
  width: 202px;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--font-text1);
  .menu-svg {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  .menu-title {
    width: 144px;
    font-size: 14px;
    @include ellipsis();
  }
}
.menu-item:hover {
  background: var(--theme-shallow);
}
.menu-active {
  background: var(--theme-shallow);
  color: var(--theme-color);
}
.pack-line {
  width: 202px;
  height: 1px;
  margin-bottom: 8px;
  background: var(--btn_outline);
}
.show-pack-line {
  width: 48px;
}
.show-menu-item {
  width: 48px;
  .menu-svg {
    margin-right: 0;
  }
}
</style>
