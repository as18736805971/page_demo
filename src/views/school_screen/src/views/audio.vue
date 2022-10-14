<template>
  <div class="container">
    <div class="header_view">
      <div class="header_title">
        <div class="header_title_school">校园防欺凌AI预警平台</div>
        <div class="header_title_desc">{{ scl_name }}</div>
      </div>
      <div class="header_fr">
        <span style="font-weight: Bold; font-size: 32px;">{{ date.dateDay }}</span>
        <div style="display: inline-block; text-align: left;margin: 0 32px 0 12px;font-size: 14px;">
          <div>{{ date.dateYear }}</div>
          <div>{{ date.dateWeek }}</div>
        </div>
        <img style="cursor: pointer" src="../assets/header_fr.png" alt="" @click="audio_show = true">
      </div>
    </div>
    <div class="content_view">
      <!-- 左侧 -->
      <div class="content_left_view">
        <div class="top_left_view">
          <div class="day-number">
            <div class="block-list">
              <div class="block-item">{{ count[0] }}</div>
              <div class="block-item">{{ count[1] }}</div>
              <div class="block-item">{{ count[2] }}</div>
              <div class="block-item">{{ count[3] }}</div>
            </div>
            <div class="block-txt">
              <div class="block-txt-num">今日告警数量</div>
              <div class="block-yesterday-num">
                <img class="triangle" :src="yesterday <= -1 ? require('@/assets/down.png') : yesterday >= 1 ? require('@/assets/top.png') : require('@/assets/equal.png')">
                <div class="day-num" :class="yesterday <= -1 ? 'down' : yesterday >= 1 ? 'top' : ''">{{ yesterday > 0 ? '+' + yesterday : yesterday }}</div>
                <div class="day-txt">较昨日</div>
              </div>
            </div>
          </div>
          <div class="all-days">
            <div class="card_header_view">
              <i />
              <span>告警事件统计</span>
            </div>
            <div class="event_list">
              <div class="event_top_list">
                <div class="event_item" style="margin-right: 20px">
                  <img class="event-icon" src="@/assets/fall.png">
                  <div class="event-txt">
                    <div class="event-num">{{ statistics.untreated }}</div>
                    <div>未处理</div>
                  </div>
                </div>
                <div class="event_item">
                  <img class="event-icon" src="@/assets/broke.png">
                  <div class="event-txt">
                    <div class="event-num out">{{ statistics.have }}</div>
                    <div>已出警</div>
                  </div>
                </div>
              </div>
              <div class="event_top_list">
                <div class="event_item" style="margin-right: 20px">
                  <img class="event-icon" src="@/assets/fight.png">
                  <div class="event-txt">
                    <div class="event-num success">{{ statistics.completed }}</div>
                    <div>已完成</div>
                  </div>
                </div>
                <div class="event_item">
                  <img class="event-icon" src="@/assets/not.png">
                  <div class="event-txt">
                    <div class="event-num info">{{ statistics.not }}</div>
                    <div>无需出警</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="speed-content">
            <div class="card_header_view">
              <i />
              <span>累计事件统计</span>
            </div>
            <div class="cumulative-list">
              <div class="cumulative-title">
                <div class="cumulative-txt">
                  <div>累计预警事件</div>
                  <div class="cumulative-txt-num">{{ cumulative.event_sum }}</div>
                </div>
                <div class="cumulative-txt">
                  <div>本年预警事件</div>
                  <div class="cumulative-txt-num">{{ cumulative.event_year }}</div>
                </div>
              </div>
              <div id="year_line" class="cumulative-line" />
            </div>
          </div>
        </div>
        <!-- 预警关键词 -->
        <div class="bottom_card_view">
          <div class="card_header_view">
            <i />
            <span>预警关键词</span>
          </div>
          <div id="keyword_content" class="card_content keyword_content">
            <template v-for="(item, index) in keyword_list">
              <div v-if="item.name" :key="index" class="keyword_cell">
                <template v-if="(index + 1) < 4">
                  <span :class="'index' + (index + 1)">{{ index + 1 }}</span>
                </template>
                <template v-else>
                  <span class="index">{{ index + 1 }}</span>
                </template>
                <span class="keyword">{{ item.name }}</span>
                <div class="keyword_ratio_view">
                  <div class="keyword_ratio" :style="{ width: item.length }" />
                </div>
                <span>{{ item.value }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="content_center_view">
        <!-- 设备地图 -->
        <div class="top_card_view">
          <div class="card_header_view month_card">
            <i />
            <span>设备地图</span>
          </div>
          <template v-for="(item, index) in markers">
            <div v-if="item.status" :key="index" :style="{top: item.top, left: item.left}" class="tips">
              <div class="tips-title">
                <div class="title-icon">
                  <img class="icon-demo" :src="require('../assets/round_audio.png')">
                  <div class="title-txt">{{ item.equ_name }}</div>
                </div>
                <div class="tips-txt" :class="item.online_flag === 1 ? 'online-txt' : ''">
                  {{ item.online_flag === 1 ? '在线' : '离线' }}
                </div>
              </div>
              <div class="equ_position">位置：{{ item.equ_position }}</div>
              <div class="tips-item">
                报警数：{{ item.alarms_number }}
              </div>
              <div class="tips-item">
                出警数：{{ item.police_number }}
              </div>
              <div class="popper__arrow" />
            </div>
          </template>
          <el-amap
            ref="map"
            class="map-amap"
            map-style="amap://styles/e3549d7520806df6f03f8e6e97f854bc"
            :center="center"
            view-mode="3D"
            :zoom="17"
            :pitch="30"
            :zooms="[6, 20]"
            :expand-zoom-range="true"
            :show-label="true"
            @dragend="handleResetMap"
            @zoomend="handleResetMap"
            @complete="handleComplete"
          >
            <el-amap-marker
              v-for="(item, index) in markers"
              :key="index"
              :icon="item.icon"
              :position="item.position"
              @click="handleClickMap(item, index)"
            >
              <div v-if="item.icon_show" class="point" />
            </el-amap-marker>
          </el-amap>
          <div class="map_list">
            <div class="map-item">
              <div class="equipment-item">
                <img class="equipment-item-icon" src="../assets/pun_audio1.png">
                <div class="equipment-item-list">
                  <div class="equipment-title">音频设备</div>
                  <div class="equipment-num">
                    <span>在线：<span style="font-size: 14px;color: #44ADFF">{{ equipment_info.on_audio }}</span></span>
                    <span>离线：<span style="font-size: 14px;color: #FF5E5E">{{ equipment_info.off_audio }}</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div id="map_item_list" class="map_item_list">
              <div v-for="(item, index) in equipment_list" :key="index" class="map_block_item" @click="handleClickEquipment(item.equ_no)">
                <div class="block-left">
                  <img style="width: 20px;height: 20px" :src="require('../assets/round_audio.png')">
                  <div>{{ item.equ_name }}</div>
                </div>
                <div :style="{color: item.online_flag == '1' ? '#3DC35F' : '#FF5E5E'}">{{ item.online_flag == '1' ? '在线' : '离线' }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 预警趋势 -->
        <div class="bottom_card_view">
          <div class="card_header_view month_card">
            <i />
            <span>预警趋势</span>
          </div>
          <div class="card_content" style="position: relative">
            <div id="echarts_demo_1" style="width: 100%; height: 100%" />
            <div class="echarts_legend1">
              <span style="margin-right: 8px"><i style="background-color: #44adff" />报警数</span>
              <span><i style="background-color: #44ff9f" />完成数</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="content_right_view">
        <!-- 实时预警 -->
        <div class="top_card_view">
          <div class="card_header_view">
            <i />
            <span>实时预警</span>
          </div>
          <div class="card_content" style="overflow: hidden">
            <div v-if="warning_info.equ_no && warning_info.equ_no !== ''" class="real_cell1">
              <template v-if="Number(warning_info.event_flag) === 1">
                <template v-if="Number(warning_info.trigger_type) === 0">
                  <div class="real_img" @click="handlePlayAudio(warning_info, 0, 1)">
                    <template v-if="warning_info.audio_status">
                      <img src="../assets/real_icon_1.webp" class="real_icon_1" alt="">
                    </template>
                    <template v-else>
                      <img src="../assets/real_icon_1.png" class="real_icon_1" alt="">
                      <img src="../assets/real_icon_2.png" class="real_icon_2" alt="">
                    </template>
                  </div>
                </template>
                <template v-else-if="Number(warning_info.trigger_type) === 1">
                  <div class="real_img" style="border: none">
                    <img src="../assets/real_btn.png" class="real_icon_3">
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="real_video_img_new" @click="handlePlay(warning_info, warning_info.video_url)">
                  <video id="real_video_img" style="width: 80px; height: 80px;object-fit: cover !important;" />
                  <img src="../assets/real_icon_3.png" class="real_icon_2" alt="">
                </div>
              </template>
              <div class="real_content">
                <div class="real_content_item">
                  <div class="real_item_block">
                    <template v-if="Number(warning_info.trigger_type) === 1">
                      <span class="real_content_keyword" style="color: #FF5E5E">按钮报警</span>
                    </template>
                    <template v-else>
                      <span class="real_content_keyword" style="color: #FF5E5E">{{ warning_info.keyword }}</span>
                    </template>
                    <span class="block_real_btn">{{ warning_info.status_flag_name }}</span>
                  </div>
                  <span style="float: right;font-size: 14px">刚刚</span>
                </div>
                <div class="text-overflow">{{ warning_info.equ_name }}</div>
              </div>
            </div>

            <div id="warning_content" class="warning_content" :class="warning_info.equ_no && warning_info.equ_no !== '' ? '' : 'warning_content_list'">
              <div v-for="(item, index) in warning_list" :key="index" class="real_cell">
                <template v-if="Number(item.event_flag) === 1">
                  <template v-if="Number(item.trigger_type) === 0">
                    <div class="real_img" @click="handlePlayAudio(item, index, 2)">
                      <template v-if="item.audio_status">
                        <img src="../assets/real_icon_1.webp" class="real_icon_1" alt="">
                      </template>
                      <template v-else>
                        <img src="../assets/real_icon_1.png" class="real_icon_1" alt="">
                        <img src="../assets/real_icon_2.png" class="real_icon_2" alt="">
                      </template>
                    </div>
                  </template>
                  <template v-else-if="Number(item.trigger_type) === 1">
                    <div class="real_img" style="border: none">
                      <img src="../assets/real_btn.png" class="real_icon_3">
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="real_video_img" @click="handlePlay(item, item.video_url)">
                    <video class="video_img_item" style="width: 80px; height: 80px;object-fit: cover !important;" />
                    <img src="../assets/real_icon_3.png" class="real_icon_2" alt="">
                  </div>
                </template>
                <div class="real_content">
                  <div class="real_content_item">
                    <div class="real_item_block">
                      <template v-if="Number(item.trigger_type) === 1">
                        <span class="real_content_keyword">按钮报警</span>
                      </template>
                      <template v-else>
                        <span class="real_content_keyword">{{ item.keyword }}</span>
                      </template>
                      <span class="block_real_btn">{{ item.status_flag_name }}</span>
                    </div>
                    <span style="float: right;font-size: 14px">{{ item.create_time | formatDate }}</span>
                  </div>
                  <div class="text-overflow">{{ item.equ_name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 事件等级 -->
        <div class="bottom_card_view">
          <div class="card_header_view">
            <i />
            <span>事件等级</span>
          </div>
          <div class="card_content echarts_card" style="position: relative">
            <div class="echarts_view">
              <div id="echarts_demo_2" style="position: absolute;left: 5%;top: 50%;transform: translate(0, -50%);width: 240px;height: 150px" />
              <img src="../assets/echarts_bg1.webp" alt="">
              <div class="echarts_legend2">
                <div v-for="(item, index) in optionData" :key="index" class="echarts_block">
                  <div class="echarts_block_item" :style="{ background: item.itemStyle.color }" />
                  <span class="echarts_block_txt" :style="{ color: item.itemStyle.color }">{{ item.name }}</span>
                  <span class="echarts_block_num">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer_view" />

    <!-- 视频弹框 -->
    <transition name="el-fade-in-linear">
      <div v-if="video_show" class="bounced-content">
        <div class="mask-floating" @click.stop="handleCloseVideo()" />
        <div class="video_floating">
          <video ref="play_video" class="floating-video-item" :autoplay="true" :src="play_video.src" />
        </div>
      </div>
    </transition>
    <!-- 设置弹框 -->
    <transition name="el-fade-in-linear">
      <div v-if="audio_show" class="bounced-content">
        <div class="mask-floating" @click.stop="handleCloseAudio()" />
        <div class="audio_floating">
          <div class="floating-title">
            设置
            <img class="close-icon" src="../assets/close_icon.png" @click.stop="handleCloseAudio()">
          </div>
          <div class="floating-content">
            <div class="item-play-audio">
              <div class="horn-left">
                <img class="horn" src="../assets/horn.png">
                <div class="horn-txt">系统报警音</div>
              </div>
              <div class="horn-right">
                <el-switch
                  v-model="audio_play"
                  active-color="#44ADFF"
                  inactive-color="rgba(255,255,255,0.20)"
                  @change="handleSetAudio"
                />
              </div>
            </div>
            <div v-if="audio_play" class="item-play-audio">
              <div class="horn-left">
                <img class="horn" src="../assets/clock.png">
                <div class="horn-txt">报警音时长</div>
              </div>
              <div class="horn-slider">
                <el-slider
                  v-model="audio_play_num"
                  :min="10"
                  :max="120"
                  :step="10"
                  style="width: 260px;margin-right: 20px"
                  @change="handleSetAudioNum"
                />{{ audio_play_num }}秒
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 音频播放 -->
    <audio
      ref="play_audio"
      :autoplay="false"
      :src="play_video.audio"
      controls="controls"
      style="display: none"
      @ended="handleEndAudio"
    />
    <!-- 最新预警音频播放 -->
    <audio
      ref="play_new_audio"
      :autoplay="false"
      :src="warning_info.audio_url"
      controls="controls"
      style="display: none"
      @ended="handleNewEndAudio"
    />
    <!-- 报警背景音 -->
    <audio
      ref="play_audio1"
      :autoplay="false"
      :src="require('../assets/alarm_tone.mp3')"
      controls="controls"
      style="display: none"
      @ended="handleWarnEndAudio"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import { decrypt, httpRequest } from '@/utils/auth'
import { formatTime } from '@/utils/time'
export default {
  name: 'PageAudio',
  filters: {
    formatDate(value) {
      const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
      return value ? value.replace(pattern, '$1/$2/$3 $4:$5:$6') : ''
    }
  },
  data() {
    return {
      scroll_time: 6000,
      scl_name: '',
      count: [],
      yesterday: 0,
      date: {
        dateDay: null,
        dateYear: null,
        dateWeek: null,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      },
      timer: null,
      cross_timer: null,
      warning_timer: null,
      equipment_timer: null,
      get_map_timer: null, // 53分钟设置坐标
      get_equipment_timer: null, // 5分钟设备列表
      center: ['113.731372', '34.768085'],
      markers: [],
      equipment_info: {
        off_audio: 0,
        off_camera: 0,
        on_audio: 0,
        on_camera: 0
      }, // 设备数量
      equipment_list: [], // 设备列表
      markers_show: false,
      warning_info: {}, // 最新预警
      warning_list: [], // 预警列表
      video_show: false, // 视频弹框
      play_video: {
        src: '',
        audio: ''
      }, // 视频/音频播放地址
      audio_show: false, // 设置弹框
      set_index: 1, // 1设置 2摄像头列表
      // audio_play: Boolean(localStorage.getItem('audio')), // 设置开关背景音频
      // audio_play_num: Number(localStorage.getItem('audio_num')), // 设置背景音频播放次数
      audio_play: Boolean(localStorage.getItem('audio')), // 设置开关背景音频
      audio_play_num: Number(localStorage.getItem('audio_num')), // 设置背景音频播放次数
      audio_end_num: 0,
      audio_index: -1, // 播放时的音频索引
      keyword_list: [], // 关键词排行
      line_option: {
        color: ['#44FF9F', '#44ADFF'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '24px',
          left: '0',
          right: '0',
          bottom: '32px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.08)'
              }
            }
          }
        ],
        series: [
          {
            name: '完成数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(68,255,159,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(68,255,159,0)'
                }
              ])
            },
            data: []
          },
          {
            name: '报警数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(68,173,255,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(68,173,255,0)'
                }
              ])
            },
            data: []
          }
        ]
      }, // 折线图
      year_seven: {
        color: ['#44ADFF'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(51,51,51,0.2)',
          textStyle: {
            color: '#ffffff'
          }
        },
        grid: {
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '10px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#ffffff'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(255,255,255,0.08)'
              }
            }
          }
        ],
        series: [
          {
            name: '事件数量',
            type: 'line',
            stack: 'Total',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(68,173,255,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(68,173,255,0)'
                }
              ])
            },
            data: []
          }
        ]
      }, // 累计事件统计
      optionData: [
        {
          name: '',
          value: 0,
          itemStyle: {
            color: '#44ADFF'
          }
        },
        {
          name: '',
          value: 0,
          itemStyle: {
            color: '#FFBF28'
          }
        },
        {
          name: '',
          value: 0,
          itemStyle: {
            color: '#FF8939'
          }
        },
        {
          name: '',
          value: 0,
          itemStyle: {
            color: '#F35050'
          }
        }
      ], // 2D饼图
      statistics: {
        untreated: 0, // 未处理
        have: 0, // 已出警
        completed: 0, // 已完成
        not: 0 // 无需出警
      },
      cumulative: {
        event_sum: 0,
        event_year: 0
      }, // 累计事件统计
      lastDecodedFrame: 0
    }
  },
  beforeDestroy() {
    window.removeEventListener('onmessageWS', this.getSocketData, true)
    clearTimeout(this.timer)
    clearTimeout(this.cross_timer)
    clearTimeout(this.warning_timer)
    clearTimeout(this.equipment_timer)
    clearTimeout(this.get_map_timer)
    clearTimeout(this.get_equipment_timer)
    this.timer = null
    this.cross_timer = null
    this.warning_timer = null
    this.equipment_timer = null
    this.get_map_timer = null
    this.get_equipment_timer = null
  },
  mounted() {
    this.scl_name = JSON.parse(decrypt(sessionStorage.getItem('screen_role'))).scl_name
    this.handleGetTime() // 获取当前时间
    this.handleGetScreen() //  设备地图
    this.handleDayNum() // 今日预警条数
    this.handleGetWarningNum()
    this.handleCumulative()
    this.handleGetEquipment() // 获取设备列表
    this.handleWarningAlert() // 实时预警提醒
    this.handleGetCross() // 月预警关键词排行
    this.initEcharts() // 月预警数量趋势
    this.init() // 告警事件等级统计
    window.addEventListener('onmessageWS', this.getSocketData, true)
    this.get_map_timer = setInterval(() => {
      this.handleGetScreen()
    }, 3180000)
    this.get_equipment_timer = setInterval(() => {
      this.handleGetEquipment()
    }, 300000)
  },
  methods: {
    getSocketData(res) {
      if (res.detail.cmd === 'event_alarm') {
        var data = res.detail.data
        this.handleDayNum(data)
      }
    },
    handleAddWarning(data) {
      if (this.audio_play) {
        this.$refs.play_audio1.play()
      }
      data.audio_status = false
      this.$set(this, 'warning_info', data)
      if (this.markers.length !== 0) {
        this.markers.map((item) => {
          if (item.equ_no === data.equ_no) {
            item.icon = require('@/assets/flash_audio.webp')
            item.icon_show = true
            var lat = Number(item.position[1]) - Number(0.0010)
            this.center = [item.position[0], lat]
            setTimeout((res) => {
              this.handleFormatIcon()
            }, 60000)
          }
        })
      }
      this.handleGetWarningNum()
      this.handleCumulative()
      this.handleGetCross()
      this.initEcharts()
      this.init()
    },
    // 清除地图报警
    handleFormatIcon() {
      this.markers.map((item) => {
        item.icon = require('@/assets/pun_audio.png')
      })
      this.warning_info = {}
      this.handleWarningAlert()
      this.$refs.map.$$getInstance().setFitView()
      var center = this.$refs.map.center
      this.center = [center[0], center[1]]
    },
    // 设置自动滚动
    handleAutomaticRolling(id, cls) {
      $('#' + id + ' .' + cls + ':first').animate({ 'height': '0', 'opacity': '0' }, 'slow', function() {
        $(this).removeAttr('style').insertAfter('#' + id + ' .' + cls + ':last')
      })
    },
    // 今日预警条数
    handleDayNum(info = null) {
      httpRequest('/api/pajx/scl/bigscreen/today/yesterday', {}, false).then((res) => {
        const data = JSON.parse(decrypt(res.data))
        const num = data.today.toString()
        this.yesterday = Number(data.yesterday)
        this.count[0] = 0
        this.count[1] = 0
        this.count[2] = 0
        this.count[3] = 0
        if (num <= 9) {
          this.count[3] = num.substring(0, 1)
        } else if (num <= 99) {
          this.count[2] = num.substring(0, 1)
          this.count[3] = num.substring(1, 2)
        } else if (num <= 999) {
          this.count[1] = num.substring(0, 1)
          this.count[2] = num.substring(1, 2)
          this.count[3] = num.substring(2, 3)
        } else if (num <= 9999) {
          this.count[0] = num.substring(0, 1)
          this.count[1] = num.substring(1, 2)
          this.count[2] = num.substring(2, 3)
          this.count[3] = num.substring(3, 4)
        } else {
          this.count[0] = 9
          this.count[1] = 9
          this.count[2] = 9
          this.count[3] = 9
        }
        if (info) {
          this.handleAddWarning(info)
        }
      })
    },
    handleGetWarningNum() {
      httpRequest('/api/pajx/scl/bigscreen/alarm/statistics', {}, false).then((res) => {
        const data = JSON.parse(decrypt(res.data))
        this.statistics.untreated = data.zeor
        this.statistics.have = data.three
        this.statistics.completed = data.four
        this.statistics.not = data.two
      })
    },
    handleCumulative() {
      this.$set(this.year_seven.xAxis[0], 'data', [])
      this.$set(this.year_seven.series[0], 'data', [])
      const p1 = httpRequest('/api/pajx/scl/bigscreen/trend', {}, false)
      const p2 = httpRequest('/api/pajx/scl/bigscreen/cumulative', {}, false)
      Promise.all([p1, p2]).then((res) => {
        const year_seven = JSON.parse(decrypt(res[0].data))
        const cumulative = JSON.parse(decrypt(res[1].data))
        this.cumulative.event_sum = cumulative.event_sum
        this.cumulative.event_year = cumulative.event_year
        year_seven.forEach((item) => {
          this.year_seven.xAxis[0].data.push(item.name)
          this.year_seven.series[0].data.push(item.value)
        })
        const myChart = this.$echarts.init(document.getElementById('year_line'))
        myChart.setOption(this.year_seven)
        window.onresize = () => {
          setTimeout(() => {
            myChart.resize()
          }, 50)
        }
      })
    },
    // 获取当前时间
    handleGetTime() {
      this.timer = setInterval(() => {
        this.date.dateYear = formatTime(new Date(), 'yyyy/MM/dd')
        this.date.dateWeek = this.date.weekday[new Date().getDay()]
        this.date.dateDay = formatTime(new Date(), 'HH:mm:ss')
        if (this.date.dateDay === '00:00:00') {
          this.handleDayNum() // 今日预警条数
          this.handleGetWarningNum()
          this.handleCumulative()
        }
      }, 1000)
    },
    // 地图相关处理
    handleGetScreen() {
      httpRequest('/api/pajx/scl/bigscreen/list', {}, false).then((res) => {
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
              icon: require('@/assets/pun_audio.png'),
              icon_show: false,
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
    handleComplete() {
      this.$refs.map.$$getInstance().setFitView()
      var center = this.$refs.map.center
      var lat = Number(center[1]) - Number(0.0020)
      this.center = [center[0], lat]
    },
    handleResetMap() {
      var map = document.getElementsByClassName('amap-marker')
      this.markers.map((vv, kk) => {
        vv.top = map[kk].offsetTop - 60 + 'px'
        vv.left = map[kk].offsetLeft + 3 + 'px'
        vv.status = false
      })
      this.markers_show = true
    },
    // 获取设备列表
    handleGetEquipment() {
      httpRequest('/api/pajx/scl/bigscreen/equ/state/list', {}, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        this.equipment_list = data.flag_list
        this.equipment_info.off_audio = data.off_audio
        this.equipment_info.off_camera = data.off_camera
        this.equipment_info.on_audio = data.on_audio
        this.equipment_info.on_camera = data.on_camera
        clearTimeout(this.equipment_timer)
        this.equipment_timer = null
        if (this.equipment_list.length > 3) {
          this.equipment_timer = setInterval(() => {
            this.handleAutomaticRolling('map_item_list', 'map_block_item')
          }, this.scroll_time)
        }
      })
    },
    handleClickEquipment(equ_no) {
      this.markers.map((item) => {
        if (item.equ_no === equ_no) {
          this.center = item.position
          this.handleResetMap()
        }
      })
    },
    // 月预警关键词排行
    handleGetCross() {
      var keyword = document.getElementById('keyword_content')
      var length = keyword.clientWidth - 162
      httpRequest('/api/pajx/scl/bigscreen/keyword/desc', {}, false).then((res) => {
        this.keyword_list = JSON.parse(decrypt(res.data))
        this.keyword_list.map((item) => {
          item.length = (item.value / this.keyword_list[0].value * length) + 'px'
        })
        clearTimeout(this.cross_timer)
        this.cross_timer = null
        if (this.keyword_list.length > 8) {
          this.cross_timer = setInterval(() => {
            this.handleAutomaticRolling('keyword_content', 'keyword_cell')
          }, this.scroll_time)
        }
      })
    },
    // 实时预警提醒
    handleWarningAlert() {
      httpRequest('/api/pajx/scl/bigscreen/newest', {}, false).then((res) => {
        this.warning_list = JSON.parse(decrypt(res.data))
        this.warning_list.map((item) => {
          if (Number(item.event_flag) === 1) {
            item.audio_status = false
          }
        })
        this.$nextTick(() => {
          var videoImgs = document.getElementsByClassName('video_img_item')
          var video_url = this.warning_list.filter((item) => {
            return Number(item.event_flag) === 0
          })
          video_url.map((item, index) => {
            this.handleGetVideoImg(videoImgs[index], item.video_url)
          })
        })
        clearTimeout(this.warning_timer)
        this.warning_timer = null
        if (this.warning_list.length > 4) {
          this.warning_timer = setInterval(() => {
            this.handleAutomaticRolling('warning_content', 'real_cell')
          }, this.scroll_time)
        }
      })
    },
    // 视频封面
    handleGetVideoImg(videoElement, url) {
      videoElement.setAttribute('src', url)
      videoElement.addEventListener('loadeddata', function(e) {
        const duration = videoElement.duration
        videoElement.currentTime = duration * 0.5// 取视频的中间画面
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      })
    },
    // 月预警数量趋势
    initEcharts() {
      this.line_option.xAxis[0].data = []
      this.line_option.series[0].data = []
      this.line_option.series[1].data = []
      httpRequest('/api/pajx/scl/bigscreen/alert/quantity', {}, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        var pattern = /(\d{2})(\d{2})/
        data.map((item) => {
          this.line_option.xAxis[0].data.push(item.asmonth_time.replace(pattern, '$1/$2'))
          this.line_option.series[0].data.push(item.complete)
          this.line_option.series[1].data.push(item.warning)
        })
        const myChart = this.$echarts.init(document.getElementById('echarts_demo_1'))
        myChart.setOption(this.line_option)
        window.onresize = () => {
          setTimeout(() => {
            myChart.resize()
          }, 50)
        }
      })
    },
    // 初始化2D饼图
    init() {
      httpRequest('/api/pajx/scl/bigscreen/event/level', {}, false).then((res) => {
        const myChart = this.$echarts.init(document.getElementById('echarts_demo_2'))
        var data = JSON.parse(decrypt(res.data))
        data.map((item, index) => {
          this.optionData[index].name = item.name
          this.optionData[index].value = item.value
        })
        var max = this.optionData.reduce(function(item, index) {
          return item.value < index.value ? index : item
        }).value
        var height = 20
        if (max <= 20) {
          height = max
        }
        this.option = this.getPie3D(this.optionData, 0.8, height)
        myChart.setOption(this.option)
        this.option.series.push({
          name: 'pie2d',
          type: 'pie',
          startAngle: -20,
          clockwise: false,
          radius: ['50%', '50%'],
          center: ['50%', '50%'],
          data: this.optionData,
          label: {
            show: false,
            color: 'inherit'
          },
          itemStyle: {},
          labelLine: {
            normal: {
              show: false,
              position: 'inner'
            }
          }
        })
        myChart.setOption(this.option)
        this.bindListen(myChart)
      })
    },
    getPie3D(pieData, internalDiameterRatio, height) {
      const that = this
      const series = []
      let sumValue = 0
      let startValue = 0
      let endValue = 0
      let legendData = []
      let legendBfb = []
      const k = 1 - internalDiameterRatio
      // pieData.sort((a, b) => {
      //   return (b.value - a.value);
      // });
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value
        const seriesItem = {
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k
          },
          center: ['50%', '50%']
        }

        if (typeof pieData[i].itemStyle !== 'undefined') {
          const itemStyle = {}
          typeof pieData[i].itemStyle.color !== 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null
          typeof pieData[i].itemStyle.opacity !== 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null
          seriesItem.itemStyle = itemStyle
        }
        series.push(seriesItem)
      }
      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      legendData = []
      legendBfb = []
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value
        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        series[i].parametricEquation = this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
          false, false, k, series[i].pieData.value)
        startValue = endValue
        const bfb = that.fomatFloat(series[i].pieData.value / sumValue, 4)
        legendData.push({
          name: series[i].name,
          value: bfb,
          num: series[i].pieData.value
        })
        legendBfb.push({
          name: series[i].name,
          value: bfb,
          num: series[i].pieData.value
        })
      }
      const boxHeight = this.getHeight3D(series, height)// 通过传参设定3d饼/环的高度，26代表26px
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      const option = {
        // legend: {
        //   itemHeight: 10,
        //   itemWidth: 10,
        //   data: legendData,
        //   orient: 'vertical',
        //   right: 0,
        //   top: 0,
        //   itemGap: 10,
        //   textStyle: {
        //     color: '#A1E2FF',
        //   },
        //   show: true,
        //   formatter: function (param) {
        //     let item = legendBfb.filter(item => item.name == param)[0];
        //     let bfs = that.fomatFloat(item.value * 100, 2) + "%";
        //     return `${item.name}  ${item.num}`;
        //   }
        // },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#7BC0CB'
          }
        },
        label: {
          show: true
          // position: 'outside',
          // rich: {
          //   b: {
          //     color: '#7BC0CB',
          //     fontSize: 12,
          //     lineHeight: 20
          //   },
          //   c: {
          //     fontSize: 16,
          //   },
          // },
          // formatter: '{b|{b} \n}{c|{c}}{b|  亩}',
        },
        tooltip: {
          formatter: params => {
            if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
              // const bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) *
              //   100).toFixed(2)
              return `${params.seriesName}<br/>` +
                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                `${option.series[params.seriesIndex].pieData.value}`
            }
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: boxHeight, // 圆环的高度
          viewControl: { // 3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: 40, // 角度
            distance: 150, // 调整视角到主体的距离，类似调整zoom
            rotateSensitivity: 0, // 设置为0无法旋转
            zoomSensitivity: 0, // 设置为0无法缩放
            panSensitivity: 0, // 设置为0无法平移
            autoRotate: false // 自动旋转
          }
        },
        series: series
      }
      return option
    },
    getHeight3D(series, height) {
      series.sort((a, b) => {
        return (b.pieData.value - a.pieData.value)
      })
      return height * 25 / series[0].pieData.value
    },
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
      // 计算
      const midRatio = (startRatio + endRatio) / 2
      const startRadian = startRatio * Math.PI * 2
      const endRadian = endRatio * Math.PI * 2
      const midRadian = midRatio * Math.PI * 2
      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false
      }
      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      k = typeof k !== 'undefined' ? k : 1 / 3
      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
      const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0
      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      const hoverRate = isHovered ? 1.05 : 1
      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32
        },
        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20
        },
        x: function(u, v) {
          if (u < startRadian) {
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          if (u > endRadian) {
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
        },
        y: function(u, v) {
          if (u < startRadian) {
            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          if (u > endRadian) {
            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
        },
        z: function(u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u)
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u) * h * 0.1
          }
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1
        }
      }
    },
    fomatFloat(num, n) {
      var f = parseFloat(num)
      if (isNaN(f)) {
        return false
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n) // n 幂
      var s = f.toString()
      var rs = s.indexOf('.')
      // 判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + n) {
        s += '0'
      }
      return s
    },
    bindListen(myChart) {
      // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
      const that = this
      let selectedIndex = ''
      let hoveredIndex = ''
      // 监听点击事件，实现选中效果（单选）
      myChart.on('click', function(params) {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
        const isSelected = !that.option.series[params.seriesIndex].pieStatus.selected
        const isHovered = that.option.series[params.seriesIndex].pieStatus.hovered
        const k = that.option.series[params.seriesIndex].pieStatus.k
        const startRatio = that.option.series[params.seriesIndex].pieData.startRatio
        const endRatio = that.option.series[params.seriesIndex].pieData.endRatio
        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
          that.option.series[selectedIndex].parametricEquation = that.getParametricEquation(that.option.series[
            selectedIndex].pieData
            .startRatio, that.option.series[selectedIndex].pieData.endRatio, false, false, k, that.option.series[
            selectedIndex].pieData
            .value)
          that.option.series[selectedIndex].pieStatus.selected = false
        }
        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
          isSelected,
          isHovered, k, that.option.series[params.seriesIndex].pieData.value)
        that.option.series[params.seriesIndex].pieStatus.selected = isSelected
        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        isSelected ? selectedIndex = params.seriesIndex : null
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option)
      })
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on('mouseover', function(params) {
        // 准备重新渲染扇形所需的参数
        let isSelected
        let isHovered
        let startRatio
        let endRatio
        let k
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          return
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = that.option.series[hoveredIndex].pieStatus.selected
            isHovered = false
            startRatio = that.option.series[hoveredIndex].pieData.startRatio
            endRatio = that.option.series[hoveredIndex].pieData.endRatio
            k = that.option.series[hoveredIndex].pieStatus.k
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
              isSelected,
              isHovered, k, that.option.series[hoveredIndex].pieData.value)
            that.option.series[hoveredIndex].pieStatus.hovered = isHovered
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = ''
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = that.option.series[params.seriesIndex].pieStatus.selected
            isHovered = true
            startRatio = that.option.series[params.seriesIndex].pieData.startRatio
            endRatio = that.option.series[params.seriesIndex].pieData.endRatio
            k = that.option.series[params.seriesIndex].pieStatus.k
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
              isSelected, isHovered, k, that.option.series[params.seriesIndex].pieData.value + 5)
            that.option.series[params.seriesIndex].pieStatus.hovered = isHovered
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(that.option)
        }
      })
      // 修正取消高亮失败的 bug
      myChart.on('globalout', function() {
        // 准备重新渲染扇形所需的参数
        let isSelected
        let isHovered
        let startRatio
        let endRatio
        let k
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = that.option.series[hoveredIndex].pieStatus.selected
          isHovered = false
          k = that.option.series[hoveredIndex].pieStatus.k
          startRatio = that.option.series[hoveredIndex].pieData.startRatio
          endRatio = that.option.series[hoveredIndex].pieData.endRatio
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
            isSelected,
            isHovered, k, that.option.series[hoveredIndex].pieData.value)
          that.option.series[hoveredIndex].pieStatus.hovered = isHovered
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = ''
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option)
      })
    },
    // 播放视频
    handlePlay(info, url) {
      if (url && url !== '') {
        this.$nextTick(() => {
          this.play_video.src = url
          this.video_show = true
        })
      } else {
        this.$message({
          message: '无视频播放地址',
          type: 'error'
        })
        return false
      }
    },
    // 播放音频
    handlePlayAudio(item, index, audio_type) {
      if (item.audio_url) {
        if (audio_type === 2) {
          this.warning_list.map((vv, kk) => {
            if (Number(vv.event_flag) === 1) {
              if (kk === index) {
                vv.audio_status = !vv.audio_status
                if (vv.audio_status) {
                  this.audio_index = kk
                  this.play_video.audio = vv.audio_url
                  this.$nextTick(() => {
                    this.$refs.play_audio.play()
                  })
                } else {
                  this.$refs.play_audio.pause()
                  this.play_video.audio = ''
                  this.audio_index = -1
                }
              } else {
                vv.audio_status = false
              }
            }
          })
        } else {
          this.warning_info.audio_status = !this.warning_info.audio_status
          if (this.warning_info.audio_status) {
            this.$nextTick(() => {
              this.$refs.play_new_audio.play()
            })
          } else {
            this.$refs.play_new_audio.pause()
          }
        }
      } else {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
        return false
      }
    },
    // 音频播放结束
    handleEndAudio() {
      this.warning_list[this.audio_index].audio_status = false
      this.play_video.audio = ''
      this.audio_index = -1
    },
    handleNewEndAudio() {
      this.warning_info.audio_status = false
    },
    // 设置背景报警音播放
    handleSetAudio() {
      localStorage.setItem('audio', this.audio_play)
    },
    handleSetAudioNum() {
      localStorage.setItem('audio_num', this.audio_play_num)
    },
    handleWarnEndAudio() {
      if (this.audio_play_num !== 10) {
        if (this.audio_end_num === 0) {
          this.audio_end_num = 1
        } else {
          this.audio_end_num += 1
        }
        if (this.audio_end_num < this.audio_play_num / 10) {
          this.$refs.play_audio1.play()
        } else {
          this.$refs.play_audio1.pause()
          this.audio_end_num = 0
          // 播放结束
        }
      }
    },
    // 关闭视频弹框
    handleCloseVideo() {
      this.$refs.play_video.pause()
      this.play_video.src = ''
      this.video_show = false
    },
    // 关闭设置弹框
    handleCloseAudio() {
      this.audio_show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  width: 100%;
  height: 100%;
  /*font-family: "微软雅黑";*/
  background: url("../assets/login_bg.webp") no-repeat;
  background-size: cover;
}
.header_view {
  text-align: center;
  width: 100%;
  height: 88px;
  margin: 0 auto;
  background: url("../assets/header_bg.png") no-repeat;
  background-size: cover;
  position: relative;
}
.header_title {}
.header_title_school {
  font-weight: Bold;
  font-size: 32px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  line-height: 50px;
  text-shadow: 0 0 6px rgba(82,190,255,0.70);
}
.header_title_desc {
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 1.6px;
  text-align: center;
  line-height: 26px;
  text-shadow: 0 0 6px rgba(82,190,255,0.70);
}
.header_fl {
  position: absolute;
  left: 16px;
  top: 30px;
}
.header_fr {
  position: absolute;
  right: 16px;
  top: 12px;
}
.header_fr img {
  width: 42px;
  position: relative;
  top: 8px;
}
.content_view {
  height: calc(100vh - 102px);
  padding: 16px;
  box-sizing: border-box;
}
.footer_view {
  height: 15px;
  background: url("../assets/footer.webp") no-repeat;
  background-size: cover;
}
.content_left_view {
  display: inline-block;
  width: 25%;
  height: 100%;
}
.content_center_view {
  display: inline-block;
  width: calc(49% - 24px);
  height: 100%;
  margin: 0 12px;
}
.content_right_view {
  display: inline-block;
  width: 25%;
  height: 100%;
}
.top_card_view {
  position: relative;
  height: 65%;
  background-image: linear-gradient(180deg,rgba(214, 236, 255, 0.04) 1%,rgba(179, 218, 255, 0.08) 98%);
}
.top_left_view {
  height: 65%;
}
.top_card_view .tips {
  position: absolute;
  z-index: 8;
  width: 200px;
  background: rgba(255,255,255,0.20);
  backdrop-filter: blur(3px);
  border-radius: 6px;
  padding: 8px;
}
.tips .tips-title {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.tips .tips-title .title-icon {
  display: flex;
  align-items: center;
}
.tips .tips-title .icon-demo {
  width: 20px;
  height: 20px;
}
.tips .tips-title .title-txt {
  width: 140px;
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
.tips .tips-title .tips-txt {
  height: 20px;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 20px;
  color: #909399;
}
.tips .tips-title .online-txt {
  color: #3DC35F;
}
.tips .tips-item {
  height: 18px;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  letter-spacing: 0;
  line-height: 18px;
}
.tips .equ_position {
  width: 200px;
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
.tips .popper__arrow {
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top: 10px solid rgba(255,255,255,0.20);
  position: absolute;
  bottom: 0;
  left: 10%;
  transform: translate(-50%, 100%);
}
.bottom_card_view {
  margin-top: 16px;
  height: calc(35% - 16px);
  background-image: linear-gradient(180deg,rgba(214, 236, 255, 0.04) 1%,rgba(179, 218, 255, 0.08) 98%);
}
.card_header_view {
  height: 46px;
  line-height: 46px;
  padding-left: 16px;
  font-size: 18px;
  background: url("../assets/title_bg.webp") no-repeat;
  background-size: 100% 100%;
  text-shadow: 0 0 6px rgba(82,190,255,0.70);
  font-weight: 600;
}
.card_header_view i {
  display: inline-block;
  width: 2px;
  background-color: #44adff;
  height: 18px;
  position: relative;
  top: 3px;
}
.card_content {
  height: calc(100% - 46px);
  padding: 8px 16px;
  box-sizing: border-box;
  overflow-y: auto;
  backdrop-filter: blur(7px);
}
.map-amap {
  height: calc(100% - 46px);
}
.warning_content {
  height: calc(100% - 140px);
  overflow-y: auto;
}
.warning_content_list {
  height: 100%;
}
.warning_content::-webkit-scrollbar {
  width: 0 !important;
}
.card_content::-webkit-scrollbar {
  width: 0 !important;
}
.card_content {
  -ms-overflow-style: none;
}
.card_content {
  overflow: -moz-scrollbars-none;
}
.keyword_cell {
  margin: 12px 0;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.keyword_cell .index1 {
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  background: linear-gradient(270deg,rgba(255, 148, 68, 0),rgba(255, 148, 68, 0.2));
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(255, 148, 68, 0.4),rgba(255, 148, 68, 0.68) 98%) 1 1;
  border-radius: 2px;
}
.keyword_cell .index2 {
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  background: linear-gradient(270deg,rgba(68, 255, 179, 0),rgba(68, 255, 179, 0.2));
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(68, 255, 179, 0.4),rgba(68, 255, 179, 0.68) 98%) 1 1;
  border-radius: 2px;
}
.keyword_cell .index3 {
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  background: linear-gradient(270deg,rgba(237, 255, 68, 0),rgba(237, 255, 68, 0.2));
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(237, 255, 68, 0.4),rgba(237, 255, 68, 0.68) 97%) 1 1;
  border-radius: 2px;
}
.keyword_cell .index {
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  background: linear-gradient(270deg,rgba(68, 173, 255, 0),rgba(68, 173, 255, 0.2));
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(68, 173, 255, 0.4),rgba(68, 173, 255, 0.68) 98%) 1 1;
  border-radius: 2px;
}
.keyword_cell .keyword {
  display: inline-block;
  width: 56px;
  color: #44adff;
  margin: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.keyword_ratio_view {
  display: inline-block;
  width: calc(100% - 129px);
  height: 8px;
  margin: 0 6px;
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}
.keyword_ratio {
  position: absolute;
  height: 8px;
  left: 0;
  background-image: linear-gradient(270deg, #4feaff 0%, #44adff 100%);
}
.real_cell1 {
  height: 85px;
  background: linear-gradient(270deg,rgba(255, 86, 86, 0.22),rgba(255, 23, 23, 0.3) 99%);
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(255, 123, 123, 0.24),rgba(255, 123, 123, 0.43)) 1 1;
  border-radius: 0px 0px 16px 0px;
  padding: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 12px 0;
  box-shadow: 0px 0px 20px 0px rgba(255, 109, 109, 0.45);
  display: flex;
}
.real_cell {
  background: linear-gradient(270deg,rgba(68, 173, 255, 0),rgba(68, 173, 255, 0.22) 99%);
  border: 1px solid;
  border-image: linear-gradient(270deg,rgba(68, 173, 255, 0.12) 1%,rgba(82, 179, 255, 0.4) 98%) 1 1;
  border-radius: 0px 0px 16px 0px;
  padding: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  /*margin: 12px 0;*/
  margin-bottom: 12px;
  display: flex;
}
.real_img {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: relative;
  background-image: linear-gradient(138deg, #2464C4 0%, #083E90 100%);
  border: 1px solid #3273D4;
  border-radius: 8px;
  cursor: pointer;
}
.real_video_img {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 8px;
  border: 1px solid #3273D4;
  cursor: pointer;
  overflow: hidden;
}
.real_video_img_new {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 8px;
  border: 1px solid #3273D4;
  cursor: pointer;
  overflow: hidden;
}
.real_icon_1 {
  position: absolute;
  width: 48px;
  height: 48px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.real_icon_2 {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
}
.real_icon_3 {
  position: absolute;
  width: 80px;
  height: 80px;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
}
.real_content {
  display: flex;
  width: calc(100% - 98px);
  margin-left: 12px;
  flex-direction: column;
  justify-content: space-between;
}
.real_content_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px
}
.real_content_keyword {
  max-width: 120px;
  color: #44adff;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.real_item_block {
  display: flex;
  align-items: center;
}
.block_real_btn {
  width: 48px;
  height: 18px;
  background: rgba(68,173,255,0.20);
  border: 1px solid rgba(68,173,255,0.50);
  border-radius: 4px;
  font-size: 12px;
  color: #44ADFF;
  letter-spacing: 0;
  text-align: center;
  line-height: 18px;
  margin-left: 6px;
}
.echarts_card {
  overflow: hidden;
}
.echarts_legend1 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  position: absolute;
  bottom: 16px;
  right: 16px;
}
.echarts_legend1 i {
  display: inline-block;
  width: 32px;
  height: 2px;
  margin: 4px 3px;
}
.echarts_view{
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
}
.echarts_view img{
  position: absolute;
  width: 240px;
  left: 5%;
  top: 50%;
  transform: translate(0, -42%);
}
#echarts_demo_2{
  width: 100%;
  height: 100%;
  z-index: 9;
}
.echarts_legend2 {
  width: 29%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.echarts_block {
  width: 100%;
  height: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.echarts_block:last-child {
  margin-bottom: 0;
}
.echarts_block_item {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  margin-right: 6px;
}
.echarts_block_txt {
  width: 50px;
}
.echarts_block_num {
  color: #ffffff;
  margin-left: 14px;
}
.video_info img{
  width: 22px;
}
.video_info span{
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.video_info_demo img{
  width: 22px;
}
.map_list {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 25%;
  height: 158px;
  padding: 12px;
  z-index: 160;
  background-image: linear-gradient(180deg, rgba(10,29,39,0.6) 1%, rgba(10,29,39,0.6) 97%);
  border: 1px solid rgba(75,176,255,0.32);
  border-radius: 8px;
  backdrop-filter: blur(4px);
}
.map-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  margin-bottom: 10px;
}
.equipment-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(93,186,255,0.5);
  border-radius: 4px;
}
.equipment-item-icon {
  margin-left: 12px;
  margin-right: 8px;
  width: 24px;
  height: 30px;
}
.equipment-item-list {
  width: calc(100% - 54px);
}
.equipment-title {
  height: 20px;
  font-weight: Bold;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 20px;
}
.equipment-num {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  font-size: 14px;
  color: #ffffff;
}
.equipment-num span {
  height: 20px;
  line-height: 20px;
}
.map_item_list {
  width: 100%;
  height: calc(100% - 66px);
  overflow-y: auto;
}
.map_item_list::-webkit-scrollbar {
  width: 0 !important;
}
.map_block_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
}
.map_block_item:last-child {
  border-bottom: none;
}
.block-left {
  display: flex;
  align-items: center;
}
.block-left div {
  margin-left: 8px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.bounced-content {
  width: 100%;
  height: 100%;
}
.mask-floating {
  position: fixed;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.video_floating {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 720px;
  height: 540px;
  border-radius: 10px;
  z-index: 1000;
  border: 1px solid rgba(68, 173, 255, 1);
  background-image: linear-gradient(180deg, rgba(0,60,113,0.81) 1%, rgba(0,29,57,0.99) 98%);
  box-shadow: 0 0 20px 0 rgba(46,48,55,0.56);
  backdrop-filter: blur(4px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.audio_floating {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 718px;
  height: 406px;
  padding: 16px 20px;
  z-index: 1000;
  background-image: linear-gradient(180deg, rgba(0,60,113,0.81) 1%, rgba(0,29,57,0.99) 98%);
  border: 1px solid rgba(68,173,255,0.32);
  box-shadow: 0 0 20px 0 rgba(46,48,55,0.56);
  backdrop-filter: blur(4px);
}
.floating-title {
  position: relative;
  width: 100%;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-weight: Bold;
  font-size: 20px;
  color: #FFFFFF;
  letter-spacing: 0;
  margin-bottom: 20px;
}
.floating-title .close-icon {
  position: absolute;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.floating-title .return-icon {
  position: absolute;
  left: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.floating-content {
  width: 100%;
  height: calc(100% - 70px);
}
.item-play-audio {
  height: 56px;
  padding: 0 16px;
  background: rgba(255,255,255,0.10);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.item-play-audio:last-child {
  margin-bottom: 0;
}
.horn-left {
  display: flex;
  align-items: center;
}
.horn-slider {
  width: 330px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.horn {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.horn-txt {
  width: 300px;
  height: 24px;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.horn-txt-list {
  width: 460px;
  height: 24px;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.arrow_right {
  width: 14px;
  height: 14px;
}
.floating-video-item {
  width: 720px;
  /*height: 100%;*/
  /*object-fit: fill;*/
}
.point,
.point::before,
.point::after {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  content: '';
}
.point::before {
  animation: scale 2s infinite;
}
.point::after {
  animation: scale2 2s infinite;
}
@keyframes scale {
  0% {
    transform: scale(1);
    opacity: .9
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}
@keyframes scale2 {
  0% {
    transform: scale(1);
    opacity: .9;
  }
  100% {
    transform: scale(6);
    opacity: 0;
  }
}
.point,
.point::before,
.point::after {
  background-color: rgba(241, 34, 30, .9);
}

.day-number {
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  margin-bottom: 10px;
  background-image: linear-gradient(180deg,rgba(214, 236, 255, 0.04) 1%,rgba(179, 218, 255, 0.08) 98%);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);

  .block-list {
    display: flex;
    align-items: center;

    .block-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 50px;
      background: #44adff52;
      margin-right: 5px;
      font-size: 40px;
      font-weight: bold;
      border-radius: 2px;
      font-family: DINCond;
    }
  }

  .block-txt {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    height: 50px;

    .block-txt-num {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .block-yesterday-num {
      display: flex;
      align-items: center;

      .triangle {
        width: 20px;
        height: 20px;
      }

      .day-num {
        margin-left: 5px;
        font-size: 18px;
      }

      .top {
        color: #F35050;
      }

      .down {
        color: #30b26c;
      }

      .day-txt {
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }
}

.all-days {
  height: calc(100% - 346px);
  background-image: linear-gradient(180deg,rgba(214, 236, 255, 0.04) 1%,rgba(179, 218, 255, 0.08) 98%);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  margin-bottom: 10px;

  .event_list {
    height: calc(100% - 46px);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .event_top_list {
      width: 95%;
      height: 45%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .event_item {
      border-radius: 4px;
      padding: 11px 10px;
      display: flex;
      align-items: center;
      background: #44adff52;
      width: 40%;
      height: 60%;

      .event-icon {
        width: 45px;
        height: 45px;
      }

      .event-txt {
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 50px;
        margin-left: 10px;
        font-size: 14px;

        .event-num {
          font-weight: Bold;
          font-size: 30px;
          color: #FF8861;
          font-family: DINCond;
        }

        .success {
          color: #65FFC4;
        }

        .out {
          color: #FFE17D;
        }

        .info {
          color: #75D5FF;
        }
      }
    }
  }
}

.cumulative-list {
  height: 210px;
  background-image: linear-gradient(180deg,rgba(214, 236, 255, 0.04) 1%,rgba(179, 218, 255, 0.08) 98%);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);

  .cumulative-title {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;

    .cumulative-txt {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 14px;

      .cumulative-txt-num {
        font-size: 24px;
        font-weight: bold;
        color: #66b1ff;
        font-family: DINCond;
      }
    }
  }

  .cumulative-line {
    height: calc(100% - 50px);
  }
}
</style>
