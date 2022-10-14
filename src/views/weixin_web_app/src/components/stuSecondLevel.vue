<template>
  <div>
    <div class="stu_choice_tab" v-if="tab_list.length > 0">
      <span
        class="tab_item"
        v-for="(item, index) in tab_list"
        :key="index"
        :class="{
          checkedtab: item.stu_no === stu_no,
          lasttab: index === tab_list.length - 1,
        }"
        @click="choice_tab(item)"
        >{{ item.stu_name }}</span
      >
      <span class="seat"></span>
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
    this.tab_list.unshift({
      stu_name: "全部",
      stu_no: "",
    });
    this.choice_tab(this.tab_list[0]);
  },
  methods: {
    // 选择tab栏
    choice_tab(item) {
      this.stu_no = item.stu_no;
      this.$emit("get_stu", item);
    }
  },
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
  padding: 0.7rem 0;
  padding-left: 0.55rem;
  .tab_item {
    position: relative;
    margin-right: 0.7rem;
    color: #999999;
    padding: 0.25rem 0.9rem;
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 14px;
    line-height: calc(100% + .25rem);
  }
  .checkedtab {
    color: #3399ff;
    background: #e7f3ff;
    border: 1px solid #3399ff;
  }
  .lasttab {
    margin-right: 0.25rem;
  }
  .seat {
    padding: 0.15rem;
  }
}
</style>
