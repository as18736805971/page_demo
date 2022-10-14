<template>
  <div class="map-item">
    <template v-for="(item, index) in markers">
      <div v-if="item.status" :key="index" :style="{top: item.top, left: item.left}" class="tips">
        <div class="tips-title">
          <img class="icon-demo" :src="item.equ_flag === 1 ? require('@/assets/images/round_demo.png') : require('@/assets/images/round_video.png')">
          <div class="title-txt">{{ item.title }}</div>
        </div>
        <div class="popper__arrow" />
      </div>
    </template>
    <el-amap
      ref="map"
      class="map"
      view-mode="3D"
      default-cursor="pointer"
      :zoom="18"
      :center="center"
      :expand-zoom-range="true"
      @dragend="handleResetMap"
      @zoomend="handleResetMap"
      @complete="handleComplete"
    >
      <el-amap-control-geolocation
        :show-circle="false"
        :zoom-to-accuracy="true"
        :pan-to-location="true"
        :geo-location-first="false"
        :get-city-when-fail="true"
        @complete="getLocation"
      />
      <el-amap-marker
        v-for="(item, index) in markers"
        :key="index"
        :icon="item.icon"
        :position="item.position"
        @mouseover="handleMoveMap(item, 1)"
        @mouseout="handleMoveMap(item, 2)"
        @mousedown="handleDown(item)"
      />
    </el-amap>
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    pageType: {
      type: [Number, String],
      default: 1
    },
    markers: {
      type: Array,
      default: () => []
    },
    center: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      markers_show: false
    }
  },
  methods: {
    getLocation(e) {
      this.$emit('getLocation', e.position)
    },
    // 鼠标移近/移出点标记时触发事件
    handleMoveMap(data, type) {
      this.handleResetMap()
      type === 1 ? data.status = true : data.status = false
    },
    // 地图相关配置
    handleClickMap(data, index) {
      if (!this.markers_show) {
        this.handleResetMap()
      }
      this.markers[index].status = !this.markers[index].status
    },
    // 重置地图标点位置
    handleResetMap() {
      var map = document.getElementsByClassName('amap-marker')
      this.markers.map((vv, kk) => {
        vv.top = map[kk].offsetTop - 50 + 'px'
        vv.left = map[kk].offsetLeft - 75 + 'px'
        vv.status = false
      })
      this.markers_show = true
    },
    handleComplete() {
      this.$refs.map.$$getInstance().setFitView(null)
      this.center = this.$refs.map.center
      // var center = this.$refs.map.center
      // var lat = Number(center[1]) - Number(0.0007)
      // this.center = [center[0], lat]
    },
    // 鼠标按下
    handleDown(data) {
      this.$emit('handleClick', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-item {
  position: relative;
  width: 100%;
  height: 304px;
  overflow: hidden;

  .map {
    width: 100%;
    height: 304px;
  }

  .tips {
    position: absolute;
    z-index: 8;
    width: 180px;
    background: rgba(0,0,0,0.50);
    border-radius: 6px;
    padding: 10px 8px;

    .tips-title {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon-demo {
        width: 20px;
        height: 20px;
      }

      .title-txt {
        width: 140px;
        margin-left: 4px;
        height: 20px;
        font-weight: Bold;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .popper__arrow {
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top: 8px solid rgba(0,0,0,0.50);
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
    }
  }
}
</style>
