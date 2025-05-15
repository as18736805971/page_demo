<template>
  <div class="amap-page-container">
    <el-amap
      ref="map"
      :zoom="zoom"
      :center="center"
      class="amap-demo"
    />
  </div>
</template>

<script>
import {nextTick} from "vue/src/core/util";

export default {
  name: 'amap-page',
  data() {
    return {
      zoom: 10,
      map: null,
      center: [115.167331, 34.641122]
    }
  },
  created() {
    // this.getLocation()
  },
  mounted() {
    this.nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.map = this.$refs.map.$$getInstance()
      console.log(this.map)
    }
  }
}
</script>

<style>
.amap-page-container {
  width: 100%;
  height: 100vh;
}
</style>