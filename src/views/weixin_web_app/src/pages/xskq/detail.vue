<template>
  <div class="xskq_detail">
    <div class="detail_top" v-if="detail_obj">
      <div class="detail_item">
        <span class="left">姓名</span>
        <span class="right">{{ detail_obj.stu_name }}</span>
      </div>
      <div class="detail_item">
        <span class="left">打卡时间</span>
        <span class="right">{{ detail_obj.att_time | fgTime }}</span>
      </div>
      <div class="detail_item">
        <span class="left">打卡类型</span>
        <span class="right">{{ detail_obj.att_type | att_type }}</span>
      </div>
      <div class="detail_item">
        <span class="left">进出类型</span>
        <span class="right">{{ detail_obj.inout_type_name }}</span>
      </div>
    </div>
    <div class="detail_top detail_bot" v-if="img_obj">
      <div class="title">考勤照片</div>
      <div class="contrast_pic">
        <div class="pic_item">
          <img
            :src="user_photo_path"
            :onerror="errorImg"
            alt=""
            class="pic_img"
          />
          <span>考勤预存头像</span>
        </div>
        <div class="pic_item">
          <img
            :src="'http://images.pajx.com.cn:14869/' + img_obj.stu_pic"
            class="pic_img"
            alt=""
          />
          <span>考勤现场图片</span>
        </div>
        <img src="../../assets/kq_vs.png" alt="" class="kq_vs" />
      </div>
      <div class="similarity">
        <span>相似度：</span>
        <span class="rate">{{ img_obj.pic_match_ratio }}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
export default {
  name: "xskq_detail",
  components: {},
  data: function () {
    return {
      detail_obj: null,
      img_obj: null,
      user_photo_path: "",
      errorImg: 'this.src="' + require("../../assets/person_photo.png") + '"',
    };
  },
  mounted() {
    this.get_att_info();
    this.get_stu_pic();
    this.get_stu_photo();
  },
  methods: {
    // 获取考勤列表
    get_att_info() {
      httpFormPostMethod("web/use/att/info", {
        stu_att_id: this.$route.query.stu_att_id,
      }).then((res) => {
        this.detail_obj = res.data;
      });
    },
    // 获取考勤图像
    get_stu_pic() {
      httpFormPostMethod("use/att/stu/pic", {
        stu_att_id: this.$route.query.stu_att_id,
      }).then((res) => {
        res.data.forEach((opt) => {
          this.img_obj = opt;
          // if (opt.pic_type === "1" || opt.pic_type === "4") {
          //   this.img_obj = opt;
          // }
        });
      });
    },
    // 获取学生照片
    get_stu_photo() {
      httpFormPostMethod("use/photo/stu/info", {
        stu_id: this.$route.query.stu_id,
      }).then((res) => {
        this.user_photo_path = res.data.user_photo_path;
        if (this.user_photo_path === null) {
          this.user_photo_path = "";
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.xskq_detail {
  padding: 0 0.55rem;
  .detail_top {
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    margin-top: 0.55rem;
    .detail_item {
      display: flex;
      justify-content: space-between;
      padding: 0.7rem;
      border-bottom: 1px solid #f0f2f5;
      .left {
        color: #999999;
      }
    }
  }
  .detail_bot {
    padding: 0 0.7rem;
    padding-bottom: 0.35rem;
    .title {
      font-weight: bold;
      padding: 0.7rem 0;
    }
    .contrast_pic {
      display: flex;
      position: relative;
      .pic_item {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;
        margin-right: 0.7rem;
        color: #666666;
        padding: 0.3rem 0;
        &:last-of-type {
          margin-right: 0;
        }
        .pic_img {
          width: 100%;
          height: 7.75rem;
          margin-bottom: 0.3rem;
          border-radius: 7px;
        }
      }
      .kq_vs {
        position: absolute;
        @include wh(1rem, 1rem);
        bottom: 0.35rem;
        left: 50%;
        margin-left: -0.5rem;
      }
    }
    .similarity {
      text-align: center;
      padding: 0.6rem 0;
      background: #fafafa;
      border-radius: 7px;
      color: #999999;
      .rate {
        color: #3399ff;
      }
    }
  }
}
</style>
