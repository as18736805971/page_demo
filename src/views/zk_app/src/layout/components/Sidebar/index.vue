<template>
  <div>
    <logo ref="logo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'background': bgcolor}">
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
import Bus from '@/utils/bus'
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
    ...mapGetters(['sidebar']),
    activeMenu() {
      let id = ''
      this.menus.forEach(item => {
        if (item.child.length > 0) {
          item.child.forEach(opt => {
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
  created() {
    Bus.$on('menu', val => {
      this.menus = val
    })
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
    },
    get_name() {
      this.$refs.logo.get_name()
    }
  }
}
</script>
