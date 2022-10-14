<template>
  <div class="map-coords">
    <template v-for="(item, index) in markers">
      <div v-if="item.status" :key="index" :style="{top: item.top, left: item.left}" class="tips">
        <div class="tips-content">{{ item.position.join('，') }}</div>
        <div class="popper__arrow" />
      </div>
    </template>
    <el-amap
      ref="map"
      class="amap-box"
      view-mode="3D"
      :zoom="17"
      :zooms="[6, 20]"
      :center="center"
      :expand-zoom-range="true"
      :show-label="true"
      @click="clickMap"
      @dragend="handleResetMap"
      @zoomend="handleResetMap"
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
        :icon="
          coordsType === 1
            ? require('@/assets/images/map_coords.png')
            : coordsType === 2
              ? require('@/assets/images/camera_map.png')
              : coordsType === 3
                ? require('@/assets/images/audio_map.png')
                : require('@/assets/images/education_map.png')
        "
        :position="item.position"
        @mouseover="handleMoveMap(item, 1)"
        @mouseout="handleMoveMap(item, 2)"
      />
      <!--<el-amap-elastic-marker
        v-for="(item, index) in markers"
        :key="index"
        :position="item.position"
        :draggable="item.draggable"
        :styles="item.styles"
        :zoom-style-mapping="item.zoomStyleMapping"
        @mouseover="handleMoveMap(item, 1)"
        @mouseout="handleMoveMap(item, 2)"
        @mousedown="handleDownMap(item)"
        @dragstart="handleDragStart(item)"
        @dragend="handleDragend($event, item)"
      />-->
    </el-amap>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    coordsType: {
      type: Number,
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
    return {}
  },
  methods: {
    clickMap(e) {
      this.$emit('clickCoords', e.lnglat)
    },
    getLocation(e) {
      this.$emit('getLocation', e.position)
    },
    // 重置地图标点位置
    handleResetMap() {
      var map = document.getElementsByClassName('amap-marker')
      this.markers.map((vv, kk) => {
        vv.top = map[kk].offsetTop - 36 + 'px'
        vv.left = map[kk].offsetLeft - 63 + 'px'
        vv.status = false
        vv.draggable = false
      })
    },
    // 鼠标移近/移出点标记时触发事件
    handleMoveMap(data, type) {
      this.handleResetMap()
      type === 1 ? data.status = true : data.status = false
    },
    // 鼠标在点标记上按下时触发事件
    handleDownMap(data) {
      data.draggable = true
    },
    // 开始拖拽点标记时触发事件
    handleDragStart(data) {
      data.draggable = true
      data.status = false
    },
    // 点标记拖拽移动结束触发事件
    handleDragend(e, data) {
      this.markers[0].position[0] = e.lnglat.lng.toString()
      this.markers[0].position[1] = e.lnglat.lat.toString()
      data.draggable = false
      this.$emit('clickCoords', e.lnglat)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-coords {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  .tips {
    position: absolute;
    z-index: 8;
    width: 156px;
    height: 28px;
    background: rgba(0,0,0,0.50);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    .tips-content {
      font-size: 12px;
      color: #FFFFFF;
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

  .amap-box {
    width: 100%;
    height: 372px;
  }
}
</style>
