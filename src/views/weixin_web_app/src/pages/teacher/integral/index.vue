<template>
  <div class="integral">
    <div class="integral-top">
      <div class="integral-content">
        <div class="title">当前积分</div>
        <div class="item">
          <div class="item-left">
            <span class="number">{{ incr_integral }}</span>
            <span class="points">分</span>
          </div>
          <div class="item-right" v-if="pullable" @click="handleGetIntegral()">积分拉取</div>
        </div>
      </div>
      <div class="integral-title">积分明细</div>
    </div>
    <section class="integral-list" v-if="integral_list.length > 0">
      <mt-loadmore
        :auto-fill="false"
        bottomDropText="上拉加载"
        :bottom-method="handleLoadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadMore"
        :bottomDistance="1"
      >
      <div class="integral-item" v-for="(item, index) in integral_list" :key="index">
        <div class="list-left">
          <div class="item-title">{{ item.log_desc }}</div>
          <div class="item-date">{{ item.create_time }}</div>
        </div>
        <div class="list-right">{{ item.extcredits2 }}</div>
      </div>
      </mt-loadmore>
      <div v-if="allLoaded && !showTxt" class="nomore-data">
        <span class="text">我是有底线的</span>
      </div>
    </section>
    <section v-else class="main-no-data">
      <img src="../../../assets/no_data.png" alt class="img" />
      <div class="text">暂无内容</div>
    </section>

    <div class="share-show" v-if="show_tip">
      <div class="share-tip">
        <img class="img-icon" src="../../../assets/successful.png">
        <div class="txt">积分拉取成功</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { httpFormPostMethod } from '@/common/HttpService'

  export default {
    name: "integral_index",
    data() {
      return {
        param: {
          page: 1,
        },
        incr_integral: 0,
        integral_list: [],
        show_tip: false,
        pullable: false,
        allLoaded: false,
        showTxt: false,
        nodata: false,
      }
    },
    created() {
      this.handleIntegral()
      this.handleFormat()
    },
    methods: {
      // 初始化请求
      handleFormat() {
        this.param.page = 1
        this.handleGetData()
      },
      // 上拉加载
      handleLoadBottom() {
        if (!this.nodata) {
          this.param.page++;
          this.handleGetData()
        }
      },
      // 获取积分信息
      handleGetData() {
        httpFormPostMethod('WebApi/TeaIndex/getUserCreditLogList', this.param, false).then((res) => {
          let data = res.data
          let list = data.list ? data.list : []
          if (this.param.page === 1) {
            this.integral_list = []
          }
          this.integral_list = this.integral_list.concat(list)
          this.showTxt = this.integral_list.length < 10
          this.nodata = list.length === 0
          this.allLoaded = this.nodata
          if (this.$refs.loadMore) {
            this.$refs.loadMore.onBottomLoaded()
          }
        })
      },
      // 积分详细
      handleIntegral() {
        httpFormPostMethod('WebApi/TeaIndex/getPullableFlag', {}).then((res) => {
          this.pullable = res.data.pullable
          this.incr_integral = res.data.extcredits2
        })
      },
      // 拉取积分
      handleGetIntegral() {
        httpFormPostMethod('WebApi/TeaIndex/pullIntegral', {}).then((res) => {
          if (res.status == 200) {
            this.show_tip = true
            this.incr_integral = res.data.incr_integral
            setTimeout(() => {
              this.show_tip = false
            }, 1500)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .integral {
    .integral-top {
      width: 100%;
      height: 7rem;

      .integral-content {
        width: 100%;
        height: 5rem;
        padding: 0.6rem 0.8rem;
        background: linear-gradient(180deg,#3fbfff, #3399ff);

        .title {
          height: 1rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #ffffff;
        }

        .item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .item-left {
            color: #ffffff;
            height: 2.8rem;

            .number {
              font-size: 2rem;
              font-weight: 600;
            }

            .points {
              margin-left: 0.2rem;
              font-size: 0.7rem;
            }
          }

          .item-right {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 4rem;
            height: 1.6rem;
            background: rgba(255,255,255,0.10);
            border: 0.05rem solid rgba(255,255,255,0.50);
            border-radius: 0.2rem;
            font-size: 0.7rem;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }

      .integral-title {
        display: flex;
        align-items: center;
        width: 100%;
        height: 2rem;
        padding: 0.5rem 0.8rem;
        font-size: 0.7rem;
        font-weight: 400;
        color: #666666;
      }
    }

    .integral-list {
      width: 100%;
      height: calc(100vh - 7rem);
      overflow-y: auto;

      .integral-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 4.05rem;
        background: #ffffff;
        border-bottom: 0.05rem solid #f0f2f5;
        padding: 0.8rem;

        .list-left {
          width: 12rem;

          .item-title {
            width: 12rem;
            height: 1.1rem;
            font-size: 0.8rem;
            font-weight: 500;
            text-align: left;
            color: #333333;
            margin-bottom: 0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .item-date {
            height: 0.85rem;
            font-size: 0.6rem;
            font-weight: 400;
            text-align: left;
            color: #999999;
          }
        }

        .list-right {
          font-size: 1rem;
          font-weight: 600;
          text-align: right;
          color: #999999;
        }

        .active {
          color: #FF6B2D;
        }
      }

      .integral-item:last-child {
        border-bottom: none;
      }
    }

    .share-show{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      transition: .5s;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;

      .share-tip {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 5.8rem;
        height: 4.6rem;
        background: rgba(0,0,0,0.60);
        border-radius: 0.4rem;

        .img-icon {
          width: 1.6rem;
          height: 1.6rem;
          margin-bottom: 0.4rem;
        }

        .txt {
          height: 1rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
</style>
