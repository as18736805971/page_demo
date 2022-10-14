<template>
  <div class="student-list">
    <div class="student-top">
      <div class="block" :class="type === 1 ? 'block-active' : ''" @click="type = 1">正常打卡({{ att_num }}人)</div>
      <div class="block" :class="type === 2 ? 'block-active' : ''" @click="type = 2">异常打卡({{ not_num }}人)</div>
    </div>
    <template v-if="type === 1">
      <div class="list-item" v-if="att_list.length > 0">
          <div class="item-list" v-for="(item, index) in att_list" :key="index" @click="handleJump(item)">
            <div class="item-left">
              <img class="photo" :src="item.stu_avatar || require('../../../../assets/qqdh_photo.png')" :onerror="onerror">
              <div class="name">{{ item.stu_name }}</div>
            </div>
            <div class="item-right">
              <img class="icon-arrow" src="../../../../assets/arrow_right1.png">
            </div>
          </div>
      </div>
      <div class="main-no" v-else>
        <img src="../../../../assets/no_data.png" alt class="img" />
        <div class="text">暂无内容</div>
      </div>
    </template>
    <template v-else>
      <div class="list-item" v-if="not_list.length > 0">
        <div class="item-list" v-for="(item, index) in not_list" :key="index" @click="handleJump(item)">
          <div class="item-left">
            <img class="photo" :src="item.stu_avatar || require('../../../../assets/qqdh_photo.png')" :onerror="onerror">
            <div class="name">{{ item.stu_name }}</div>
          </div>
          <div class="item-right">
            <img class="icon-arrow" src="../../../../assets/arrow_right1.png">
          </div>
        </div>
      </div>
      <div class="main-no" v-else>
        <img src="../../../../assets/no_data.png" alt class="img" />
        <div class="text">暂无内容</div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "student_list",
    props: {
      att_list: {
        type: Array,
        default: () => []
      },
      att_num: {
        type: Number,
        default: 0
      },
      not_list: {
        type: Array,
        default: () => []
      },
      not_num: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        type: 1,
        onerror: 'this.src="' + require('../../../../assets/qqdh_photo.png') + '"',
      }
    },
    methods: {
      handleTab(type) {
        this.$emit('handleType', type)
      },
      handleJump(data) {
        this.$emit('handleDetail', data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .student-list {
    width: 100%;

    .student-top {
      width: 100%;
      height: 3rem;
      background: #ffffff;
      border-bottom: 0.05rem solid #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 7rem;
        height: 1.8rem;
        background: #f9f9f9;
        border: 0.05rem solid #e6e6e6;
        border-radius: 0.4rem;
        font-size: 0.7rem;
        font-weight: 400;
        color: #999999;
      }

      .block-active {
        background: #e7f3ff;
        border: 0.05rem solid #59AAFF;
        color: #3297FF;
        font-weight: 600;
      }
    }

    .list-item {
      width: 100%;
      padding: 0 0.8rem;
      background: #ffffff;

      .item-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 2.85rem;
        background: #ffffff;
        border-bottom: 0.05rem solid #f0f2f5;

        .item-left {
          display: flex;
          align-items: center;

          .photo {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            margin-right: 0.5rem;
          }

          .name {
            width: 10rem;
            font-size: 0.8rem;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .item-right {
          .icon-arrow {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }

      .item-list:last-child {
        border-bottom: none;
      }
    }

    .main-no {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 3rem;

      .img {
        width: 3.7rem;
        height: 3.15rem;
      }

      .text {
        line-height: 2rem;
        color: #cccccc;
      }
    }
  }

</style>
