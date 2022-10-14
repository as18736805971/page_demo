<template>
  <div class="home-work">
    <div class="content-list" v-if="list.length !== 0">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <div class="top_title">
          <img class="portrait" :src="item.avatar || require('@/assets/person.png')" :onerror="onerror" />
          <div class="content_name">
            <div class="name">
              <div>{{ item.nick_name }}</div>
              <div class="block_item" :class="item.hw_subject === '语文' || item.hw_subject === '数学' || item.hw_subject === '英语' ? 'science' : item.hw_subject === '政治' || item.hw_subject === '历史' || item.hw_subject === '地理' ? 'liberal' : item.hw_subject === '物理' || item.hw_subject === '化学' || item.hw_subject === '生物' ? '' : ''">{{ item.hw_subject }}</div>
            </div>
            <div class="time">{{ formatDate(item.create_time) }}</div>
          </div>
        </div>
        <div class="desc" v-if="item.hw_content">{{ item.hw_content }}</div>
        <template v-if="item.pic_list && item.pic_list.length !== 0">
          <div class="img_list">
            <img class="img_photo" v-for="(vv, kk) in item.pic_list" :key="kk" @click.stop="seeImg(pic_url + vv, item.pic_list)" :src="pic_url + vv">
          </div>
        </template>
      </div>
    </div>

    <div v-else class="no-data_list">
      <img class="no-img" :src="require('@/assets/no_data.png')">
      <div class="no-text">暂无数据</div>
    </div>

    <img class="float-add" @click.stop="handleJump()" src="../../../assets/add.png">
  </div>
</template>

<script>
import { httpFormPostMethod } from '@/common/HttpService'
import { Tool } from "@/common/Tool"
import { pic_url } from "@/common/env";
export default {
  name: "homeWork",
  data() {
    return {
      gra_id: this.$route.query.gra_id,
      cls_id: this.$route.query.cls_id,
      list: [],
      subjects: {},
      onerror: 'this.src="' + require('@/assets/person.png') + '"',
      pic_url: pic_url
    }
  },
  mounted() {
    this.handleSubjects()
  },
  methods: {
    formatDate: Tool.formatDate,
    handleSubjects() {
      httpFormPostMethod('sys/dic/child/sclSubject', {}).then((res) => {
        this.subjects = res.data
        this.handleGetData()
      })
    },
    handleGetData() {
      httpFormPostMethod('web/new/homework/lists', {
        gra_id: this.gra_id,
        cls_id: this.cls_id,
      }).then((res) => {
        this.list = res.data
      })
    },
    handleJump() {
      this.$router.push({
        path: '/add_homework',
        query: {
          gra_id: this.gra_id,
          cls_id: this.cls_id,
        }
      })
    },
    seeImg(url, list) {
      list.forEach((item, index) => {
        list[index] = this.pic_url + item
      })
      wx.previewImage({
        current: [url],
        urls: list
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.home-work {
  width: 100%;
  background: #ffffff;

  .content-list {
    padding: 0.6rem;

    .list-item {
      margin-bottom: 1.5rem;

      .top_title {
        height: 2rem;
        display: flex;
        align-items: center;

        .portrait {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .name {
          display: flex;
          align-items: center;

          .block_item {
            width: 2rem;
            height: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.1rem;
            margin-left: 0.5rem;
            font-size: 0.6rem;
            border: 0.05rem solid rgb(104, 227, 204);
            color: rgb(104, 227, 204);
          }

          .science {
            border: 0.05rem solid rgb(255, 117, 124);
            color: rgb(255, 117, 124);
          }

          .liberal {
            border: 0.05rem solid rgb(231, 178, 251);
            color: rgb(231, 178, 251);
          }

          .history {
            border: 0.05rem solid rgb(253, 117, 59);
            color: rgb(253, 117, 59);
          }
        }

        .time {
          font-size: 0.6rem;
        }
      }

      .desc {
        margin: 0.5rem 0;
        word-wrap: break-word;
        word-break: break-all;
      }

      .img_list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .img_photo {
          width: 5rem;
          height: 5rem;
          margin: 0 0.5rem 0.5rem 0;
        }
      }
    }
  }

  .float-add {
    position: fixed;
    bottom: 5%;
    right: 0.5rem;
    width: 3rem;
    height: 3rem;
  }
}

.no-data_list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;

  .no-img {
    height: 2rem;
    margin-bottom: 0.5rem;
  }

  .no-text {
    font-size: 0.6rem;
  }
}
</style>
