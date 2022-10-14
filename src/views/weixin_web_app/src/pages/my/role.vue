<template>
  <div class="role_main">
    <div class="role_list">
      <div
        class="role_item"
        @click="choice_role(item)"
        v-for="(item, index) in roles"
        :key="index"
      >
        <div class="left_photo" :class="{ checked_role: item.checked }">
          <img
            :src="item.avatar"
            alt=""
            class="person_photo"
            :onerror="errorImg"
          />
        </div>
        <div class="des_wrapper">
          <span class="name">{{ item.user_name }}</span>
          <span class="sch">{{ item.scl_name }}</span>
        </div>
        <span class="grades">{{ item.gra_name }}年级{{ item.cls_name }}班</span>
      </div>
    </div>
  </div>
</template>
<script>
import { decrypt, encrypt, setToken, getToken } from "@/common/auth";
import { mapMutations } from "vuex";
export default {
  name: "role",
  components: {},
  data: function () {
    return {
      roles: JSON.parse(decrypt(localStorage.getItem("roles"))),
      errorImg: 'this.src="' + require("../../assets/person_photo.png") + '"',
    };
  },
  mounted() {
    if (decrypt(getToken())) {
      this.roles.forEach((opt) => {
        if (opt.user_name === JSON.parse(decrypt(getToken())).user_name) {
          opt.checked = true;
        }
      });
      this.$forceUpdate();
    }
  },
  methods: {
    ...mapMutations(["UPDATE_INDEXTYPE"]),
    choice_role(item) {
      this.UPDATE_INDEXTYPE(1);
      item.checked = true;
      setToken(encrypt(JSON.stringify(item)));
      this.$router.replace("/");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.role_main {
  .role_list {
    padding: 0.55rem;
    .role_item {
      padding: 0.7rem;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      position: relative;
      margin-bottom: 0.55rem;
      .left_photo {
        position: relative;
        .person_photo {
          @include wh(2.9rem, 2.9rem);
        }
      }
      .checked_role {
        &::after {
          content: "当前选中";
          position: absolute;
          left: 0.15rem;
          bottom: 0;
          font-size: 0.6rem;
          padding: 0.1rem;
          background: #66c46d;
          border-radius: 1px;
          color: #fff;
        }
      }
      .des_wrapper {
        display: flex;
        flex-direction: column;
        margin-left: 0.45rem;
        .name {
          font-size: 0.8rem;
          line-height: 1.1rem;
          margin-bottom: 0.45rem;
        }
        .sch {
          color: #999999;
        }
      }
      .grades {
        position: absolute;
        right: 0.7rem;
        top: 0.7rem;
        color: #999999;
      }
    }
  }
}
</style>
