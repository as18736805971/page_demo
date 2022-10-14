<template>
  <div>
    <template v-if="detailType === 1">
      <div class="demo-list">
        <div class="left-top">
          <img class="demo-icon" src="@/assets/images/round_demo.png">{{ info.equ_name }}
          <el-button v-if="info.on_flag == '1'" type="text" style="color: #00BD79;margin-left: 8px">在线</el-button>
          <el-button v-else type="text" style="color: #909399;margin-left: 8px">离线</el-button>
        </div>
        <div class="right-top">
          <!-- <span class="see-block">语音对讲</span> -->
        </div>
      </div>
      <div class="label-item">
        <span class="label-title">设备编号：</span>
        <span class="label-txt">{{ info.equ_no }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">设备添加时间：</span>
        <span class="label-txt">{{ info.create_time | formatDate }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">最后通讯时间：</span>
        <span class="label-txt">{{ info.last_connect_time | formatDate }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">报警音量：</span>
        <span class="label-txt">{{ info.equ_volume }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">报警音频：</span>
        <div class="audio-block" @click="handleAudio()">
          <img class="audio-icon" src="../../assets/images/video.png">
          播放音频
        </div>
      </div>
      <div class="map-item">
        <template v-for="(item) in markers">
          <div v-if="item.status" :key="item.id" :style="{top: item.top, left: item.left}" class="tips">
            <div class="tips-title">
              <img class="icon-demo" :src="require('@/assets/images/round_demo.png')">
              <div class="title-txt">音频设备</div>
            </div>
            <div class="popper__arrow" />
          </div>
        </template>
        <el-amap
          ref="map"
          class="amap-box"
          view-mode="3D"
          :zoom="17"
          :zooms="[6, 20]"
          :center="info.center"
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
            :icon="require('@/assets/images/pun_demo.png')"
            :position="item.position"
            @mouseover="handleMoveMap(item, 1)"
            @mouseout="handleMoveMap(item, 2)"
          />
        </el-amap>
      </div>
      <div class="label-item between">
        <div>
          <span class="label-title">位置描述：</span>
          <span class="label-txt">{{ info.equ_position }}</span>
        </div>
        <template v-if="!coords_show">
          <el-button v-if="auth.audio != -1" type="text" @click="handleEditCoords()">编辑坐标</el-button>
        </template>
        <template v-else>
          <div>
            <el-button type="text" @click="handleSaveCoords(1)">保存</el-button>
            <el-button style="margin-left: 16px" type="text" @click="handleSaveCoords(2)">取消</el-button>
          </div>
        </template>
      </div>
    </template>
    <template v-if="detailType === 0">
      <template v-if="Number(video_formart) === 1">
        <div v-if="info.rtsp" class="video-item">
          <object
            id="video"
            class="video-block"
            type="application/x-vlc-plugin"
            events="True"
            pluginspage="http://www.videolan.org"
            codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz"
          >
            <param name="mrl" :value="info.rtsp">
            <param name="volume" value="0">
            <param name="autoplay" value="true">
            <param name="loop" value="false">
            <param name="mute" value="true">
            <param name="fullscreen" value="false">
            <param name="controls" value="false">
          </object>
        </div>
        <div v-else class="no-video">
          <img class="no-icon-video" src="../../assets/images/no_video.png">
          <div class="no-txt">无效播放地址</div>
        </div>
      </template>
      <template v-else />
      <div class="demo-list">
        <div class="left-top">
          <img class="demo-icon" src="@/assets/images/round_video.png">{{ info.equ_name }}
          <el-button v-if="info.online_flag == '1'" type="text" style="color: #00BD79;margin-left: 8px">在线</el-button>
          <el-button v-else type="text" style="color: #909399;margin-left: 8px">离线</el-button>
        </div>
      </div>
      <div class="label-item">
        <span class="label-title">设备编号：</span>
        <span class="label-txt">{{ info.equ_no }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">设备添加时间：</span>
        <span class="label-txt">{{ info.create_time | formatDate }}</span>
      </div>
      <div class="label-item">
        <span class="label-title">最后通讯时间：</span>
        <span class="label-txt">{{ info.last_connect_time | formatDate }}</span>
      </div>
      <div class="map-item">
        <template v-for="(item) in markers">
          <div v-if="item.status" :key="item.id" :style="{top: item.top, left: item.left}" class="tips">
            <div class="tips-title">
              <img class="icon-demo" :src="require('@/assets/images/round_video.png')">
              <div class="title-txt">摄像头</div>
            </div>
            <div class="popper__arrow" />
          </div>
        </template>
        <el-amap
          ref="map"
          class="amap-box"
          view-mode="3D"
          :zoom="17"
          :zooms="[6, 20]"
          :center="info.center"
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
            :icon="require('@/assets/images/pun_video.png')"
            :position="item.position"
            @mouseover="handleMoveMap(item, 1)"
            @mouseout="handleMoveMap(item, 2)"
          />
        </el-amap>
      </div>
      <div class="label-item between">
        <div>
          <span class="label-title">位置描述：</span>
          <span class="label-txt">{{ info.equ_position }}</span>
        </div>
        <template v-if="!coords_show">
          <el-button v-if="auth.video != -1" type="text" @click="handleEditCoords()">编辑坐标</el-button>
        </template>
        <template v-else>
          <div>
            <el-button type="text" @click="handleSaveCoords(1)">保存</el-button>
            <el-button style="margin-left: 16px" type="text" @click="handleSaveCoords(2)">取消</el-button>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Index',
  props: {
    detailType: {
      type: Number,
      default: 1
    },
    markers: {
      type: Array,
      default: () => []
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      auth: {
        audio: -1,
        video: -1
      },
      lnglat: {
        lat: 0,
        lng: 0
      },
      video_formart: 1, // 视频播放格式：0-hls，1-rtsp
      coords_show: false // true 保存 false编辑
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  mounted() {
    this.permissionAuth()
  },
  methods: {
    permissionAuth() {
      this.auth.audio = this.permission.indexOf('/api/pajx/scl/audio/edit/coordinate')
      this.auth.video = this.permission.indexOf('/api/pajx/camera/scl/edit/coordinate')
    },
    getLocation(e) {
      this.$emit('getLocation', e.position)
    },
    // 地图相关配置
    clickMap(e) {
      if (this.coords_show) {
        this.lnglat.lng = e.lnglat.lng.toString()
        this.lnglat.lat = e.lnglat.lat.toString()
        this.$emit('handleEditCoords', {
          str: e.lnglat,
          type: 1
        })
      }
    },
    // 重置地图标点位置
    handleResetMap() {
      var map = document.getElementsByClassName('amap-marker')
      this.markers.map((vv, kk) => {
        vv.top = map[kk].offsetTop - 50 + 'px'
        vv.left = map[kk].offsetLeft - 25 + 'px'
        vv.status = false
      })
    },
    // 鼠标移入点标记时触发事件
    handleMoveMap(data, type) {
      if (!this.coords_show) {
        this.handleResetMap()
        // type === 1 ? data.status = true : data.status = false
      }
    },
    // 修改点位置
    handleEditCoords() {
      this.coords_show = true
    },
    // 保存编辑后的坐标
    handleSaveCoords(type) {
      this.coords_show = false
      if (type === 1) {
        var str = this.lnglat.lng + ',' + this.lnglat.lat
        var api = this.detailType === 1 ? '/api/pajx/scl/audio/edit/coordinate' : '/api/pajx/camera/scl/edit/coordinate'
        httpRequest(api, {
          equ_id: this.info.equ_id,
          equ_coordinate: str
        }, false).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
        this.$emit('handleEditCoords', {
          str: this.lnglat,
          type: 2
        })
        this.handleResetMap()
      } else {
        this.$emit('handleEditCoords', {
          str: '',
          type: 3
        })
        this.lnglat.lng = '0'
        this.lnglat.lat = '0'
        this.handleResetMap()
      }
    },
    // 播放音频
    handleAudio() {
      this.$emit('handlePlay')
    }
  }
}
</script>

<style lang="scss" scoped>
.video-item {
  margin-top: 33px;
  width: 100%;
  height: 325px;
  border-radius: 8px;
  //overflow: hidden;

  .video-block {
    width: 100%;
    height: 325px;
  }
}

.no-video {
  margin-top: 33px;
  width: 100%;
  height: 325px;
  border-radius: 8px;
  background: #282a2c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .no-icon-video {
    width: 50px;
    height: 50px;
  }

  .no-txt {
    margin-top: 20px;
    font-size: 16px;
    color: #f3f3f3;
  }
}

.no-video-div {
  width: 100%;
  height: 325px;
  border-radius: 8px;
  background: #282a2c;
  position: relative;

  .no-icon-video {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.demo-list {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 33px;
  height: auto;

  .left-top {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 18px;
    color: #2C2E33;
  }

  .demo-icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }

  .see-block {
    display: block;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #F9FAFC;
    border: 1px solid #E1E2E6;
    border-radius: 2px;
    font-weight: 400;
    font-size: 14px;
    color: #5E6166;
    cursor: pointer;
  }
}

.audio-block {
  width: 78px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3272FF;
  border-radius: 2px;
  font-size: 12px;
  color: #FFFFFF;
  cursor: pointer;

  .audio-icon {
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
}

.map-item {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;

  .map {
    width: 100%;
    height: 250px;
  }

  .tips {
    position: absolute;
    z-index: 8;
    width: 80px;
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
        margin-left: 4px;
        height: 20px;
        font-weight: Bold;
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 20px;
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

.label-item {
  display: flex;
  align-items: center;
  height: 40px;
  font-weight: 400;
  font-size: 14px;
  color: #5E6166;
  letter-spacing: 0;

  .label-txt {
    color: #2C2E33;
  }

  .edit-address {
    color: #3272FF;
    cursor: pointer;
  }
}

.between {
  justify-content: space-between;
}
</style>
