<template>
  <div class="index-container page-container right-side-dialog">
    <div class="top-center">
      <div class="left-map">
        <template v-for="(item, index) in markers">
          <div v-if="item.status" :key="index" :style="{top: item.top, left: item.left}" class="tips">
            <div class="tips-title">
              <div class="title-icon">
                <img class="icon-demo" :src="item.equ_flag === 1 ? require('@/assets/images/round_demo.png') : require('@/assets/images/round_video.png')">
                <div class="title-txt">{{ item.equ_name }}</div>
              </div>
              <div class="tips-txt" :class="item.online_flag === 1 ? 'online' : ''">
                {{ item.online_flag === 1 ? '在线' : '离线' }}
              </div>
            </div>
            <div class="equ_position">位置：{{ item.equ_position }}</div>
            <div v-if="item.equ_flag === 1" class="tips-item">
              报警数：{{ item.alarms_number }}
            </div>
            <div v-if="item.equ_flag === 1" class="tips-item">
              出警数：{{ item.police_number }}
              <span v-if="auth.audio != 1" class="see-txt" @click="handleSeeDetail(item.equ_id, 1)">查看设备详情</span>
            </div>
            <div v-if="item.equ_flag === 0" class="tips-item flex-end">
              <span v-if="auth.camera != 1" class="see-txt" @click="handleSeeDetail(item.equ_id, 0)">查看设备详情</span>
            </div>
            <div class="popper__arrow" />
          </div>
        </template>
        <el-amap
          ref="map"
          class="amap-box"
          view-mode="3D"
          :zoom="18"
          :zooms="[6, 20]"
          :center="center"
          :expand-zoom-range="true"
          :show-label="true"
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
            @click="handleClickMap(item, index)"
          />
        </el-amap>
      </div>
      <div class="data-see">
        <div class="title-number">
          <div class="title-txt">数据总览</div>
          <div class="list-number">
            <div class="list-item">
              <div class="list-txt">{{ data_view.sum || 0 }}</div>
              <div class="number-txt">设备总数</div>
              <div class="demo-video">
                <div class="demo-title">音频设备:<span class="num">{{ data_view.au_sum || 0 }}</span></div>
                <div class="demo-title">摄像头:<span class="num">{{ data_view.cm_sum || 0 }}</span></div>
              </div>
            </div>
            <div class="list-item">
              <div class="list-txt success">{{ data_view.on_sum || 0 }}</div>
              <div class="number-txt">在线数</div>
              <div class="demo-video">
                <div class="demo-title">音频设备:<span class="num">{{ data_view.au_on_sum || 0 }}</span></div>
                <div class="demo-title">摄像头:<span class="num">{{ data_view.cm_on_sum || 0 }}</span></div>
              </div>
            </div>
            <div class="list-item">
              <div class="list-txt info">{{ data_view.off_sum || 0 }}</div>
              <div class="number-txt">离线数</div>
              <div class="demo-video">
                <div class="demo-title">音频设备:<span class="num">{{ data_view.au_off_sum || 0 }}</span></div>
                <div class="demo-title">摄像头:<span class="num">{{ data_view.cm_off_sum || 0 }}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="function-chars">
          <div class="top-title">
            <div class="title-txt">事件分析</div>
            <el-date-picker
              v-model="event_date"
              style="width: 380px"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handleGetAnalysis(event_type)"
            />
          </div>
          <div class="list-btn">
            <div class="item-btn" :class="event_type === 1 ? 'btn-active' : ''" @click="handleGetAnalysis(1)">事件等级</div>
            <div class="item-btn" :class="event_type === 2 ? 'btn-active' : ''" @click="handleGetAnalysis(2)">关键字</div>
            <div class="item-btn" :class="event_type === 3 ? 'btn-active' : ''" @click="handleGetAnalysis(3)">响应速度</div>
          </div>
          <div id="chart" ref="chart" class="chart" />
        </div>
      </div>
    </div>
    <div class="footer-center">
      <div class="left-footer">
        <div id="line" class="line" />
      </div>
      <div class="right-footer">
        <div class="top-block">
          <div class="top-txt">告警统计</div>
          <el-select v-model="years_time" style="width: 100px" placeholder="请选择" @change="handleGetStatistical">
            <el-option
              v-for="(item, index) in years"
              :key="index"
              :label="item + '年'"
              :value="item"
            />
          </el-select>
        </div>
        <div class="btn-block">
          <div v-for="(item, index) in alarm_list" :key="index" class="block-item">
            <img class="item-icon" :src="item.icon">
            <div class="list-item">
              <div class="list-txt" :style="{ color: item.color }">{{ item.num }}</div>
              <div class="number-txt">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 设备详情 -->
    <el-dialog
      title="设备详情"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <equipment-details
          v-if="detailVisible"
          :detail-type="detail_info.detail_type"
          :markers="markers_info"
          :info="detail_info"
          @getLocation="handleGetLocation"
          @handleEditCoords="handleEditCoords"
          @handlePlay="handleAudio"
        />
      </el-scrollbar>
    </el-dialog>
    <!-- 播放音频 -->
    <el-dialog
      title="播放音频"
      :visible.sync="audioVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-audio"
    >
      <audio-play v-if="audioVisible" ref="audio_play" :audio-url="detail_info.audio_url" />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'
