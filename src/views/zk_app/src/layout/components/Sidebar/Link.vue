
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      if (this.type === '2') {
        return {
          is: 'router-link',
          target: '_blank',
          to: url
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
