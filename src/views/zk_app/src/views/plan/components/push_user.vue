<template>
  <div>
    <div v-for="(item, k) in userList" :key="k" class="space_between" style="padding: 12px 0; border-bottom: 1px solid #EBEDF0">
      <div style="display:flex; align-items:center">
        <Avatar :img="item.avatar" :text="item.user_name" />
        <span style="margin-left: 16px;">{{ item.user_name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
export default {
  components: { Avatar },
  props: {
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  }
}
</script>
