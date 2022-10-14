<template>
  <div class="Inspection-main">
    <div class="hidden-rank common-wrapper" :style="height">
      <div class="title">巡检完成统计</div>
      <el-scrollbar
        v-if="statisticsList.length > 0"
        class="statisticsList-list small-scrollbar"
        :style="scrollHeight"
      >
        <vue-seamless-scroll :data="statisticsList" :class-option="classOption">
          <div
            v-for="(item, index) in statisticsList"
            :key="index"
            class="statisticsList-item"
          >
            <div class="item_title">
              {{ item.scl_name }}
            </div>
            <div class="item_content">
              <div class="common_content">
                <div class="common_content_top1">日巡查点</div>
                <div class="common_content_top2">完成率</div>
                <div class="common_content_top3">
                  {{ (item.day * 100).toFixed(2) }}%
                </div>
              </div>
              <div class="common_content">
                <div class="common_content_top1">周巡查点</div>
                <div class="common_content_top2">完成率</div>
                <div class="common_content_top3">
                  {{ (item.week * 100).toFixed(2) }}%
                </div>
              </div>
              <div class="common_content">
                <div class="common_content_top1">月巡查点</div>
                <div class="common_content_top2">完成率</div>
                <div class="common_content_top3">
                  {{ (item.month * 100).toFixed(2) }}%
                </div>
              </div>
            </div>
          </div>
        </vue-seamless-scroll>
      </el-scrollbar>
      <div v-else class="spp-no-content">
        <div class="content">
          <img src="../../assets/images/no-content.png" alt class="not-found">
          <div class="text">暂无内容</div>
        </div>
      </div>
      <img class="bottom-left" src="../../assets/images/bottom-left.png" alt>
      <img
        class="bottom-right"
        src="../../assets/images/bottom-right.png"
        alt
      >
    </div>
  </div>
</template>

<script>
import { getStatisticRank } from '@/api/home_page'
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'InspectionStatistics',
  components: {
    vueSeamlessScroll
  },
  props: {},
  data() {
    return {
      statisticsList: [],
      height: {},
      scrollHeight: {}
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.4,
        limitMoveNum: 3
      }
    }
  },
  mounted() {
    this.getStatisticRank()
    this.initHeight()
    // 实现自适应部分
    this.resizefun = () => {
      this.initHeight()
    }
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    getStatisticRank() {
      getStatisticRank().then((res) => {
        this.statisticsList = res.data
        console.log(this.statisticsList)
      })
    },
    initHeight() {
      this.height = {
        height: (window.innerHeight - 144) / 2 + 'px'
      }
      this.scrollHeight = {
        height: (window.innerHeight - 144) / 2 - 57 + 'px'
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.Inspection-main {
  .statisticsList-list {
    padding-top: 6px;
    .statisticsList-item {
      border: 1px solid rgba(22, 241, 255, 0.5);
      border-radius: 4px;
      background: rgba(22, 241, 255, 0.1);
      margin-bottom: 16px;
      .item_title {
        font-size: 16px;
        color: #46ebff;
        padding: 0 21px;
        padding-top: 15px;
      }
      .item_content {
        display: flex;
        padding: 18px 0;
        .common_content {
          text-align: center;
          flex: 1;
          border-right: 1px solid rgba(255, 255, 255, 0.5);
          .common_content_top1 {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
          }
          .common_content_top2 {
            font-size: 14px;
            padding-top: 11px;
            padding-bottom: 9px;
            color: rgba(255, 255, 255, 0.5);
          }
          .common_content_top3 {
            font-size: 20px;
            color: #46ebff;
          }
          &:last-of-type {
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
