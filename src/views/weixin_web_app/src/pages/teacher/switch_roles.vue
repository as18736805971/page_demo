<template>
  <div class="switch_roles">
    <div class="current">
      <div class="current-top">
        <div class="top-left">
          <img class="photo" src="../../assets/qqdh_photo.png">
          <div class="nickname">
            <div class="name">刘大花</div>
            <div class="type">任课教师</div>
          </div>
        </div>
        <div class="top-right">当前使用</div>
      </div>
      <div class="current-bottom">
        <div>郑州市文化路实验小学</div>
        <div class="margin">1年级</div>
        <div>1-01班</div>
      </div>
    </div>

    <div class="list-item">
      <div class="item-left">
        <img class="person" src="../../assets/person.png">
      </div>
      <div class="item-right">
        <div class="phone">137****8888</div>
        <div class="type">家长</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "switch_roles",
    data() {
      return {}
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .switch_roles {
    width: 100%;
    padding: 0.6rem;

    .current {
      width: 100%;
      height: 6.2rem;
      background: #ffffff;
      border-radius: 0.4rem;
      box-shadow: 0rem 0.05rem 0.15rem 0rem rgba(0,0,0,0.06);
      margin-bottom: 0.6rem;
      padding: 0.6rem;

      .current-top {
        width: 100%;
        height: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .top-left {
          display: flex;
          align-items: center;
          height: 3.2rem;

          .photo {
            width: 3.2rem;
            height: 3.2rem;
            margin-right: 0.6rem;
          }

          .nickname {
            height: 3.2rem;
            display: flex;
            align-items: flex-start;
            flex-direction: column;

            .name {
              width: 7rem;
              height: 1.25rem;
              font-size: 0.9rem;
              font-weight: 600;
              text-align: left;
              color: #333333;
              margin-bottom: 0.6rem;
              margin-top: 0.2rem;
              line-height: 1.25rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .top-right {
          height: 3.2rem;
          display: flex;
          align-items: flex-start;
          font-size: 0.8rem;
          font-weight: 400;
          color: #ff944f;
        }
      }

      .current-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 0.7rem;
        font-weight: 400;
        color: #999999;
        margin-top: 0.8rem;

        .margin {
          margin: 0 1rem;
        }
      }
    }

    .type {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e8f4ff;
      border-radius: 0.1rem;
      font-size: 0.6rem;
      font-weight: 400;
      color: #3399ff;
      padding: 0.1rem 0.3rem;
    }

    .list-item {
      width: 100%;
      height: 4.4rem;
      background: #ffffff;
      border-radius: 0.4rem;
      box-shadow: 0rem 0.05rem 0.15rem 0rem rgba(0,0,0,0.06);
      margin-bottom: 0.6rem;
      padding: 0.6rem;
      display: flex;
      align-items: center;

      .item-left {
        .person {
          width: 3.2rem;
          height: 3.2rem;
          margin-right: 0.6rem;
        }
      }

      .item-right {
        height: 3.2rem;
        display: flex;
        align-items: flex-start;
        flex-direction: column;


        .phone {
          width: 100%;
          height: 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: left;
          color: #333333;
          margin-bottom: 0.6rem;
          margin-top: 0.2rem;
        }
      }
    }
  }
</style>