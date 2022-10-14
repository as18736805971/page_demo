<template>
  <div class="schvision_main">
    <div class="search-item">
      <input class="input" v-model="query" placeholder="搜索摄像头名称" type="text" @keyup.enter="handleSearch" />
      <img class="icon-search" src="../../assets/search1.png">
    </div>
    <stuFirstLevel @get_stu="get_stu" class="schvision_stu"></stuFirstLevel>
    <div class="top_tab" v-if="scl_id">
      <span
        class="common_tab"
        @click="switch_tab(1)"
        :class="{ checkedtab: type === 1 }"
        >班级</span
      >
      <span
        class="common_tab"
        @click="switch_tab(2)"
        :class="{ checkedtab: type === 2 }"
        >公共区域</span
      >
    </div>
    <template v-if="type === 1">
      <div class="monitor_list">
        <section class="list_main" v-if="class_list.length > 0">
          <div
              class="monitor_item"
              :class="{ online: item.camera_status === '1' }"
              v-for="(item, index) in class_screen_list"
              :key="index"
              @click="view_monitor(item)"
          >
            <img
                src="../../assets/online_monitor.png"
                alt=""
                v-show="item.camera_status === '1'"
                class="monitor"
            />
            <img
                src="../../assets/monitor.png"
                alt=""
                v-show="item.camera_status === '0'"
                class="monitor"
            />
            <span class="class">{{ item.equ_name || item.camera_name }}</span>
            <span class="status">{{
                item.camera_status === "1" ? "在线" : "离线"
              }}</span>
          </div>
        </section>
        <section v-else class="main-no-data">
          <img src="../../assets/no_data.png" alt class="img" />
          <div class="text">暂无内容</div>
        </section>
      </div>
    </template>
    <template v-else>
      <div class="monitor_list">
        <section class="list_main" v-if="public_list.length > 0">
          <div
              class="monitor_item"
              :class="{ online: item.camera_status === '1' }"
              v-for="(item, index) in public_screen_list"
              :key="index"
              @click="view_monitor(item)"
          >
            <img
                src="../../assets/online_monitor.png"
                alt=""
                v-show="item.camera_status === '1'"
                class="monitor"
            />
            <img
                src="../../assets/monitor.png"
                alt=""
                v-show="item.camera_status === '0'"
                class="monitor"
            />
            <span class="class">{{ item.equ_name || item.camera_name }}</span>
            <span class="status">{{
                item.camera_status === "1" ? "在线" : "离线"
              }}</span>
          </div>
        </section>
        <section v-else class="main-no-data">
          <img src="../../assets/no_data.png" alt class="img" />
          <div class="text">暂无内容</div>
        </section>
      </div>
    </template>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
import stuFirstLevel from "../../components/stuFirstLevel";
import { mapMutations, mapGetters } from "vuex";
import { Tool } from "@/common/Tool";
export default {
  name: "sch_vision",
  components: { stuFirstLevel },
  data: function () {
    return {
      type: 1,
      query: '',
      class_list: [],
      class_screen_list: [],
      public_list: [],
      public_screen_list: [],
      scl_id: "",
      cls_id: "",
    };
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  created() {},
  mounted() {
    this.UPDATE_INCLUDE_PAGE({
      pageName: "sch_vision",
    });
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    get_stu(user) {
      this.scl_id = user.scl_id;
      this.cls_id = user.cls_id;
      this.query = ''
      this.get_camera();
    },
    get_camera() {
      httpFormPostMethod("web/camera/scl/group", {
        scl_id: this.scl_id,
        cls_id: this.cls_id,
      }).then((res) => {
        if (res.data && JSON.stringify(res.data) !== "{}") {
          this.class_list = res.data.cls_group.camera_group_list;
          this.public_list = res.data.pub_group.camera_group_list;
          this.class_screen_list = res.data.cls_group.camera_group_list;
          this.public_screen_list = res.data.pub_group.camera_group_list;
          this.$forceUpdate();
        }
      });
    },
    switch_tab(type) {
      this.type = type;
      this.handleSearch()
    },
    view_monitor(item) {
      if (item.hls && item.camera_status === '1') {
        this.$router.push({
          path: "/play_video",
          query: {
            hls: item.hls
          },
        });
      } else {
        Tool.tip("无法播放");
      }
    },
    handleSearch() {
      if (this.type === 1) {
        if (this.query !== '') {
          this.class_screen_list = this.class_list.filter((item) => {
            if (item.equ_name) {
              if (item.equ_name.indexOf(this.query) > -1 || item.camera_name.indexOf(this.query) > -1) {
                return true
              }
            } else {
              if (item.camera_name.indexOf(this.query) > -1) {
                return true
              }
            }
          })
        } else {
          this.class_screen_list = this.class_list
        }
      } else {
        if (this.query !== '') {
          this.public_screen_list = this.public_list.filter((item) => {
            if (item.equ_name) {
              if (item.equ_name.indexOf(this.query) > -1 || item.camera_name.indexOf(this.query) > -1) {
                return true
              }
            } else {
              if (item.camera_name.indexOf(this.query) > -1) {
                return true
              }
            }
          })
        } else {
          this.public_screen_list = this.public_list
        }
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.schvision_main {
  .monitor_list {
    position: absolute;
    top: 6.6rem;
    bottom: 0;
    width: 100%;
    padding: 0 0.55rem;
    overflow-y: auto;
    .list_main {
      display: flex;
      flex-wrap: wrap;
      .monitor_item {
        width: calc(50% - 0.275rem);
        height: 8.55rem;
        background: #ffffff;
        color: #999999;
        border-radius: 7px;
        margin-right: 0.55rem;
        margin-top: 0.55rem;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        align-items: center;
        &:nth-child(2n) {
          margin-right: 0;
        }
        .monitor {
          @include wh(4rem, 4rem);
          margin-top: 1.45rem;
        }
        .class {
          margin-top: 0.7rem;
        }
        .status {
          font-size: 0.6rem;
        }
      }
      .online {
        background: #456a8f;
        color: #fff;
        .status {
          color: #64e26d;
        }
      }
    }
  }
}
.search-item {
  position: relative;
  height: 2.4rem;

  .icon-search {
    position: absolute;
    top: 0.7rem;
    left: 0.55rem;
    width: 1rem;
    height: 1rem;
  }

  .input {
    width: 100%;
    height: 2.4rem;
    background: #fafafa;
    border: 0.05rem solid #f0f2f5;
    border-radius: 0.4rem;
    padding-left: 1.95rem;
    padding-right: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
