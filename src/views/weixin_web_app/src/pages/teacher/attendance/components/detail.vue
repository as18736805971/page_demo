<template>
  <div class="detail">
    <template v-if="page_show">
      <template v-if="no_data">
        <div class="user-info">
          <img class="info-photo" :src="info.stu_avatar || require('../../../../assets/qqdh_photo.png')" :onerror="onerror">
          <div class="name">
            <div class="nickname">{{ info.stu_name }}</div>
            <div class="classname">
              <span>{{ info.gra_show_name }}年级</span><span>{{ info.cls_show_name }}</span>
            </div>
          </div>
        </div>
        <div class="card-list" v-if="info.att_list.length > 0">
          <div v-for="(vv, kk) in info.att_list" :key="kk">
            <div class="date-title" v-if="index === 0">{{ vv.att_time }}日</div>
            <div class="kq_item" v-for="(item, index) in vv.children" :key="index">
              <div class="item-top">
                <div class="title">{{ item.att_type == '0' ? '校门打卡' : item.att_type == '1' ? '宿舍打卡' : item.att_type == '2' ? '请假打卡' :item.att_type == '4' ? '教学区打卡' : '' }}</div>
                <div class="desc" v-if="item.temperature">体温：<span class="degree">{{ item.temperature }}℃</span></div>
              </div>
              <div class="item-desc">
                <span class="date-txt">{{ item.att_time | formatDate }}</span>
                {{ item.inout_type == '0' ? '未区分' : item.inout_type == '1' ? '通过' : item.inout_type == '2' ? '离开' : '' }}{{ item.att_type == '0' ? '校门' : item.att_type == '1' ? '宿舍' : item.att_type == '2' ? '请假' :item.att_type == '4' ? '教学区' : '' }}
              </div>
              <div class="item-block" v-if="item.face_pic.length > 0">
                <div class="block" @click="handleSeePhoto(item.face_pic)">
                  <img class="img-icon" src="../../../../assets/img.png">
                  考勤照片
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-no-data" v-else>
          <img src="../../../../assets/no_data.png" alt class="img" />
          <div class="text">暂无内容</div>
        </div>
      </template>
      <template v-else>
        <div class="main-no-data">
          <img src="../../../../assets/no_data.png" alt class="img" />
          <div class="text">无学生考勤信息</div>
        </div>
      </template>
    </template>

    <!-- 相册 -->
    <div class="photo-album" v-if="photo_show">
      <div class="top-number">{{ index + 1 }}/{{ photo.length }}</div>
      <div class="album-list">
        <mt-swipe :auto="0" :show-indicators="false" @change="handleChange">
          <mt-swipe-item v-for="(item, index) in photo" :key="index">
            <img class="banner" alt="" :src="item">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="del-item">
        <img class="close-icon" @click.stop="handleClose()" src="../../../../assets/close1.png">
      </div>
    </div>
    <!-- 相册 -->
  </div>
</template>

