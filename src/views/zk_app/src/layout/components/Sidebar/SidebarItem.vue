<template>
  <div class="menu-wrapper">
    <!-- 没有子菜单 -->
    <template v-if="!item.child.length">
      <app-link :to="resolvePath(item.menu_url?item.menu_url:'')" :type="item.menu_type">
        <el-menu-item :index="item.menu_id" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="item.menu_icon" :title="item.menu_name" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 有子菜单 -->
    <div v-else>
      <el-submenu v-if="show_menu" ref="subMenu" :index="item.menu_id" popper-append-to-body>
        <template slot="title">
          <item :icon="item.menu_icon || ''" :title="item.menu_name" />
        </template>
        <sidebar-item
          v-for="child in item.child"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.menu_url?child.menu_url:'')"
          class="nest-menu"
        />
      </el-submenu>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      show_menu: true
    }
  },
  computed: {
    ...mapGetters(['user_type'])
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss"></style>
