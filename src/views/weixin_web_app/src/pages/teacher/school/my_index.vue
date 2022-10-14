<template>
  <div class="school-letter">
    <section class="school-list" ref="schoolList" v-if="school_list.length > 0">
      <scroller class="scroller" ref="loadMore" :on-infinite="handleLoadBottom">
        <div class="list-item" v-for="(item, index) in school_list" :key="index" @click="handleDetails(item)">
          <div class="list-item-desc">{{ item.notice_content }}</div>
          <div class="list-item-top between">
            <div class="date-time">发送时间：{{ item.create_time | dateFormat }}</div>
            <div class="date-time">发送对象：{{ item.notice_scope == 2 ? '教师' : '学生' }}</div>
          </div>
        </div>
      </scroller>
    </section>
    <section v-else class="main-no-data">
      <img src="../../../assets/no_data.png" alt class="img" />
      <div class="text">暂无内容</div>
    </section>
  </div>
</template>

<script>
  import { httpFormPostMethod } from "@/common/HttpService"
  import moment from 'moment'
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
      handleFormat() {
        this.params.page_num = 1
        this.handleGetData()
      },
      // 获取校信列表
      handleGetData() {
        httpFormPostMethod('web/campus/teaMyCampusList', this.params).then((res) => {
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
      // 详情
      handleDetails(data) {
        this.$router.push({
          path: 'school_letter_detail',
          query: {
            type: 2,
            notice_id: data.notice_id
          }
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

  .school-list {
    width: 100%;
    height: 100vh;
    overflow-y: auto;

    .scroller {
      padding: 0.6rem;
    }

    .list-item {
      width: 100%;
      height: 5.05rem;
      background: #ffffff;
      border-radius: 0.4rem;
      box-shadow: 0 0.05rem 0.15rem 0 rgba(0,0,0,0.06);
      margin-bottom: 0.6rem;
      padding: 0.6rem 0.8rem;

      &-top {
        margin-top: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .date-time {
          height: 0.85rem;
          font-size: 0.6rem;
          font-weight: 400;
          color: #999999;
          line-height: 0.85rem;
          text-align: left;
        }

        .date-time:first-child {
          margin-right: 1rem;
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
}
</style>
