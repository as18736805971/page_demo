<template>
  <div style="position: relative">
    <baidu-map class="map" ak="B6f231e9da2aad1f23cce74400698550" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @click="clickEvent" />
    <div style="position: absolute; top: 0; left: 10px">
      <el-input v-model="search_name" style="width: 200px;" placeholder="请输入" @keyup.enter.native="search()" />
      <el-button class="spp-btn spp-btn-primary" @click="search()">搜索</el-button>
    </div>
    <span class="mark">{{ address_detail }}</span>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import location from '@/assets/icon/red.png'
export default {
  components: { BaiduMap },
  props: {
    position: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      map: null,
      BMap: null,
      search_name: '',
      icon: null,
      address_detail: ''
    }
  },
  methods: {
    handler({ BMap, map }) {
      this.center.lng = this.position.hasOwnProperty('lng') ? this.position.lng : 113.737808
      this.center.lat = this.position.hasOwnProperty('lng') ? this.position.lat : 34.774181
      this.zoom = 15
      this.BMap = BMap
      this.map = map
      this.map.enableMapClick = false
      this.icon = new this.BMap.Icon(location, new this.BMap.Size(22, 32), { anchor: new this.BMap.Size(11, 32), imageSize: new this.BMap.Size(22, 32) })
      if (this.position.hasOwnProperty('lng')) {
        var myMarker = new this.BMap.Marker(new this.BMap.Point(this.position.lng, this.position.lat), { icon: this.icon })
        this.map.addOverlay(myMarker)
      }
    },
    clickEvent(e) {
      this.map.clearOverlays()
      const myMarker = new this.BMap.Marker(new this.BMap.Point(e.point.lng, e.point.lat), { icon: this.icon })
      this.map.addOverlay(myMarker)
      const pt = e.point
      const geoc = new this.BMap.Geocoder()
      geoc.getLocation(pt, rs => {
        const addComp = rs.addressComponents
        this.address_detail = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
      })
      const position = {
        lng: e.point.lng,
        lat: e.point.lat
      }
      this.$emit('getPosition', position)
    },
    search() {
      const local = new this.BMap.LocalSearch(this.map, {
        renderOptions: { map: this.map },
        onSearchComplete: res => {
          if (local.getResults() !== undefined) {
            this.map.clearOverlays()
          } else {
            this.$message.error('未找到搜索结果')
          }
        }
      })
      local.search(this.search_name)
    }
  }
}
</script>
<style lang="scss" scoped>
  .map{
    width: 100%;
    height: 100%;
  }
  .mark{
    position: absolute;
    top: 35px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    padding:0 5px;
    font-size: 12px;
    line-height: 24px;
  }
</style>
