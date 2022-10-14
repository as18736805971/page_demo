<template>
  <div class="dangerrank-main">
    <div class="hidden-rank common-wrapper" :style="height">
      <div class="title">本年度隐患排名</div>
      <div v-if="rankList.length > 0" class="rank-list">
        <div class="list-item list-title">
          <div class="ranking">排名</div>
          <div class="school-name">隐患类型</div>
          <div class="num">隐患数(次)</div>
        </div>
        <el-scrollbar class="small-scrollbar" :style="scrollHeight">
          <div v-for="(item, index) in rankList" :key="index" class="list-item">
            <div class="ranking">
              <span
                class="index"
                :class="{'firstitem':index === 0, 'seconditem':index===1, 'thirditem': index===2}"
              >{{ index+1 }}</span>
            </div>
            <div class="school-name single-hidden">{{ item.name }}</div>
            <div class="num" style="color: #46EBFF">{{ item.hidden_count }}</div>
          </div>
        </el-scrollbar>
      </div>
      <div v-else class="spp-no-content">
        <div class="content">
          <img src="../../assets/images/no-content.png" alt class="not-found">
          <div class="text">暂无内容</div>
        </div>
      </div>
      <img class="bottom-left" src="../../assets/images/bottom-left.png" alt>
      <img class="bottom-right" src="../../assets/images/bottom-right.png" alt>
    </div>
  </div>
</template>

<script>
import { getDangerRank } from '@/api/home_page'
export default {
  name: 'DangerRank',
  props: {},
  data() {
    return {
      rankList: [],
      height: {},
      scrollHeight: {}
    }
  },
  mounted() {
    this.getDangerRank()
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
    getDangerRank() {
      getDangerRank('', '1').then(res => {
        this.rankList = res.data
      })
    },
    initHeight() {
      this.height = {
        height: (window.innerHeight - 144) / 2 + 'px'
      }
      this.scrollHeight = {
        height: (window.innerHeight - 144) / 2 - 95 + 'px'
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.dangerrank-main {
  .hidden-rank {
    .rank-list {
      font-size: 14px;
      .small-scrollbar {
        overflow-y: auto;
      }
      .list-item {
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        height: 38px;
        align-items: center;
        .ranking {
          width: 50px;
        }
        .index {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-block;
          text-align: center;
          line-height: 26px;
        }
        .firstitem {
          background: #f15f5f;
          color: #ffffff;
        }
        .seconditem {
          background: #ff8d4f;
          color: #ffffff;
        }
        .thirditem {
          background: #00bff3;
          color: #ffffff;
        }
        .school-name {
          width: calc(100% - 100px);
        }
        .num {
          width: 70px;
          text-align: center;
        }
        &:last-of-type {
          border-bottom: none;
        }
      }
      .list-title {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
