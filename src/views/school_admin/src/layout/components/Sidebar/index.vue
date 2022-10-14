<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :style="{ background: bgcolor }"
    >
      <el-menu
        :collapse="isCollapse"
        :default-active="activeMenu"
        :background-color="bgcolor"
        :text-color="textColor"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="menu in menus"
          :key="menu.menu_id"
          :item="menu"
          :base-path="menu.menu_path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      bgcolor: '#343B4A',
      textColor: 'rgba(255, 255, 255, .5)',
      menus: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'model', 'model_menu', 'model_url']),
    activeMenu() {
      let id = ''
      this.menus.forEach((item) => {
        if (item.child_menu.length > 0) {
          item.child_menu.forEach((opt) => {
            if (opt.menu_name === this.$route.meta.title) {
              id = opt.menu_id
            }
          })
        } else {
          if (item.menu_name === this.$route.meta.title) {
            id = item.menu_id
          }
        }
      })
      return id
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.menus = this.model
  },
  methods: {
    changeSkin() {
      if (this.bgcolor === '#ffffff') {
        this.bgcolor = '#343B4A'
        this.textColor = 'rgba(255, 255, 255, .5)'
      } else {
        this.bgcolor = '#ffffff'
        this.textColor = '#626466'
      }
    }
  }
}
</script>
