<template>
  <div class="details">
    <!--<div class="details-top">
      <div class="search-txt">
        <input class="input" placeholder="搜索姓名" type="text" />
        <img class="icon-search" src="../../../assets/search1.png">
      </div>
    </div>-->

    <div class="details-number">
      <div class="number-left">业务开通人数_总人数：</div>
      <div class="number-right">
        <span>{{ app_length }}</span>
        <span class="line">/</span>{{ total_number }}
      </div>
    </div>

    <div class="index-list">
      <mt-index-list>
        <mt-index-section v-for="(item, key, index) in student_list" :key="index" :index="key">
          <div class="list-item" v-for="(vv, kk) in item" :key="kk" @click="handleDetail(vv)">
            <div class="item-content">
              <div class="item-left">
                <img class="photo" :src="vv.stu_pic || require('../../../assets/qqdh_photo.png')" :onerror="onerror">
                <div class="item-txt">
                  <div class="nickname">{{ vv.stu_name }}</div>
                  <div class="phone">{{ vv.stu_no }}</div>
                </div>
              </div>
              <div class="item-right">
                <img class="icon-app" v-if="vv.open_num > 0" src="../../../assets/app.png" />
                <img class="icon-app card" v-if="vv.card_num > 0" src="../../../assets/card.png" />
                <img class="icon-right" src="../../../assets/arrow_right1.png" />
              </div>
            </div>
          </div>
        </mt-index-section>
      </mt-index-list>
    </div>

    <img class="edit-icon" @click="handleJump('add')" src="../../../assets/add.png" />
  </div>
</template>

