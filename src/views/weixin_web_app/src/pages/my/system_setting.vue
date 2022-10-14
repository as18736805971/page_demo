<template>
  <div class="system_setting">
    <div class="logout_btn" @click="logout">退出登录</div>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
import { mapMutations } from "vuex";
export default {
  name: "system_setting",
  components: {},
  data: function () {
    return {};
  },
  mounted() {},
  methods: {
    ...mapMutations(["UPDATE_INDEXTYPE"]),
    logout() {
      httpFormPostMethod("login/logout", {}).then((res) => {
        localStorage.clear();
        this.UPDATE_INDEXTYPE(1);
        this.$router.push("/login");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.system_setting {
  padding: 0.55rem;
  .logout_btn {
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    padding: 0.75rem 0;
    text-align: center;
    color: #f0644d;
    font-size: 0.7rem;
  }
}
</style>
