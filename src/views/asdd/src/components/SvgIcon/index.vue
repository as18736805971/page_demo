<template>
  <svg aria-hidden="true" class="svg">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon'
    },
    // eslint-disable-next-line vue/require-prop-types
    name: {
      required: true
    },
    color: {
      type: String,
      default: '#333'
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  }
})
</script>

<style>
.svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
  overflow: hidden;
}
</style>
