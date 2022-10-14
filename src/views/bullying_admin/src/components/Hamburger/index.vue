<template>
  <div @click="toggleClick">
    <svg-icon v-if="!isActive" icon-class="menu-open" class="hamburger_svg" />
    <svg-icon v-else icon-class="menu-retract" class="hamburger_svg" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>

.hamburger_svg{
  width: 22px !important;
  height: 22px !important;
  color: #fff;
  position: relative;
  top: 15px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
