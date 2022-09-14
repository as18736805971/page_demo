<template>
  <div class="index">
    <div class="div">
      <li class="li marquee" v-for="item in 12" :key="item">{{ item }}</li>
    </div>
  </div>
</template>

<script>
export default {
  name: "pageLogin"
}
</script>

<style lang="scss" scoped>
.index {
  padding: 50px;
}
.div {
  width: 250px;
  height: 300px;
  overflow-y: auto;
  color: #F8644E;

  .li {
    height: 30px;
  }
}

.marquee {
  animation: move 0.5s linear infinite;
}
@keyframes move {
  0% {
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