<script>
  import { httpFormPostMethod } from "@/common/HttpService"

  export default {
    name: "att_detail",
    data() {
      return {
        page_show: false,
        index: 0,
        info: {
          stu_avatar: '',
          stu_name: '',
          cls_show_name: '',
          gra_show_name: '',
          att_list: []
        },
        onerror: 'this.src="' + require('../../../../assets/qqdh_photo.png') + '"',
        parameter: {
          att_type: this.$route.query.att_type,
          att_date: this.$route.query.att_date,
          stu_id: this.$route.query.stu_id,
        },
        photo: [],
        photo_show: false,
        no_data: false,
        arr: []
      }
    },
    filters: {
      formatDate(value) {
        if (value) {
          let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
          return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
        }
      }
    },
    created() {
      this.handleGetInfo()
    },
    methods: {
      handleGetInfo() {
        httpFormPostMethod('web/use/tea/att/info/list', this.parameter).then((res) => {
          let data = res.data
          if (JSON.stringify(data) != '{}') {
            this.info = {...this.info, ...data}
            let date = this.handleDateSort(res.data.att_list || [])
            let arr = []
            date.map((item, index) => {
              arr.push({
                att_time: item,
                children: []
              })
              data.att_list.map((vv) => {
                let pattern = /(\d{4})(\d{2})(\d{2})/;
                let att_time = vv.att_time ? vv.att_time.slice(0, 8) : ''
                if (item === att_time.replace(pattern, '$1-$2-$3')) {
                  arr[index].children.push(vv)
                }
              })
            })
            this.info.att_list = arr
            this.no_data = true
          } else {
            this.no_data = false
          }
          this.page_show = true
        })
      },
      handleDateSort(arr){
        let arr1 = []
        let pattern = /(\d{4})(\d{2})(\d{2})/;
        arr.map((item) => {
          item.old_time = item.att_time ? item.att_time.slice(0, 8) : ''
          if (arr1.indexOf(item.old_time.replace(pattern, '$1-$2-$3')) === -1) {
            arr1.push(item.old_time.replace(pattern, '$1-$2-$3'))
          }
        })
        arr1.sort(function(a,b) {
          return Date.parse(b.replace(/-/g, '/')) - Date.parse(a.replace(/-/g, '/'));
        })
        return arr1
      },
      // 查看相册
      handleSeePhoto(data) {
        this.photo = data
        this.photo_show = true
      },
      // 轮播图索引
      handleChange(index) {
        this.index = index
      },
      // 关闭相册
      handleClose() {
        this.photo_show = false
        this.photo = []
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .detail {
    width: 100%;

    .user-info {
      width: 100%;
      height: 5rem;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      background: linear-gradient(180deg,#3fbfff, #3399ff);

      .info-photo {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin-right: 0.6rem;
      }

      .name {
        width: 10rem;
        height: 3rem;

        .nickname {
          margin-top: 0.3rem;
          width: 10rem;
          height: 1.4rem;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .classname {
          margin-top: 0.3rem;
          width: 8rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: rgba(255,255,255,0.80);
        }
      }
    }

    .card-list {
      width: 100%;
      height: calc(100vh - 5rem);
      padding: 0 0.8rem 0.8rem;
      overflow-y: auto;

      .kq_item {
        width: calc(100% - 1rem);
        margin-top: 1.1rem;
        margin-left: 1rem;
        border-radius: 0.4rem;
        background: #fff;
        box-shadow: 0 0.05rem 0.15rem 0 rgba(0, 0, 0, 0.06);
        padding: 0.5rem;
        position: relative;

        .item-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 1.1rem;

          .title {
            width: 8rem;
            height: 1.1rem;
            font-size: 0.8rem;
            font-weight: 600;
            text-align: left;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .desc {
            display: flex;
            justify-content: flex-end;
            width: 6rem;
            height: 1.1rem;
            font-size: 0.7rem;
            font-weight: 400;
            color: #999999;

            .degree {
              color: #333333;
            }
          }
        }

        .item-desc {
          margin: 0.4rem 0;
          width: 100%;
          font-size: 0.7rem;
          font-weight: 400;
          color: #333333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;

          .date-txt {
            color: #5184b6;
            margin-right: 0.1rem;
          }
        }

        .item-block {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .block {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 4rem;
            height: 1.3rem;
            background: #ffffff;
            border: 0.05rem solid #3598fe;
            border-radius: 0.2rem;
            font-size: 0.6rem;
            font-weight: 400;
            color: #3399ff;

            .img-icon {
              width: 1rem;
              height: 1rem;
              margin-right: 0.15rem;
            }
          }
        }

        &::before {
          content: "";
          width: 0.55rem;
          height: 0.55rem;
          background: #3399ff;
          border-radius: 50%;
          position: absolute;
          left: -1rem;
          top: 1.2rem;
        }

        &::after {
          content: "";
          width: 0.1rem;
          height: 5.7rem;
          background: #ebebeb;
          border-radius: 0.2rem;
          position: absolute;
          left: -0.77rem;
          top: 1.75rem;
        }

        &:last-of-type {
          &::after {
            display: none;
          }
        }
      }
    }

    .date-title {
      width: 100%;
      margin: 1.1rem 0 0.6rem 0;
      height: 1rem;
      font-size: 0.7rem;
      font-weight: 400;
      text-align: left;
      color: #666666;
    }

    .photo-album {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.8);
      transition: .5s;
      z-index: 9999;

      .top-number {
        position: absolute;
        left: 50%;
        top: 2rem;
        transform: translate(-50%, 0%);
        width: 100%;
        height: 1.4rem;
        font-size: 1rem;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .album-list {
        position: absolute;
        left: 50%;
        top: 5rem;
        transform: translate(-50%, 0%);
        width: 100%;
        height: 16rem;

        .banner {
          width: 100%;
          height: 16rem;
          object-fit: contain;
        }
      }

      .del-item {
        position: absolute;
        left: 50%;
        top: 23rem;
        transform: translate(-50%, 0%);
        display: flex;
        align-items: center;
        justify-content: center;

        .close-icon {
          width: 2.4rem;
          height: 2.4rem;
        }
      }
    }
  }
</style>
