<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link sidebar-text"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1
          v-if="user_type === '0'"
          class="sidebar-title single-hidden-sidebar"
        >
          {{ scl_name || title }}
        </h1>
        <h1 v-else class="sidebar-title single-hidden-sidebar">{{ title }}</h1>
      </router-link>
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
  data() {
    return {
      scl_name: localStorage.getItem('scl_name')
    }
  },
  computed: {
    ...mapGetters(['title', 'logo', 'user_type'])
  },
  methods: {
    get_name() {
      this.scl_name = localStorage.getItem('scl_name')
    }
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
  background: #3399ff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 38px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 1000;
      line-height: 50px;
      font-size: 18px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
    & .single-hidden-sidebar {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: calc(100% - 50px);
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
  .sidebar-text {
    text-align: left;
    padding-left: 24px;
  }
}
</style>
