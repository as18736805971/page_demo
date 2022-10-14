<template>
  <div class="select_class">
    <template v-if="class_list.length !== 0">
      <div class="left-item">
        <div class="gra_item" :class="gra_id === item.gra_id ? 'active' : ''" v-for="(item, index) in class_list" :key="index"  @click="handleTab(item)">{{ item.gra_show_name }}</div>
      </div>
      <div class="right-item">
        <template v-if="item_list.length !== 0">
          <div class="cls_item" :class="cls_id === item.cls_id ? 'active' : ''" v-for="(item, index) in item_list" :key="index" @click="handleJump(item)">{{ item.cls_show_name }}</div>
        </template>
        <template v-else>
          <div class="no-data_list">
            <img class="no-img" :src="require('@/assets/no_data.png')">
            <div class="no-text">暂无数据</div>
          </div>
        </template>
      </div>
    </template>

    <template v-else>
      <div class="no-data_list">
        <img class="no-img" :src="require('@/assets/no_data.png')">
        <div class="no-text">暂无数据</div>
      </div>
    </template>
  </div>
</template>

<script>
import { httpFormPostMethod } from "@/common/HttpService";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "select_class",
  data() {
    return {
      // 1 亲情电话 2作业 3学生照片采集
      type: this.$route.query.type || 1,
      gra_id: '',
      cls_id: '',
      gra_name: '',
      class_list: [],
      item_list: []
    }
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  beforeRouteLeave(to, from, next) {
    this.type = this.$route.query.type
    next()
  },
  mounted() {
    this.handleGetList()
    this.UPDATE_INCLUDE_PAGE({
      pageName: "select_class",
    });
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    handleTab(data) {
      this.gra_id = data.gra_id
      this.gra_name = data.gra_name
      this.class_list.map((item) => {
        if (item.gra_id === data.gra_id) {
          this.item_list = item.children
        }
      })
    },
    handleJump(data) {
      this.cls_id = data.cls_id
      let path = this.type == 1 ? '/affection' : this.type == 2 ? '/homework' : this.type == 3 ? '/scl_collect' : ''
      this.$router.push({
        path: path,
        query: {
          gra_id: this.gra_id,
          gra_name: this.gra_name,
          cls_id: data.cls_id,
          cls_name: data.cls_name,
        }
      });
    },
    handleGetList() {
      httpFormPostMethod('web/cls/cascade', {}).then((res) => {
        let gra_list = []
        let gra_id = ''
        res.data.map((item) => {
          if (gra_id !== item.gra_id) {
            gra_id = item.gra_id
            gra_list.push({
              status: false,
              showChild: false,
              gra_id: item.gra_id,
              gra_name: item.gra_name,
              gra_show_name: item.gra_show_name,
              children: []
            })
          }
        })
        gra_list.map((vv) => {
          res.data.map((vvv) => {
            if (vvv.gra_id === vv.gra_id) {
              vvv.children = []
              vvv.status = false
              vvv.showChild = false
              vv.children.push(vvv)
            }
          })
        })
        this.class_list = gra_list
        this.item_list = this.class_list[0].children
        this.gra_id = this.class_list[0].gra_id
        this.gra_name = this.class_list[0].gra_name
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.select_class {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  background: #ffffff;

  .left-item {
    width: 8rem;
    height: 100vh;
    background: rgb(245, 250, 255);
    overflow-y: auto;

    .gra_item {
      padding: 0 0.2rem;
      width: 8rem;
      height: 2.6rem;
      text-align: center;
      display: -webkit-box;
      line-height: 2.6rem;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      font-size: 0.7rem;
    }
  }

  .right-item {
    width: calc(100% - 8rem);
    height: 100%;
    padding: 0 0.2rem;
    background: #ffffff;
    overflow-y: auto;

    .cls_item {
      padding: 0 1.5rem;
      height: 2.6rem;
      display: -webkit-box;
      line-height: 2.6rem;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      font-size: 0.7rem;
    }
  }

  .active {
    color: #219bff;
    background: #ffffff;
  }
}

.no-data_list {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .no-img {
    height: 2rem;
    margin-bottom: 0.5rem;
  }

  .no-text {
    font-size: 0.6rem;
  }
}
</style>
