<template>
  <div class="school-letter">
    <div class="school-top between" @click="handleMySend()">
      <div class="school-top-left">
        <img class="icon-send" src="../../../assets/send.png">
        <div class="send-txt">我发送的</div>
      </div>
      <img class="icon-arrow" src="../../../assets/arrow_right.png">
    </div>

    <section class="school-list" v-if="school_list.length > 0">
      <scroller class="scroller" ref="loadMore" :on-infinite="handleLoadBottom">
        <div class="list-item" v-for="(item, index) in school_list" :key="index" @click="handleDetails(item)">
          <div class="dot"></div>
          <div class="list-item-top between">
            <div class="item-left">
              <img class="photo" src="../../../assets/qqdh_photo.png">
              <div class="nickname">{{ item.tea_name }}</div>
            </div>
            <div class="date-time">{{ item.create_time | dateFormat }}</div>
          </div>
          <div class="list-item-desc">{{ item.notice_content }}</div>
        </div>
      </scroller>
    </section>
    <section v-else class="main-no-data">
      <img src="../../../assets/no_data.png" alt class="img" />
      <div class="text">暂无内容</div>
    </section>

    <img class="edit-icon" @click="handleJump()" src="../../../assets/edit.png">
  </div>
</template>

<script>
  import { httpFormPostMethod } from "@/common/HttpService"
  import moment from "moment";
  import { mapMutations } from "vuex";

  export default {
    name: "school_letter",
    data() {
      return {
        allLoaded: false,
        showTxt: false,
        params: {
          page_num: 1,
          page_size: 10,
        },
        nodata: false,
        school_list: [],
      }
    },
    filters: {
      dateFormat (value) {
        if (sessionStorage.getItem('area') === 'ha') {
          return moment.unix(value).format('YYYY-MM-DD HH:mm:ss')
        } else {
          let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
          return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
        }
      }
    },
    mounted() {
      this.handleFormat()
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'school_letter_add',
        sign: false,
      });
    },
    methods: {
      ...mapMutations(['UPDATE_INCLUDE_PAGE']),
      // 初始化请求
      handleFormat() {
        this.params.page_num = 1
        this.handleGetData()
      },
      // 获取校信列表
      handleGetData() {
        httpFormPostMethod('web/campus/noticeList', this.params).then((res) => {
          let data = res.data
          let list = data.list ? data.list : []
          if (this.params.page_num === 1) {
            this.school_list = []
          }
          this.school_list = this.school_list.concat(list)
          this.showTxt = data.has_next
          this.nodata = !data.has_next
          this.allLoaded = this.nodata
          if (this.$refs.loadMore) {
            this.$refs.loadMore.finishInfinite(false)
          }
        });
      },
      // 上拉加载
      handleLoadBottom() {
        if (!this.nodata) {
          this.params.page_num++;
          this.handleGetData()
        } else {
          this.$refs.loadMore.finishInfinite(true)
        }
      },
      // 我发送的
      handleMySend() {
        this.$router.push({
          path: 'school_letter_my',
        })
      },
      // 详情
      handleDetails(data) {
        this.$router.push({
          path: 'school_letter_detail',
          query: {
            type: 1,
            notice_id: data.notice_id,
            tea_name: data.tea_name
          }
        })
      },
      // 新增
      handleJump() {
        this.$router.push({
          path: 'school_letter_add',
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .school-letter {
    .between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .school-top {
      width: 100%;
      height: 2.8rem;
      padding: 0 0.8rem;
      background: #ffffff;

      .school-top-left {
        display: flex;
        align-items: center;
        .icon-send {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
        }
        .send-txt {
          height: 1.2rem;
          font-size: 0.8rem;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 1.2rem;
        }
      }

      .icon-arrow {
        width: 1.2rem;
        height: 1.2rem;
      }
    }

    .school-list {
      position: absolute;
      top: 2.8rem;
      width: 100%;
      height: calc(100vh - 2.8rem) !important;
      overflow-y: auto;

      .scroller {
        padding: 0.6rem;
      }

      .list-item {
        position: relative;
        width: 100%;
        height: 5.2rem;
        background: #ffffff;
        border-radius: 0.4rem;
        box-shadow: 0 0.05rem 0.15rem 0 rgba(0,0,0,0.06);
        margin-bottom: 0.6rem;
        padding: 0.6rem 0.8rem;

        .dot {
          position: absolute;
          top: 0.3rem;
          right: 0.3rem;
          width: 0.3rem;
          height: 0.3rem;
          background: #f0644d;
          border-radius: 50%;
        }

        &-top {
          margin-bottom: 0.6rem;

          .item-left {
            display: flex;
            align-items: center;

            .photo {
              width: 1.2rem;
              height: 1.2rem;
              margin-right: 0.4rem;
            }

            .nickname {
              width: 2.1rem;
              height: 1.2rem;
              font-size: 0.7rem;
              font-weight: 400;
              color: #40a9fe;
              line-height: 1.2rem;
            }
          }

          .date-time {
            width: 8rem;
            height: 0.85rem;
            font-size: 0.6rem;
            font-weight: 400;
            text-align: right;
            color: #999999;
            line-height: 0.85rem;
          }
        }

        &-desc {
          width: 100%;
          height: 2.2rem;
          font-size: 0.8rem;
          font-weight: 400;
          color: #333333;
          line-height: 1.1rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }

    .edit-icon {
      position: fixed;
      right: 0.4rem;
      bottom: 2.5rem;
      width: 3.6rem;
      height: 3.6rem;
    }
  }
</style>
