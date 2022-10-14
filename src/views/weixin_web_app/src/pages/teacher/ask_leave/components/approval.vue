<template>
  <div class="approval" :style="'height: calc(100vh - ' + height + 'rem);'">
    <template v-if="list.length > 0">
      <div class="list-item" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
        <div class="top space-between">
          <div class="left">
            <div class="title">{{ item.cls_show_name ? '(' + item.cls_show_name + ')' : '' }}{{ item.stu_name }}的请假</div>
            <div class="type">{{ item.leave_type == '0' ? '事假' : item.leave_type == '1' ? '病假' : '其他' }}</div>
          </div>
          <div class="right" :class="item.leave_status == '2' ? 'through' : item.leave_status == '1' ? 'audit' : item.leave_status == '3' ? '' : 'cancel'">
            {{ item.leave_status == '2' ? '审核通过' : item.leave_status == '1' ? '待审核' : item.leave_status == '3' ? '审核未通过' : '已取消' }}
          </div>
        </div>
        <div class="content">
          <div class="txt">开始时间：{{ item.begin_time | formatDate }}</div>
          <div class="txt">结束时间：{{ item.end_time | formatDate }}</div>
          <div class="txt">离校时间：{{ item.leave_time | formatDate }}</div>
          <div class="txt">请假事由：{{ item.leave_reason }}</div>
        </div>
        <div class="bottom">{{ item.create_time | formatDate }}</div>
      </div>
    </template>
    <template v-else>
      <section class="main-no-data">
        <img src="../../../../assets/no_data.png" alt class="img" />
        <div class="text">暂无内容</div>
      </section>
    </template>
  </div>
</template>

<script>
  export default {
    name: "approval",
    data() {
      return {}
    },
    filters: {
      formatDate(value) {
        if (value) {
          let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
          return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
        }
      }
    },
    props: {
      list: {
        type: Array,
        default: () => []
      },
      height: {
        type: String,
        default: '2.4'
      }
    },
    methods: {
      handleDetail(data) {
        this.$router.push({
          path: 'approval_detail',
          query: {
            leave_id: data.leave_id,
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .approval {
    width: 100%;
    padding: 0.5rem 0.6rem;
    overflow-y: auto;

    .space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .list-item {
      width: 100%;
      background: #ffffff;
      border-radius: 0.2rem;
      padding: 0.5rem;
      margin-bottom: 0.5rem;

      .top {
        width: 100%;
        height: 1.2rem;
        margin-bottom: 0.5rem;

        .left {
          display: flex;
          align-items: center;
          height: 1.2rem;

          .title {
            max-width: 10rem;
            margin-right: 0.4rem;
            font-size: 0.8rem;
            font-weight: 500;
            color: #2c2e33;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .type {
            border: 0.05rem solid #3399ff;
            border-radius: 0.1rem;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.55rem;
            font-weight: 400;
            color: #3399ff;
          }
        }

        .right {
          width: 3.5rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #f0644d;
          text-align: right;
        }
      }

      .content {
        width: 100%;
        font-size: 0.7rem;
        font-weight: 400;
        text-align: left;
        color: #909399;

        .txt {
          height: 1.1rem;
        }
      }

      .bottom {
        width: 100%;
        height: 0.9rem;
        font-size: 0.6rem;
        font-weight: 400;
        text-align: right;
        color: #c4c7cc;
        margin-top: 0.4rem;
      }
    }

    .list-item:last-child {
      margin-bottom: 0;
    }

    .through {
      color: #66C46D !important;
    }

    .audit {
      color: #F98700 !important;
    }

    .cancel {
      color: #909399 !important;
    }
  }
</style>
