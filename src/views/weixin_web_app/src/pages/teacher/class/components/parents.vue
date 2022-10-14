<template>
  <div class="card-list">
    <template v-if="list.length > 0">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <div class="item-top space-between">
          <div class="title">{{ type == 1 ? '联系人' + ( index + 1) : item.spb_name }}</div>
          <!--<img class="icon-del" v-if="type == 2" @click="handleDel(item, index)" src="../../../../assets/del.png" />-->
        </div>
        <div class="item-bottom">
          <div class="item-margin space-between" v-if="type == 1">
            <div class="left-txt">关系</div>
            <div class="right-txt">{{ item.fam_relation }}</div>
          </div>
          <div class="item-margin space-between">
            <div class="left-txt">手机号码</div>
            <div class="right-txt phone-txt">{{ type == 1 ? item.fam_phone : item.spb_phone }}</div>
          </div>
        </div>
      </div>
    </template>
    <div class="add-contact">
        <div class="add-btn" @click="onSubmit()">
          <img class="add-icon" src="../../../../assets/jia.png">
          <div class="add-txt">{{ type == 1 ? '添加家长' : '添加电话簿' }}</div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: "parents",
    props: {
      type: {
        type: Number,
        default: 1,
      },
      list: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {}
    },
    methods: {
      handleDel(item, index) {
        this.$emit('handleDel', {
          id: this.type == 1 ? item.fam_id : item.spb_id,
          type: this.type,
          index: index,
        })
      },
      onSubmit() {
        this.$emit('onSubmit', {
          type: this.type,
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .card-list {
    width: 100%;
    padding: 0.6rem;

    .space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .list-item {
      width: 100%;
      background: #ffffff;
      border-radius: 0.4rem;
      box-shadow: 0 0.05rem 0.15rem 0 rgba(0,0,0,0.06);
      margin-bottom: 0.6rem;

      .item-top {
        width: 100%;
        height: 2.3rem;
        padding: 0 0.8rem;
        border-bottom: 0.05rem solid #f0f2f5;

        .title {
          font-size: 0.8rem;
          font-weight: 500;
          color: #666666;
        }

        .icon-del {
          width: 1rem;
          height: 1rem;
        }
      }

      .item-bottom {
        width: 100%;
        padding: 0.6rem 0.8rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #999999;

        .item-margin {
          margin-bottom: 0.6rem;
        }

        .item-margin:last-child {
          margin-bottom: 0;
        }

        .right-txt {
          color: #333333;
        }

        .phone-txt {
          color: #3399ff;
        }
      }
    }

    .list-item:last-child {
      margin-bottom: 0;
    }

    .add-contact {
      width: 100%;
      display: flex;
      align-items: center;

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 2.4rem;
        background: #ffffff;
        border-radius: 0.4rem;
        box-shadow: 0 0.05rem 0.15rem 0 rgba(0,0,0,0.06);

        .add-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.4rem;
        }

        .add-txt {
          font-size: 0.8rem;
          color: #333333;
        }
      }
    }
  }
</style>