import { formatStrDate } from '@/filters'
import { decrypt, httpRequest } from '@/utils/auth'
import EquipmentDetails from '@/components/EquipmentDetails'
import { mapState } from 'vuex'
export default {
  name: 'HomePage',
  components: { EquipmentDetails },
  data() {
    return {
      height: window.innerHeight - 98,
      auth: {},
      data_view: {}, // 数据总览
      event_type: 1, // 事件分析 1事件等级 2关键字 3响应速度
      event_date: [
        moment(moment(new Date()).startOf('month').subtract('month', 0)).format('YYYY-MM-DD') + ' 00:00:00',
        moment(moment(new Date()).endOf('month').subtract('month', 0).endOf('month')).format('YYYY-MM-DD') + ' 23:59:59'
        // moment().format('YYYY-MM-DD') + ' 00:00:00',
        // moment().format('YYYY-MM-DD') + ' 23:59:59'
      ], // 事件分析 日期
      years_time: moment().year(),
      years: [moment().year()],
      alarm_list: [
        {
          num: 0,
          title: '未查看',
          color: '#FF3434',
          icon: require('@/assets/images/fall.png')
        },
        {
          num: 0,
          title: '已接警',
          color: '#FFA200',
          icon: require('@/assets/images/smoking.png')
        },
        {
          num: 0,
          title: '已出警',
          color: '#3272FF',
          icon: require('@/assets/images/broke.png')
        },
        {
          num: 0,
          title: '已完成',
          color: '#00CE84',
          icon: require('@/assets/images/fight.png')
        },
        {
          num: 0,
          title: '无需出警',
          color: '#5E6166',
          icon: require('@/assets/images/not.png')
        }
      ],
      center: ['113.731372', '34.768085'], // 地图中心点经纬度
      markers: [],
      detail_show: false,
      markers_show: false,
      audioVisible: false,
      detailVisible: false,
      detail_info: {},
      markers_info: [],
      option: {
        title: {},
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        color: ['#3272FF', '#FFBF28', '#FF8939', '#FF3434', '#00BBFF', '#2ECC71', '#9B59B6', '#1ABC9C', '#F164BC', '#95A5A6'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: []
          }
        ]
      },
      line_option: {
        title: {
          text: '事件趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          itemWidth: 12,
          itemHeight: 12,
          data: [{
            name: '出警数',
            icon: 'rect'
          }, {
            name: '完成数',
            icon: 'rect'
          }, {
            name: '报警数',
            icon: 'rect'
          }]
        },
        color: ['#41BBFF', '#3CC355', '#FF5A54'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#909399'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#909399'
              }
            }
          }
        ],
        series: [
          {
            name: '出警数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(65, 187, 255, 0.5)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(65, 187, 255, 0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(65, 187, 255, 0.1)'
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            data: []
          },
          {
            name: '完成数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(60, 195, 85, 0.5)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(60, 195, 85, 0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(60, 195, 85, 0.1)'
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            data: []
          },
          {
            name: '报警数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255, 90, 84, 0.5)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(255, 90, 84, 0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 90, 84, 0.1)'
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    detailVisible(val) {
      if (!val) {
        if (this.detail_show) {
          this.markers = []
          this.center = []
          this.handleGetCoords()
          this.handleResetMap()
          this.detail_show = false
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('onmessageWS', this.getSocketData, true)
  },
  mounted() {
    this.permissionAuth()
    for (var i = 1; i < 6; i++) {
      this.years.push(this.years_time - i)
    }
    this.handleGetOverview()
    this.handleGetStatistical()
    this.handleGetAnalysis(1)
    this.handleGetTrend()
    this.handleGetCoords()
    window.addEventListener('onmessageWS', this.getSocketData, true)
  },
  methods: {
    handleFormatIcon() {
      this.markers.map((item) => {
        item.icon = Number(item.equ_flag) === 1 ? require('@/assets/images/pun_demo.webp') : require('@/assets/images/pun_video.webp')
      })
    },
    getSocketData(res) {
      if (res.detail.cmd === 'event_not_handle') {
        var data = res.detail.data
        this.handleGetStatistical()
        this.handleGetTrend(data)
      }
    },
    handleAddList(data) {
      if (this.markers.length !== 0) {
        this.markers.map((item) => {
          if (item.equ_no === data.equ_no) {
            item.icon = item.equ_flag === 1 ? require('@/assets/images/flash_audio.webp') : require('@/assets/images/flash_video.webp')
            this.center = [item.position[0], item.position[1]]
            setTimeout((res) => {
              this.handleFormatIcon()
            }, 10000)
          }
        })
      }
    },
    // 获取按钮权限
    permissionAuth() {
      this.auth.audio = this.permission.indexOf('/api/pajx/funtion/audio')
      this.auth.camera = this.permission.indexOf('/api/pajx/funtion/camera')
    },
    // 获取数据总览
    handleGetOverview() {
      httpRequest('/api/pajx/funtion/data', {}, false).then((res) => {
        this.data_view = JSON.parse(decrypt(res.data))
      })
    },
    // 获取事件分析  1事件等级 2关键字 3响应速度
    handleGetAnalysis(type) {
      this.event_type = type
      var api = type === 1 ? '/api/pajx/funtion/event/level' : type === 2 ? '/api/pajx/funtion/keyword' : '/api/pajx/funtion/response/speed'
      httpRequest(api, {
        start_time: formatStrDate(this.event_date[0]),
        finish_time: formatStrDate(this.event_date[1])
      }, false).then((res) => {
        if (type === 3) {
          var obj = JSON.parse(decrypt(res.data))
          this.option.series[0].data = [
            {
              name: '暂无响应',
              value: obj.not_deal_num || 0
            }, {
              name: '小于30分钟',
              value: obj.small_num || 0
            }, {
              name: '大于30分钟',
              value: obj.large_num || 0
            }
          ]
        } else {
          this.option.series[0].data = JSON.parse(decrypt(res.data))
        }
        if (this.option.series[0].data.length === 0) {
          var no_txt = type === 1 ? '事件等级' : type === 2 ? '关键字' : '响应速度'
          this.option.title = {
            text: '筛选日期内' + no_txt + '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              fontSize: '18',
              color: 'grey'
            }
          }
        } else {
          this.option.title = {
            text: ''
          }
        }
        var chart = echarts.init(document.getElementById('chart'))
        chart.setOption(this.option)
        window.onresize = () => {
          setTimeout(() => {
            chart.resize()
          }, 50)
        }
      })
    },
    // 获取告警统计
    handleGetStatistical() {
      httpRequest('/api/pajx/funtion/alarm/statistics', {
        time: this.years_time
      }, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        this.alarm_list[0].num = data.zeor
        this.alarm_list[1].num = data.one
        this.alarm_list[2].num = data.three
        this.alarm_list[3].num = data.four
        this.alarm_list[4].num = data.two
      })
    },
    // 获取事件趋势
    handleGetTrend(info = null) {
      httpRequest('/api/pajx/funtion/event/trend', {}, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        data.map((item) => {
          this.line_option.xAxis[0].data.push(this.handleFormat(item.time))
          this.line_option.series[0].data.push(item.call_the_police)
          this.line_option.series[1].data.push(item.complete)
          this.line_option.series[2].data.push(item.alarm)
        })
        var line = echarts.init(document.getElementById('line'))
        line.setOption(this.line_option)
        if (info) {
          this.handleAddList(info)
        }
        window.onresize = () => {
          setTimeout(() => {
            line.resize()
          }, 50)
        }
      })
    },
    handleFormat(val) {
      var pattern = /(\d{4})(\d{2})/
      return val ? val.replace(pattern, '$1-$2') : ''
    },
    // 获取坐标点
    handleGetCoords() {
      httpRequest('/api/pajx/funtion/list', {}).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        if (data.length !== 0) {
          var str = data[0].equ_coordinate.split(',')
          this.center = [str[0], str[1]]
          data.map((item) => {
            var position = item.equ_coordinate.split(',')
            this.markers.push({
              equ_id: item.equ_id,
              equ_no: item.equ_no,
              equ_name: item.equ_name,
              equ_flag: Number(item.equ_flag),
              alarms_number: item.alarms_number,
              police_number: item.police_number,
              online_flag: Number(item.online_flag),
              equ_coordinate: item.equ_coordinate,
              equ_position: item.equ_position,
              icon: Number(item.equ_flag) === 1 ? require('@/assets/images/pun_demo.webp') : require('@/assets/images/pun_video.webp'),
              top: '0',
              left: '0',
              status: false,
              position: [position[0], position[1]]
            })
          })
        } else {
          this.center = ['113.731372', '34.768085']
        }
      })
    },
    handleComplete() {
      this.$refs.map.$$getInstance().setFitView(null)
      this.center = this.$refs.map.center
      // var lat = Number(center[1]) - Number(0.0006)
      // this.center = [center[0], lat]
    },
    // 定位
    getLocation(e) {
      this.center[0] = e.position.lng
      this.center[1] = e.position.lat
    },
    // 地图相关配置
    handleClickMap(data, index) {
      if (!this.markers_show) {
        this.handleResetMap()
      }
      this.markers.map((item, kk) => {
        if (kk === index) {
          item.status = !item.status
        } else {
          item.status = false
        }
      })
    },
    // 重置地图标点位置
    handleResetMap() {
      var map = document.getElementsByClassName('amap-marker')
      this.markers.map((vv, kk) => {
        vv.top = vv.equ_flag === 1 ? map[kk].offsetTop - 118 + 'px' : map[kk].offsetTop - 98 + 'px'
        vv.left = map[kk].offsetLeft - 110 + 'px'
        vv.status = false
      })
      this.markers_show = true
    },
    // 设备详情
    handleSeeDetail(equ_id, type) {
      var api = type === 1 ? '/api/pajx/funtion/audio' : '/api/pajx/funtion/camera'
      httpRequest(api, {
        equ_id: equ_id
      }, false).then((res) => {
        var info = JSON.parse(decrypt(res.data))
        this.markers_info = []
        this.detail_info = info || {}
        this.$set(this.detail_info, 'detail_type', type)
        var coordinate = this.detail_info.equ_coordinate.split(',')
        this.$set(this.detail_info, 'center', coordinate)
        this.markers_info = [{
          id: '10',
          top: '0',
          left: '0',
          status: false,
          position: coordinate
        }]
        if (type === 1) {
          this.$set(this.detail_info, 'equ_id', equ_id)
          this.detail_info.audio_url = this.detail_info.audio_url ? process.env.VUE_APP_BASE_API + this.detail_info.audio_url : ''
        }
        this.detailVisible = true
      })
    },
    handleGetLocation(data) {
      this.detail_info.center = [data.lng, data.lat]
    },
    handleEditCoords(data) {
      if (data.type === 1) {
        this.markers_info = []
        this.markers_info.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [data.str.lng, data.str.lat]
        })
      } else if (data.type === 2) {
        this.markers_info = []
        this.markers_info.push({
          id: data.str.lng,
          top: '0',
          left: '0',
          status: false,
          position: [data.str.lng, data.str.lat]
        })
        this.detail_info.center = [data.str.lng, data.str.lat]
        this.detail_info.equ_coordinate = data.str.lng + ',' + data.str.lat
        this.detail_show = true
      } else {
        var str = this.detail_info.equ_coordinate.split(',')
        this.markers_info = []
        this.markers_info.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.detail_info.center = [str[0], str[1]]
      }
    },
    handleAudio() {
      if (this.detail_info.audio_url) {
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

<style lang="scss">
.index-container {
  padding: 16px;
}

.top-center {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .left-map {
    position: relative;
    width: 65%;
    height: 657px;
    border-radius: 8px;
    overflow: hidden;

    .amap-box {
      width: 100%;
      height: 657px;
    }

    .tips {
      position: absolute;
      z-index: 8;
      width: 249px;
      background: rgba(0,0,0,0.50);
      border-radius: 6px;
      padding: 8px;

      .tips-title {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .title-icon {
          display: flex;
          align-items: center;
        }

        .icon-demo {
          width: 20px;
          height: 20px;
        }

        .title-txt {
          width: 170px;
          height: 20px;
          font-weight: Bold;
          font-size: 13px;
          margin-left: 4px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tips-txt {
          height: 20px;
          font-size: 12px;
          letter-spacing: 0;
          line-height: 20px;
          color: #909399;
        }

        .online {
          color: #3DC35F;
        }
      }

      .tips-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 18px;
        font-size: 12px;
        color: rgba(255,255,255,0.80);
        letter-spacing: 0;
        line-height: 18px;
        margin-bottom: 4px;

        .see-txt {
          margin-left: 4px;
          height: 18px;
          font-size: 12px;
          color: #34D0F2;
          letter-spacing: 0;
          line-height: 18px;
          cursor: pointer;
        }
      }

      .equ_position {
        width: 230px;
        height: 18px;
        font-size: 12px;
        color: rgba(255,255,255,0.80);
        letter-spacing: 0;
        line-height: 18px;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .flex-end {
        justify-content: flex-end;
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

  .data-see {
    margin-left: 16px;
    width: 35%;

    .title-number {
      width: 100%;
      background: #3272FF;
      margin-bottom: 16px;
      border-radius: 8px;
      padding: 16px;

      .title-txt {
        height: 25px;
        font-weight: 600;
        font-size: 18px;
        color: #FFFFFF;
        letter-spacing: 0;
        margin-bottom: 13px;
      }

      .list-number {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .list-item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .list-txt {
            font-weight: Bold;
            font-size: 35px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: center;
            margin-bottom: 15px;
          }

          .number-txt {
            height: 20px;
            font-weight: 400;
            font-size: 14px;
            color: rgba(255,255,255,0.60);
            letter-spacing: 0;
            text-align: center;
            margin-bottom: 12px;
          }

          .demo-video {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;

            .demo-title {
              height: 17px;
              font-weight: 400;
              font-size: 12px;
              color: rgba(255,255,255,0.60);
              letter-spacing: 0;
              line-height: 17px;

              .num {
                color: #FFFFFF;
              }
            }

            .demo-title:first-child {
              margin-right: 12px;
            }
          }

          .success {
            color: #37FF5E;
          }

          .error {
            color: #FF7373;
          }

          .info {
            color: #FFBB6C;
          }
        }
      }
    }

    .function-chars {
      width: 100%;
      height: 467px;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 16px;

      .top-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .title-txt {
          font-weight: 600;
          font-size: 18px;
          color: #2C2E33;
          letter-spacing: 0;
        }
      }

      .list-btn {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 20px;

        .item-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px 8px;
          background: #F0F2F5;
          border: 1px solid #F0F2F5;
          border-radius: 4px;
          margin-right: 12px;
          font-size: 12px;
          color: #5E6166;
          cursor: pointer;
          margin-bottom: 5px;
        }

        .btn-active {
          color: #3272FF;
          background: #F1F5FF;
          border: 1px solid #3272FF;
        }
      }

      .chart {
        width: 100%;
        height: 330px;
      }
    }
  }
}

.footer-center {
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .left-footer {
    width: 50%;
    margin-right: 16px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 16px;

    .line {
      width: 100%;
      height: 300px;
    }
  }

  .right-footer {
    width: 50%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 16px;

    .top-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      .top-txt {
        height: 25px;
        font-weight: 600;
        font-size: 18px;
        color: #2C2E33;
        letter-spacing: 0;
      }
    }

    .btn-block {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .block-item {
        width: 170px;
        height: 237px;
        background: #F5F7FA;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .item-icon {
          width: 48px;
          height: 48px;
          background: #DFF2EB;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .list-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .list-txt {
            font-weight: Bold;
            font-size: 35px;
            letter-spacing: 0;
            margin-bottom: 10px;
          }

          .number-txt {
            font-weight: 400;
            font-size: 14px;
            color: #909399;
            letter-spacing: 0;
          }
        }
      }
    }
  }
}

.volume-audio {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 150px !important;
  overflow-y: hidden !important;
}
</style>
