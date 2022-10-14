<template>
  <div class="class-list">
    <div class="table_tr thead">
      <div class="table_td operation left">年级</div>
      <div class="table_td">打卡</div>
      <div class="table_td">异常打卡</div>
      <div class="table_td">总人数</div>
      <div class="table_td small"></div>
    </div>
    <div v-for="(item, index) in list" :key="index">
      <div class="table_tr" @click.stop="handleOne(index)">
        <div class="table_td operation left title">{{ item.gra_show_name ? item.gra_show_name : item.gra_name }}</div>
        <div class="table_td">{{ item.stu_att_num }}</div>
        <div class="table_td">{{ item.stu_not_att_num }}</div>
        <div class="table_td">{{ item.stu_num }}</div>
        <div class="table_td small">
          <img class="arrow-icon" :src="item.item_show ? require('../../../../assets/arrow_up.png') : require('../../../../assets/arrow_x.png')">
        </div>
      </div>
      <template v-if="item.item_show">
        <div class="table_tr" v-for="(vv, kk) in item.cls_list" :key="kk" @click="handleJump(vv)">
          <div class="table_td operation left">{{ vv.cls_name }}班</div>
          <div class="table_td">{{ vv.cls_stu_att_num }}</div>
          <div class="table_td">{{ vv.cls_stu_not_att_num }}</div>
          <div class="table_td">{{ vv.cls_stu_num }}</div>
          <div class="table_td small">
            <img class="arrow-icon" src="../../../../assets/arrow_right1.png">
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "class_list",
    props: {
      list: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {}
    },
    methods: {
      // 点击年级
      handleOne(index) {
        this.list[index].item_show = !this.list[index].item_show
      },
      // 点击班级
      handleJump(data) {
        this.$emit('handleGetStudent', data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .class-list {
    width: 100%;
    padding: 0 0.8rem;
    background: #ffffff;

    .thead {
      width: 1.4rem;
      height: 2.4rem !important;
      font-size: 0.7rem;
      font-weight: 600;
      color: #666666;
    }

    .table_tr {
      display:flex;
      width: 100%;
      height: 2.8rem;
      background: #ffffff;
      border-bottom: 0.05rem solid #f0f2f5;

      .table_td {
        text-align: center;
        flex:0 0 24%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.8rem;
        font-weight: 400;
        color: #333333;
        line-height: 2.8rem;

        &.operation{
          flex: 1;
        }

        &.small{
          flex: 0.4;
        }

        &.left{
          text-align: left;
        }

        &.title {
          font-weight: 600;
        }

        .arrow-icon {
          margin-top: 0.8rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }

    .table_tr:last-child {
      border-bottom: none;
    }
  }

</style>
