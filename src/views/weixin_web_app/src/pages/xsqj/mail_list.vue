<template>
  <div class="mail_list_main">
    <div class="search-input">
      <input
        type="search"
        placeholder="搜索姓名、手机号"
        class="input"
        @keyup.enter="get_user"
        v-model="keyword"
      />
      <img
        src="../../assets/input_clear.png"
        class="input_clear"
        v-if="keyword"
        alt=""
        @click="clear_keyword"
      />
      <img src="../../assets/search.png" alt class="icon" />
    </div>
    <div v-if="!search_status">
      <div class="crumbs_main">
        <div
          class="crumbs_item"
          v-for="(item, index) in crumbs_list"
          :key="index"
          @click="jump_group(item, index)"
        >
          <span>{{ item.group_name }}</span>
          <img
            src="../../assets/crumbs_arrow.png"
            alt=""
            class="crumbs_arrow"
          />
        </div>
      </div>
      <div
        class="mail_list"
        v-if="group_list.length > 0 || member_list.length > 0"
      >
        <div class="group_list">
          <div
            class="group_item"
            v-for="(item, index) in group_list"
            :key="index"
            @click="get_next_user(item)"
          >
            <span
              >{{ item.group_name
              }}<span class="person_num"
                >({{ item.all_num || 0 }}人)</span
              ></span
            >
            <img
              src="../../assets/arrow_right.png"
              alt=""
              class="arrow_right"
            />
          </div>
        </div>
        <div class="member_list">
          <div
            class="member_item"
            v-for="(item, index) in member_list"
            :key="index"
            @click="checked_user(item)"
          >
            <div class="name_circle">
              {{ item.tea_name | interceptName }}
            </div>
            <div class="member_des">
              <span class="name">{{ item.tea_name }}</span>
              <span class="tel">{{ item.tea_phone }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="main-no-data">
        <img src="../../assets/no_data.png" alt class="img" />
        <div class="text">暂无数据</div>
      </div>
    </div>
    <div v-if="search_status">
      <div class="member_list scltea_list" v-if="scltea_list.length > 0">
        <div
          class="member_item"
          v-for="(item, index) in scltea_list"
          :key="index"
          @click="checked_user(item)"
        >
          <div class="name_circle">
            {{ item.tea_name | interceptName }}
          </div>
          <div class="member_des">
            <span class="name">{{ item.tea_name }}</span>
            <span class="tel">{{ item.tea_phone }}</span>
          </div>
        </div>
      </div>
      <div v-else class="main-no-data">
        <img src="../../assets/no_data.png" alt class="img" />
        <div class="text">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tool } from "../../common/Tool";
import { httpFormPostMethod } from "@/common/HttpService";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "mail_list",
  components: {},
  data: function () {
    return {
      keyword: "",
      crumbs_list: [
        {
          group_id: "",
          group_name: "全部联系人",
        },
      ],
      group_list: [],
      member_list: [],
      scltea_list: [],
      search_status: false,
    };
  },
  mounted() {
    this.get_contacts();
    this.get_ungroup();
  },
  methods: {
    ...mapMutations(["UPDATE_CHECK_USER"]),
    // 获取通讯录分组列表
    get_contacts(group_id) {
      httpFormPostMethod("web/contact/list", {
        scl_id: this.$route.query.scl_id,
        group_id: group_id,
      }).then((res) => {
        this.group_list = res.data;
      });
    },
    // 获取分组成员列表
    get_member(group_id) {
      httpFormPostMethod("web/contact/member/list", {
        scl_id: this.$route.query.scl_id,
        group_id: group_id,
      }).then((res) => {
        this.member_list = res.data;
      });
    },
    // 获取下一级
    get_next_user(item) {
      this.get_contacts(item.group_id);
      this.get_member(item.group_id);
      this.crumbs_list.push({
        group_id: item.group_id,
        group_name: item.group_name,
      });
    },
    // 获取未分组联系人
    get_ungroup() {
      httpFormPostMethod("web/contact/ungroup", {
        scl_id: this.$route.query.scl_id,
      }).then((res) => {
        this.member_list = res.data;
      });
    },
    // 跳转到指定的组
    jump_group(item, index) {
      if (index !== this.crumbs_list.length - 1) {
        this.crumbs_list.splice(index + 1, this.crumbs_list.length - index - 1);
        this.get_contacts(item.group_id);
        if (item.group_name === "全部联系人" && !item.group_id) {
          this.get_ungroup();
        } else {
          this.get_member(item.group_id);
        }
      }
    },
    // 选中审批人
    checked_user(item) {
      this.UPDATE_CHECK_USER({
        tea_id: item.tea_id,
        tea_name: item.tea_name,
      });
      this.$router.go(-1);
    },
    get_user() {
      httpFormPostMethod("web/contact/tea/list", {
        scl_id: this.$route.query.scl_id,
        keyword: this.keyword,
      }).then((res) => {
        this.search_status = true;
        this.scltea_list = res.data;
      });
    },
    clear_keyword() {
      this.keyword = "";
      this.scltea_list = [];
      this.search_status = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.mail_list_main {
  .search-input {
    background: $cofff;
    padding: 0.35rem 0.7rem;
    @include fj();
    .input {
      width: 100%;
      height: 2rem;
      background: #f5f6fa;
      border-radius: 5px;
      font-size: 0.7rem;
      padding-left: 1.2rem;
    }
    .search {
      width: 3rem;
      font-size: 0.7rem;
      color: #3399ff;
      padding-left: 1rem;
    }
    .icon {
      position: absolute;
      @include wh(0.55rem, 0.55rem);
      left: 1.15rem;
    }
    .input_clear {
      position: absolute;
      left: calc(100% - 2rem);
    }
  }
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
  .crumbs_main {
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.55rem 0.7rem;
    background: #fff;
    .crumbs_item {
      margin-right: 1.1rem;
      position: relative;
      color: #3399ff;
      &:last-of-type {
        padding-right: 0.7rem;
        color: #999999;
        .crumbs_arrow {
          display: none;
        }
      }
      .crumbs_arrow {
        position: absolute;
        @include wh(1.1rem, 1.1rem);
      }
    }
  }
  .mail_list {
    position: absolute;
    width: 100%;
    top: 4.75rem;
    bottom: 0;
    overflow-y: auto;
    .group_list {
      padding-left: 0.7rem;
      background: #fff;
      .group_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
        border-bottom: 1px solid #f0f2f5;
        .person_num {
          color: #999999;
        }
        .arrow_right {
          @include wh(1.1rem, 1.1rem);
          margin-right: 0.7rem;
        }
      }
    }
  }
  .member_list {
    padding-left: 0.7rem;
    background: #fff;
    .member_item {
      display: flex;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid #f0f2f5;
      &:last-of-type {
        border-bottom: none;
      }
      .name_circle {
        @include wh(2.15rem, 2.15rem);
        background: rgb(50, 150, 250);
        border-radius: 50%;
        color: #ffffff;
        font-size: 0.6rem;
        text-align: center;
        line-height: 2.15rem;
      }
      .member_des {
        display: flex;
        flex-direction: column;
        margin-left: 0.45rem;
        .name {
        }
        .tel {
          font-size: 0.65rem;
          color: #999999;
        }
      }
    }
  }
  .scltea_list {
    position: absolute;
    width: 100%;
    top: 2.7rem;
    bottom: 0;
    overflow-y: auto;
  }
  .main-no-data {
    @include ctblr();
    margin-top: -1.25rem;
    font-size: 0.7rem;
    text-align: center;
    .text {
      line-height: 2rem;
    }
  }
}
</style>
