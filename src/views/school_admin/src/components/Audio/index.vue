<template>
  <div class="audio-component">
    <div class="audio-content">
      <div class="audio-left">
        <img v-if="audio.playing" class="play-icon" src="@/assets/images/suspended.png" @click="startPlayOrPause">
        <img v-else class="play-icon" src="@/assets/images/play.png" @click="startPlayOrPause">
        <div class="audio-item">
          <div class="current-time">
            {{ audio.currentTime | formatSecond }}
          </div>
          <el-slider
            v-model="sliderTime"
            style="width: 235px;margin: 0 20px"
            :format-tooltip="formatProcessToolTip"
            @change="changeCurrentTime"
          />
          <div class="current-time">
            {{ audio.maxTime | formatSecond }}
          </div>
        </div>
      </div>
      <div v-if="clearBtn" class="remove-txt">清除</div>
    </div>

    <audio
      ref="audio"
      style="display: none"
      :autoplay="audio.autoplay"
      :src="audioUrl"
      controls="controls"
      :preload="audio.preload"
      @pause="onPause"
      @play="onPlay"
      @error="onError"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    />
  </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}

export default {
  name: 'Index',
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause(value) {
      return value ? '暂停' : '播放'
    },
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second)
    }
  },
  props: {
    audioUrl: {
      type: String,
      default: ''
    },
    clearBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sliderTime: 0,
      audio: {
        autoplay: false, // 自动播放
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        // 规定是否预加载音频
        preload: 'auto',
        waiting: true,
        loading: false
      }
    }
  },
  methods: {
    // 关闭暂停
    handlePause() {
      this.audio.playing = false
      this.pause()
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play() {
      if (this.audioUrl === '') {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
      } else {
        this.$refs.audio.play()
      }
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = true
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration)
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
    },
    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-component {
  .audio-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    width: 100%;
    margin-top: 17px;
    height: 48px;
    background: #F5F7FA;
    border-radius: 2px;

    .audio-left {
      display: flex;
      align-items: center;
    }

    .play-icon {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      cursor: pointer;
    }

    .audio-item {
      display: flex;
      align-items: center;

      .current-time {
        font-weight: 400;
        font-size: 12px;
        color: #909399;
        letter-spacing: 0;
      }
    }

    .remove-txt {
      font-weight: 400;
      font-size: 14px;
      color: #3272FF;
      cursor: pointer;
    }
  }
}
</style>
