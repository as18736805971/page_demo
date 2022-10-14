<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <!-- <img v-if="logo" :src="logo_collapse" class="collapse-logo"> -->
        <!-- <h1 class="sidebar-title">1 </h1> -->
      </div>
      <div v-else key="expand" class="sidebar-logo-link sidebar-text">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <div id="sidebar_title" class="sidebar-title" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'title',
      'logo',
      'logo_collapse'
    ])
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: #F5F6FA;
  text-align: center;
  overflow: hidden;
  border-bottom: 1px solid #E6E7EB;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      height: 30px;
      vertical-align: middle;
    }

    & .collapse-logo{
      height: 40px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      color: #696B70;
      font-size: 12px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
  .sidebar-text {
    text-align: left;
    padding-left: 24px
  }
}
</style>
