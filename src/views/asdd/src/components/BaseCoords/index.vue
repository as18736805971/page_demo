<template>
  <div class="map-coords">
    <div class="search_address">
      <div class="input-search">
        <el-popover v-model="visible" placement="bottom" width="350" trigger="manual">
          <div v-for="(item, index) in add_list" :key="index" class="pop_ser_it" @click.stop="handleSetAdd(item)">
            {{ item.name }}<span style="margin-left: 10px;color: #b5b5b5;font-size: 12px">{{ item.cityname }}{{ item.adname }}</span>
          </div>
          <el-input slot="reference" v-model="keywords" style="width: 350px;" placeholder="请输入详细地址，点击后搜索位置信息" @focus="handleSetInput" />
        </el-popover>
      </div>
      <span class="comm-btn comm-btn-primary" @click="handleSearch()">搜索</span>
    </div>
    <el-amap
      ref="map"
      class="amap-box"
      view-mode="3D"
      :zoom="zoom"
      :zooms="[6, 20]"
      :center="center"
      :expand-zoom-range="true"
      :show-label="true"
      @click="clickMap"
    >
      <el-amap-marker
        v-for="(item, index) in markers"
        :key="index"
        :icon="icon"
        :position="item.position"
        @mouseover="moveMap(item, 1)"
        @mouseout="moveMap(item, 2)"
      >
        <div v-if="item.status" class="tips">
          <div class="tips-content">{{ item.position.join('，') }}</div>
          <div class="popper__arrow" />
        </div>
        <img :src="icon" class="position-icon">
      </el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Index',
  data() {
    return {
      icon: new URL(`@/assets/images/coords.png`, import.meta.url).href,
      center: ['113.731372', '34.768085'],
      markers: [{
        status: false,
        position: ['113.731372', '34.768085']
      }],
      zoom: 17,
      keywords: '',
      add_list: [],
      visible: false,
      lnglat: {
        lng: '',
        lat: ''
      }
    }
  },
  created() {
    this.lnglat.lng = this.center[0]
    this.lnglat.lat = this.center[1]
    this.markers[0].position[0] = this.center[0]
    this.markers[0].position[1] = this.center[1]
  },
  mounted() {
    window.addEventListener('mousedown', this.handleMousedown)
  },
  beforeDestroy() {
    window.removeEventListener('mousedown', this.handleMousedown)
  },
  methods: {
    clickMap(e) {
      const data = e.lnglat
      this.handleSetLocation(data)
    },
    moveMap(data, type) {
      type === 1 ? data.status = true : data.status = false
    },
    handleSearch() {
      if (this.keywords) {
        axios({
          method: 'get',
          url: 'https://restapi.amap.com/v5/place/text?parameters',
          params: {
            key: '33eb2e38f493b831c0b16c011134782e',
            page_size: 25,
            keywords: this.keywords
          }
        }).then((res) => {
          if (res.data && res.data.pois && res.data.pois.length !== 0) {
            this.add_list = res.data.pois
            this.visible = true
          } else {
            this.$baseMessage('获取地理位置信息失败!', 'error')
          }
        }).catch(() => {
          this.$baseMessage('获取地理位置信息失败!', 'error')
        })
      } else {
        this.$baseMessage('请输入详细地址', 'error')
      }
    },
    handleSetAdd(item) {
      if (item.location) {
        const arr = item.location.split(',')
        this.handleSetLocation({
          lng: arr[0],
          lat: arr[1]
        })
        this.visible = false
        this.keywords = item.name
        this.center = [arr[0], arr[1]]
      } else {
        this.$baseMessage('该地址无坐标信息', 'error')
      }
    },
    handleSetLocation(data) {
      this.markers = []
      this.markers.push({
        status: false,
        position: [data.lng, data.lat]
      })
      this.lnglat.lng = data.lng
      this.lnglat.lat = data.lat
    },
    handleSetInput() {
      if (this.add_list.length !== 0) {
        this.visible = true
      }
    },
    handleMousedown() {
      if (this.visible) {
        this.visible = false
      }
    },
    onSubmit() {
      this.visible = false
      this.callBack && this.callBack(this.lnglat)
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
    left: -66px;
    top: -38px;
    z-index: 8;
    width: 150px;
    height: 30px;
    background: rgb(101 121 194 / 50%);
    backdrop-filter: blur(4px);
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
      border: 10px solid transparent;
      border-top: 6px solid rgb(101 121 194 / 50%);
      backdrop-filter: blur(4px);
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);
    }
  }
  .position-icon {
    width: 18px;
    height: 20px;
  }
  .customize-icon {
    width: 32px;
    height: 40px;
  }
  .amap-box {
    width: 100%;
    height: 326px;
  }
}
.search_address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .input-search {
    display: flex;
    align-items: center;
    .la_ad {
      width: 70px;
    }
  }
}
</style>
