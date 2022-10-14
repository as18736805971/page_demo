<template>
  <div>
    <div v-if="img">
      <img class="avatar_img" :src="img" :style="{ width: width + 'px', height: width + 'px' }">
    </div>
    <div v-else>
      <div class="text_avatar_img" :style="{ width: width + 'px', height: width + 'px', lineHeight: width + 'px' }">
        {{ user_name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: () => ''
    },
    text: {
      type: String,
      default: () => ''
    },
    width: {
      type: Number,
      default: () => 48
    }
  },
  data() {
    return {
      user_name: ''
    }
  },
  created() {
    this.user_name = this.text.substring(this.text.length - 2, this.text.length)
  }
}
</script>
<style lang="scss" scoped>
.avatar_img {
  border-radius: 50%;
}
.text_avatar_img {
  border-radius: 50%;
  background-color: #3399FF;
  color: #fff;
  text-align: center;
  font-size: 16px;
}
</style>
