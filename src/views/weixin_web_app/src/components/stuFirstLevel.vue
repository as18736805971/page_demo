<template>
  <div>
    <div class="stu_choice_tab" v-if="tab_list.length > 0">
      <span
        class="tab_item"
        v-for="(item, index) in tab_list"
        :key="index"
        :class="{ checkedtab: item.stu_no === stu_no }"
        @click="choice_tab(item)"
        >{{ item.stu_name }}</span
      >
    </div>
  </div>
</template>

<script>
import { decrypt } from "@/common/auth";
export default {
  name: "stuFirstLevel",
  props: {},
  data: function () {
    return {
      stu_no: "",
      tab_list: JSON.parse(decrypt(sessionStorage.getItem("roles"))),
    };
  },
  mounted() {
    this.choice_tab(this.tab_list[0]);
  },
  methods: {
    // 选择tab栏
    choice_tab(item) {
      this.stu_no = item.stu_no;
      this.$emit("get_stu", item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/mixin";
.stu_choice_tab {
  overflow-x: auto;
  display: flex;
  color: #999999;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.55rem 0.7rem;
  background: #fff;
  .tab_item {
    position: relative;
    margin-right: 1.1rem;
    line-height: calc(100% + .25rem);
    &:last-of-type {
      padding-right: 0.7rem;
    }
  }
  .checkedtab {
    color: #333333;
    font-weight: bold;
    &::after {
      content: "";
      @include wh(0.9rem, 0.1rem);
      background: #3399ff;
      position: absolute;
      bottom: -0.3rem;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &:last-of-type {
      &::after {
        left: calc(50% - 0.35rem);
      }
    }
  }
}
</style>
