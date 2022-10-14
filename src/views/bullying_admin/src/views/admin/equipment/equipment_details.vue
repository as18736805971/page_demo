<template>
  <div>
    <el-form class="equipment-details" :label-position="'left'" label-width="120px">
      <div class="equipment-item">
        <img
          class="icon-img"
          :src="
            detailType === 1 ? require('@/assets/images/camera.png')
            : detailType === 2 ? require('@/assets/images/audio.png')
              : require('@/assets/images/smart.png')
          "
        >
        <div class="equipment-title">
          {{ detailType === 1 ? info.equ_name : detailType === 2 ? info.equ_name : info.name }}
        </div>
        <template v-if="detailType === 1">
          <el-button v-if="info.online_flag == '1'" style="color: #14BC6C" type="text">在线</el-button>
          <el-button v-else style="color: #939499" type="text">离线</el-button>
        </template>
        <template v-if="detailType === 2">
          <el-button v-if="info.state == '在线'" style="color: #14BC6C" type="text">{{ info.state }}</el-button>
          <el-button v-else style="color: #939499" type="text">{{ info.state }}</el-button>
        </template>
        <template v-if="detailType === 3">
          <el-button v-if="info.state == '100'" style="color: #FF7428" type="text">未知</el-button>
          <el-button v-if="info.state == '110'" style="color: #1AB9FF" type="text">激活</el-button>
          <el-button v-if="info.state == '120'" style="color: #FF7428" type="text">未激活</el-button>
          <el-button v-if="info.state == '200'" style="color: #14BC6C" type="text">在线</el-button>
          <el-button v-if="info.state == '300'" style="color: #939499" type="text">离线</el-button>
          <el-button v-if="info.state == '400'" style="color: #FF4949" type="text">故障</el-button>
          <el-button v-if="info.state == '500'" style="color: #FF4949" type="text">禁用</el-button>
          <el-button v-if="info.state == '600'" style="color: #FF4949" type="text">移出</el-button>
          <el-button v-if="info.state == '610'" style="color: #FF4949" type="text">擦除</el-button>
        </template>
      </div>
      <template v-if="detailType === 2">
        <el-form-item label="设备类型：">{{ info.equ_type_name }}</el-form-item>
        <el-form-item label="安装学校：">{{ info.scl_name }}</el-form-item>
        <el-form-item label="设备描述：">{{ info.equ_desc }}</el-form-item>
        <el-form-item label="设备位置：">{{ info.equ_position }}</el-form-item>
        <el-form-item label="出警人：">{{ info.police_name }}</el-form-item>
        <el-form-item label="责任人：">{{ info.duty_name }}</el-form-item>
        <el-form-item label="设备厂商：">{{ info.equ_vender_name }}</el-form-item>
        <el-form-item label="设备提供方：">{{ info.provider_type_name }}</el-form-item>
        <el-form-item label="绑定第三方设备：">{{ info.name }}</el-form-item>
        <el-form-item label="创建人：">{{ info.user_name }}</el-form-item>
        <el-form-item label="创建时间：">{{ info.create_time | formatDate }}</el-form-item>
        <el-form-item label="最后通讯时间：">{{ info.last_connect_time | formatDate }}</el-form-item>
        <el-form-item label="设备坐标：">
          <div class="set-coords">
            <div>{{ info.equ_coordinate }}</div>
            <template v-if="!coords_show">
              <el-button type="text" @click="handleEditCoords()">编辑坐标</el-button>
            </template>
            <template v-else>
              <div>
                <el-button type="text" @click="handleSaveCoords(1)">保存</el-button>
                <el-button style="margin-left: 16px" type="text" @click="handleSaveCoords(2)">取消</el-button>
              </div>
            </template>
          </div>
        </el-form-item>
        <div class="map-item">
          <template v-for="(item) in markers">
            <div v-if="item.status" :key="item.id" :style="{top: item.top, left: item.left}" class="tips">
              <div class="tips-content">{{ item.position.join('，') }}</div>
              <div class="popper__arrow" />
            </div>
          </template>
          <el-amap
            ref="maps"
            class="map"
            view-mode="3D"
            :zoom="17"
            :zooms="[6, 20]"
            :center="center"
            :expand-zoom-range="true"
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
              :icon="require('@/assets/images/audio_map.png')"
              :position="item.position"
              @mouseover="handleMoveMap(item, 1)"
              @mouseout="handleMoveMap(item, 2)"
            />
            <!-- <el-amap-elastic-marker
              v-for="(item, index) in markers"
              :key="index"
              :position="item.position"
              :draggable="item.draggable"
              :styles="item.styles"
              :zoom-style-mapping="item.zoomStyleMapping"
              @mouseover="handleMoveMap(item)"
              @mouseout="handleOutMap(item)"
              @mousedown="handleDownMap(item)"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragend($event, item)"
            /> -->
          </el-amap>
        </div>
      </template>
      <template v-else>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="设备详情" name="detail">
            <template v-if="detailType === 1">
              <el-form-item label="设备类型：">{{ info.equ_type_name }}</el-form-item>
              <el-form-item label="安装学校：">{{ info.scl_name }}</el-form-item>
              <el-form-item label="设备描述：">{{ info.equ_desc }}</el-form-item>
              <el-form-item label="设备位置：">{{ info.equ_position }}</el-form-item>
              <el-form-item label="应用场景：">{{ info.camera_use_name }}</el-form-item>
              <el-form-item label="设备提供方：">{{ info.provider_type_name }}</el-form-item>
              <el-form-item label="设备厂商：">{{ info.equ_vender_name }}</el-form-item>
              <el-form-item label="创建人：">{{ info.create_oper_name }}</el-form-item>
              <el-form-item label="创建时间：">{{ info.create_time | formatDate }}</el-form-item>
              <el-form-item label="最后通讯时间：">{{ info.last_connect_time | formatDate }}</el-form-item>
              <el-form-item label="http-flv地址：">{{ info.httpflv }}</el-form-item>
              <el-form-item label="rtmp地址：">{{ info.rtmp }}</el-form-item>
              <el-form-item label="rtsp地址：">{{ info.rtsp }}</el-form-item>
              <el-form-item label="设备坐标：">
                <div class="set-coords">
                  <div>{{ info.equ_coordinate }}</div>
                  <template v-if="!coords_show">
                    <el-button type="text" @click="handleEditCoords()">编辑坐标</el-button>
                  </template>
                  <template v-else>
                    <div>
                      <el-button type="text" @click="handleSaveCoords(1)">保存</el-button>
                      <el-button style="margin-left: 16px" type="text" @click="handleSaveCoords(2)">取消</el-button>
                    </div>
                  </template>
                </div>
              </el-form-item>
              <div class="map-item">
                <template v-for="(item) in markers">
                  <div v-if="item.status" :key="item.id" :style="{top: item.top, left: item.left}" class="tips">
                    <div class="tips-content">{{ item.position.join('，') }}</div>
                    <div class="popper__arrow" />
                  </div>
                </template>
                <el-amap
                  ref="maps"
                  class="map"
                  view-mode="3D"
                  :zoom="17"
                  :zooms="[6, 20]"
                  :center="center"
                  :expand-zoom-range="true"
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
                    :icon="require('@/assets/images/camera_map.png')"
                    :position="item.position"
                    @mouseover="handleMoveMap(item, 1)"
                    @mouseout="handleMoveMap(item, 2)"
                  />
                <!--<el-amap-elastic-marker
                  v-for="(item, kk) in markers"
                  :key="kk"
                  :position="item.position"
                  :draggable="item.draggable"
                  :styles="item.styles"
                  :zoom-style-mapping="item.zoomStyleMapping"
                  @mouseover="handleMoveMap(item)"
                  @mouseout="handleOutMap(item)"
                  @mousedown="handleDownMap(item)"
                  @dragstart="handleDragStart(item)"
                  @dragend="handleDragend($event, item)"
                />
              </el-amap>-->
                </el-amap>
              </div>
            </template>
            <template v-else>
              <el-form-item label="厂家设备ID：">{{ info.id }}</el-form-item>
              <el-form-item label="设备别名：">{{ info.alias }}</el-form-item>
              <el-form-item label="设备告警音地址：">{{ info.audioUrl }}</el-form-item>
              <el-form-item label="触发告警关键词：">{{ info.keyword }}</el-form-item>
              <el-form-item label="设备坐标：">{{ info.longitude && info.latitude ? info.longitude + '，' + info.latitude : '' }}</el-form-item>
              <el-form-item label="设备失活时间：">{{ info.inactiveTimeout }}s</el-form-item>
              <el-form-item label="创建时间：">{{ info.createTime | timeFormat }}</el-form-item>
              <el-form-item label="最后通讯时间：">{{ info.lastActiveTime | timeFormat }}</el-form-item>
            </template>
          </el-tab-pane>
          <el-tab-pane label="告警列表" name="list">
            <el-table ref="table" :data="list" :height="height - 80" size="mini" strip>
              <el-table-column label="序号" type="index" width="60" align="left" />
              <el-table-column label="事件编号" prop="event_id" show-overflow-tooltip align="left" />
              <el-table-column label="触发敏感词" prop="keyword" width="120" show-overflow-tooltip align="left" />
              <el-table-column label="触发时间" width="155" align="left">
                <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
              </el-table-column>
              <el-table-column label="完成时间" width="155" align="left">
                <template slot-scope="scope">{{ scope.row.finish_time | formatDate }}</template>
              </el-table-column>
              <el-table-column v-if="detailType === 3" label="触发方式" width="75" align="left">
                <template slot-scope="scope">
                  <div class="block-audio-btn">
                    {{ scope.row.trigger_type_name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-if="detailType === 1" label="事件状态" width="90" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status_flag == '4'" style="color: #14BC6C" type="text">已完成</el-button>
                  <el-button v-if="scope.row.status_flag == '2'" style="color: #939499" type="text">无需出警</el-button>
                  <el-button v-if="scope.row.status_flag == '0'" style="color: #FF4949" type="text">未查看</el-button>
                  <el-button v-if="scope.row.status_flag == '1'" style="color: #FF7428" type="text">已接警</el-button>
                  <el-button v-if="scope.row.status_flag == '3'" style="color: #1AB9FF" type="text">已出警</el-button>
                  <el-button v-if="scope.row.status_flag == '5'" style="color: #FF4949" type="text">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column v-if="detailType === 3" label="事件状态" width="85" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status_flag == '4'" style="color: #14BC6C" type="text">已完成</el-button>
                  <el-button v-if="scope.row.status_flag == '2'" style="color: #939499" type="text">无需出警</el-button>
                  <el-button v-if="scope.row.status_flag == '0'" style="color: #FF4949" type="text">未查看</el-button>
                  <el-button v-if="scope.row.status_flag == '1'" style="color: #FF7428" type="text">已接警</el-button>
                  <el-button v-if="scope.row.status_flag == '3'" style="color: #1AB9FF" type="text">已出警</el-button>
                  <el-button v-if="scope.row.status_flag == '5'" style="color: #FF4949" type="text">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70" fixed="right" align="right">
                <template slot-scope="scope">
                  <template v-if="detailType === 1">
                    <el-button v-if="detailType === 1" style="color: #4968FF; margin-left: 8px" type="text" @click="handleVideo(scope.row, 1)">播放</el-button>
                  </template>
                  <template v-if="detailType === 3">
                    <el-button v-if="scope.row.trigger_type == '0'" style="color: #4968FF; margin-left: 8px" type="text" @click="handleAudio(scope.row)">播放</el-button>
                    <el-button v-if="scope.row.trigger_type == '2'" style="color: #4968FF; margin-left: 8px" type="text" @click="handleVideo(scope.row, 2)">播放</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-form>
    <!-- 播放视频 -->
    <el-dialog
      title="播放视频"
      :append-to-body="true"
      :visible.sync="videoVisible"
      :custom-class="'default-table-size'"
      :close-on-click-modal="false"
    >
      <page-video v-if="videoVisible" :video-player="videoPlayer" />
    </el-dialog>
    <!-- 播放音频 -->
    <el-dialog
      title="播放音频"
      :append-to-body="true"
      :visible.sync="audioVisible"
      :custom-class="'default-small-size'"
      :close-on-click-modal="false"
    >
      <page-audio v-if="audioVisible" :audio-player="audioPlayer" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PageVideo from '@/components/PageVideo'
import PageAudio from '@/components/PageAudio'
import { decrypt, httpRequest } from '@/utils/auth'
export default {
  name: 'EquipmentDetails',
  components: { Pagination, PageVideo, PageAudio },
  filters: {
    timeFormat(value) {
      var str = value ? value.substr(0, value.indexOf('.')) : ''
      return value ? str.replace('T', ' ') : ''
    }
  },
  props: {
    detailType: {
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
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      height: window.innerHeight - 170,
      activeName: 'detail',
      lnglat: {
        lat: 0,
        lng: 0
      },
      coords_show: false, // true 保存 false编辑
      list: [],
      search: {
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      total: 0,
      videoVisible: false,
      videoPlayer: {
        src: '', // 视频地址
        title: '', // 标题
        loop: false, // 循环播放
        autoplay: false // 自动播放
      },
      audioVisible: false,
      audioPlayer: {
        src: '', // 音频地址
        title: '' // 标题
      }
    }
  },
  methods: {
    handleActiveName() {
      this.activeName = 'detail'
    },
    handleClick() {
      if (this.activeName === 'list') {
        this.queryData()
      }
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    fetchData() {
      if (this.detailType === 1) {
        this.$set(this.search, 'equ_id', this.info.equ_id)
        httpRequest('/api/pajx/camera/alarm/event/paginate', this.search, false).then(res => {
          const data = JSON.parse(decrypt(res.data))
          this.total = data.total
          this.list = data.records
        })
      } else if (this.detailType === 3) {
        this.$set(this.search, 'deviceId', this.info.id)
        httpRequest('/api/sys/alarmEvent/paginate', this.search, false).then(res => {
          const data = JSON.parse(decrypt(res.data))
          this.total = data.total
          this.list = data.records
        })
      }
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
        vv.top = map[kk].offsetTop - 36 + 'px'
        vv.left = map[kk].offsetLeft - 60 + 'px'
        vv.status = false
        vv.draggable = false
      })
    },
    // 鼠标移入点标记时触发事件
    handleMoveMap(data, type) {
      if (!this.coords_show) {
        this.handleResetMap()
        type === 1 ? data.status = true : data.status = false
      }
    },
    // 鼠标移出点标记时触发事件
    handleOutMap(data) {
      if (!this.coords_show) {
        this.handleResetMap()
        data.status = false
      }
    },
    // 鼠标在点标记上按下时触发事件
    handleDownMap(data) {
      if (this.coords_show) {
        data.draggable = true
      }
    },
    // 开始拖拽点标记时触发事件
    handleDragStart(data) {
      if (this.coords_show) {
        data.status = false
      }
    },
    // 点标记拖拽移动结束触发事件
    handleDragend(e, data) {
      if (this.coords_show) {
        this.lnglat.lng = e.lnglat.lng.toString()
        this.lnglat.lat = e.lnglat.lat.toString()
        data.draggable = false
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
        if (this.detailType === 1) {
          httpRequest('/api/pajx/camera/edit/coordinate', {
            equ_id: this.info.equ_id,
            equ_coordinate: str
          }).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else if (this.detailType === 2) {
          httpRequest('/api/sys/audioInfo/updateEquCoordinate', {
            equId: this.info.equ_id,
            equCoordinate: str
          }).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
        this.$emit('handleEditCoords', {
          str: this.lnglat,
          type: 2
        })
        // 请求接口 保存新坐标
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
    // 播放视频
    handleVideo(data, type) {
      if (type === 1) {
        if (data.video_url) {
          this.videoPlayer.src = data.video_url
          this.videoVisible = true
        } else {
          this.$message({
            message: '无视频播放地址',
            type: 'error'
          })
        }
      } else {
        if (data.audio_url) {
          this.videoPlayer.src = data.audio_url
          this.videoVisible = true
        } else {
          this.$message({
            message: '无视频播放地址',
            type: 'error'
          })
        }
      }
    },
    // 播放音频
    handleAudio(data) {
      if (data.audio_url) {
        this.audioPlayer.src = data.audio_url
        this.audioVisible = true
      } else {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin: 0 !important;
}

::v-deep .el-form-item__label {
  color: #939499 !important;
}

::v-deep .el-form-item__content {
  color: #323338 !important;
}

.equipment-item {
  display: flex;
  align-items: center;
  height: 26px;
  margin-bottom: 14px;

  .equipment-title {
    font-weight: 500;
    font-size: 18px;
    color: #323338;
    margin-right: 8px;
  }

  .icon-img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}

.map-item {
  position: relative;
  width: 100%;
  height: 260px;
  margin-top: 8px;
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
}

.set-coords {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.block-audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EAEDF3;
  border-radius: 2px;
  font-weight: 400;
  font-size: 12px;
  color: #5E6166;
  cursor: pointer;

  .block-icon {
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
}
</style>
