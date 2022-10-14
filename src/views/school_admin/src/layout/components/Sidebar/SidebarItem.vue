<template>
  <div class="menu-wrapper">
    <!-- 没有子菜单 -->
    <template v-if="!item.child_menu.length">
      <template v-if="item.menu_url === 'admin/index/screen_index'">
        <el-menu-item
          :index="String(item.menu_id)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          @click="handleTagLink(1)"
        >
          <item :icon="item.menu_icon" :title="item.menu_name" />
        </el-menu-item>
      </template>
      <template v-else-if="item.menu_url === 'admin/index/education_index'">
        <el-menu-item
          :index="String(item.menu_id)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          @click="handleTagLink(2)"
        >
          <item :icon="item.menu_icon" :title="item.menu_name" />
        </el-menu-item>
      </template>
      <template v-else>
        <app-link :to="resolvePath(item.menu_url ? item.menu_url : '')">
          <el-menu-item
            :index="String(item.menu_id)"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <item :icon="item.menu_icon" :title="item.menu_name" />
          </el-menu-item>
        </app-link>
      </template>
    </template>
    <!-- 有子菜单 -->
    <div v-else>
      <el-submenu
        v-if="show_menu"
        ref="subMenu"
        :index="String(item.menu_id)"
        popper-append-to-body
      >
        <template slot="title">
          <item :icon="item.menu_icon || ''" :title="item.menu_name" />
        </template>
        <sidebar-item
          v-for="child in item.child_menu"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.menu_url ? child.menu_url : '')"
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
import { decrypt, httpRequest } from '@/utils/auth'

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
      // if (isExternal(this.basePath)) {
      //   return this.basePath
      // }
      return path.resolve(routePath)
    },
    handleTagLink(type) {
      if (type === 1) {
        httpRequest('/api/login/change/token', {}, false).then((res) => {
          var data = JSON.parse(decrypt(res.data))
          window.open(process.env.VUE_APP_SCREEN_HOST + '?token=' + data[0].token)
        })
      } else {
        httpRequest('/api/login/change/token/edu', {}, false).then((res) => {
          var data = JSON.parse(decrypt(res.data))
          window.open(process.env.VUE_APP_EDUCATION_HOST + '?token=' + data[0].token)
        })
      }
    }
  }
}
</script>
<style lang="scss"></style>
