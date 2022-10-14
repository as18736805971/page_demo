<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'background': bgcolor}">
      <el-menu
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        @select="handleSelect"
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
      bgcolor: '#F5F6FA',
      textColor: 'rgba(255, 255, 255, .5)',
      menus: []
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    activeMenu() {
      if (!this.menus) {
        return
      }
      let id = ''
      this.menus.forEach(item => {
        if (item.child_menu.length > 0) {
          item.child_menu.forEach(opt => {
            if (opt.menu_name === document.getElementById('select_menu').innerHTML) {
              id = opt.menu_id
            }
          })
        } else {
          if (item.menu_name === document.getElementById('select_menu').innerHTML) {
            id = item.menu_id
          }
        }
      })
      return id
    },
    isCollapse() {
      // return !this.sidebar.opened
      return false
    }
  },
  created() {
    Bus.$on('menu', val => {
      this.menus = val
    })
  },
  methods: {
    handleSelect(key, keyPath) {
      this.menus.forEach(item => {
        if (item.child_menu.length > 0) {
          item.child_menu.forEach(opt => {
            if (opt.menu_id === key) {
              document.getElementById('select_menu').innerHTML = opt.menu_name
            }
          })
        } else {
          if (item.menu_id === key) {
            document.getElementById('select_menu').innerHTML = item.menu_name
          }
        }
      })
    },
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