<script>
  import { httpFormPostMethod } from '@/common/HttpService'
  import pinyin from 'js-pinyin'

  export default {
    name: "class_details",
    data() {
      return {
        gra_id: this.$route.query.gra_id || '', // 年级id
        cls_id: this.$route.query.cls_id || '', // 班级id
        gra_name: this.$route.query.gra_name || '', // 年级
        cls_name: this.$route.query.cls_name || '', // 班级
        onerror: 'this.src="' + require('../../../assets/qqdh_photo.png') + '"',
        app_length: 0,
        total_number: 0,
        no_list: [],
        student_list: [], // 新排序数据
        lettersArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
        area: sessionStorage.getItem('area'),
      }
    },
    created() {
      window.document.title = this.$route.query.cls_name || '我的班级'
      this.handleGetList()
    },
    methods: {
      // 获取学生列表
      handleGetList() {
        let data = {
          cls_id: this.cls_id
        }
        if (this.area === 'sn') {
          data.gra_id = this.gra_id
        }
        httpFormPostMethod('web/cls/stu/list', data).then((res) => {
          this.no_list = res.data
          this.total_number = res.data.length
          let app = []
          res.data.map((item) => {
            if (item.open_num > 0) {
              app.push(item)
            }
          })
          this.app_length = app.length
          this.handleFirstPin()
        })
      },
      // 处理中文名称排序
      handleFirstPin() {
        pinyin.setOptions({ checkPolyphone: false, charCase: 0 })
        let oldArrs = this.no_list
        let newArrs = []
        let _this = this
        for (let i = 0; i < oldArrs.length; i++) {
          // 获取每条数据里的名称
          let wordName = oldArrs[i].stu_name
          // 获取所有名称的首字母，并且大写
          let fristName = pinyin.getCamelChars(wordName).substring(0, 1).toUpperCase()
          // 进行判断，给原始json数据添加新的键值对
          if (this.lettersArr.includes(fristName) == true) {
            oldArrs[i].first = fristName
          } else {
            oldArrs[i].first = '#'
          }
          // 放入新的数组中
          newArrs.push(oldArrs[i])
        }
        let wordJson = {}
        for (let i = 0; i < _this.lettersArr.length; i++) {
          wordJson[_this.lettersArr[i]] = newArrs.filter(function(value) {
            return value.first === _this.lettersArr[i]
          })
        }

        for (let item in wordJson) {
          if(wordJson[item].length === 0) {
            delete wordJson[item]
          }
        }

        _this.student_list = wordJson
      },
      handleJump() {
        this.$router.push({
          path: 'add_student',
          query: {
            gra_id: this.gra_id,
            cls_id: this.cls_id,
            gra_name: this.gra_name,
            cls_name: this.cls_name,
          }
        })
      },
      handleDetail(vv) {
        this.$router.push({
          path: 'information',
          query: {
            stu_id: vv.stu_id
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
 @import '../../../styles/mixin';

 .details {
   .details-top {
      width: 100%;
      height: 2.8rem;
      background: #ffffff;
      padding: 0.3rem 0.8rem;

      .search-txt {
        position: relative;
        width: 100%;
        height: 2.2rem;
        background: #ffffff;

        .icon-search {
          position: absolute;
          top: 0.6rem;
          left: 0.55rem;
          width: 1rem;
          height: 1rem;
        }

        .input {
          width: 100%;
          height: 2.2rem;
          background: #fafafa;
          border: 0.05rem solid #f0f2f5;
          border-radius: 0.4rem;
          padding-left: 1.95rem;
          padding-right: 0.5rem;
          font-size: 0.8rem;
        }
      }
    }

   .details-number {
     width: 100%;
     height: 2.4rem;
     background: #ffffff;
     padding: 0 0.8rem;
     display: flex;
     align-items: center;
     justify-content: space-between;

     .number-left {
       height: 1rem;
       font-size: 0.7rem;
       font-weight: 400;
       text-align: left;
       color: #999999;
       line-height: 1rem;
     }

     .number-right {
       display: flex;
       align-items: center;
       height: 1rem;
       font-size: 0.7rem;
       font-weight: 400;
       line-height: 1rem;
       color: #666666;

       span {
         color: #3399ff;
       }

       .line {
         color: #CCCCCC !important;
         margin: 0 0.1rem;
       }
     }
   }

   .index-list {
     width: 100%;
     height: calc(100vh - 2.4rem);
     overflow-y: auto;

    .list-item {
      width: 100%;

      .item-top {
        width: 100%;
        height: 1.5rem;
        padding: 0 0.8rem;
        display: flex;
        align-items: center;
        background: #F5F7FA;
        font-size: 0.7rem;
        font-weight: 400;
        text-align: left;
        color: #999999;
      }

      .item-content {
        width: 100%;
        height: 3.2rem;
        background: #ffffff;
        padding: 0 0.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item-left {
          display: flex;
          align-items: center;

          .photo {
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            margin-right: 0.5rem;
          }

          .item-txt {
            width: 8rem;
            height: 2.1rem;

            .nickname {
              width: 8rem;
              height: 1.1rem;
              font-size: 0.8rem;
              font-weight: 400;
              text-align: left;
              color: #333333;
              line-height: 1.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .phone {
              width: 8rem;
              height: 1rem;
              font-size: 0.7rem;
              font-weight: 400;
              text-align: left;
              color: #999999;
              line-height: 1rem;
            }
          }
        }

        .item-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .icon-right {
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.2rem;
          }

          .icon-app {
            width: 1.3rem;
            height: 1.3rem;
          }

          .card {
            margin-left: 0.7rem;
          }
        }
      }
    }
   }

   .the-index {
     position: fixed;
     right: 0.3rem;
     top: 51.5%;
     transform: translate(-50%, -50%);
     display: flex;
     flex-direction: column;
     width: 0.7rem;
     font-size: 0.7rem;
     font-weight: 400;
     text-align: center;
     color: #3399ff;
   }

   .edit-icon {
     position: fixed;
     right: 0.4rem;
     bottom: 1.5rem;
     width: 3.6rem;
     height: 3.6rem;
   }
 }

 ::v-deep .mint-indexlist-content {
   margin-right: 0 !important;
 }

 ::v-deep .mint-indexlist-nav {
   background: transparent !important;
   border: none !important;
 }

 ::v-deep .mint-indexlist-navitem {
   color: #3399FF;
 }

 ::v-deep .mint-indexsection-index {
   color: #999999 !important;
 }
</style>
