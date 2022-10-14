<template>
  <div class="my_class">
    <template v-if="show_list">
      <div class="select" v-for="(item, index) in class_list" :key="index">
        <div class="list-item" @click="handleOneList(item, index)">
          <div class="title">{{ item.gra_show_name }}</div>
          <img class="arrow_x" v-if="item.children.length > 0" :src="item.showChild ? require('../../../assets/arrow_up.png') : require('../../../assets/arrow_x.png')">
        </div>
        <template v-if="item.showChild">
          <div class="children-item" v-for="(cItem, cIndex) in item.children" :key="cIndex" @click="handleJump(cItem)">
            <div class="title">{{ cItem.cls_show_name }}</div>
            <img class="arrow_x" src="../../../assets/arrow_right1.png">
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import { httpFormPostMethod } from '@/common/HttpService'

  export default {
    name: "my_class",
    data() {
      return {
        show_list: false,
        class_list: [],
      }
    },
    created() {
      this.handleGetList()
      this.show_list = true
    },
    methods: {
      // 获取年级及班级数据
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
        })
      },
      // 选择一级列表 查看二级列表
      handleOneList(data, index) {
        this.class_list[index].showChild = !this.class_list[index].showChild
      },
      // 二级跳转班级
      handleJump(data) {
        this.$router.push({
          path: 'class_details',
          query: {
            gra_id: data.gra_id,
            cls_id: data.cls_id,
            gra_name: data.gra_show_name,
            cls_name: data.cls_show_name,
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .my_class {

    .select {
      width: 100%;
      margin-bottom: 0.05rem;
    }

    .list-item {
      width: 100%;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      padding: 0 0.8rem;

      .title {
        width: 8rem;
        height: 1.1rem;
        font-size: 0.8rem;
        font-weight: 600;
        text-align: left;
        color: #333333;
        line-height: 1.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .arrow_x {
        width: 1.2rem;
        height: 1.2rem;
      }
    }

    .children-item {
      width: 100%;
      height: 2.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafafa;
      padding: 0 0.8rem;

      .title {
        width: 8rem;
        height: 1.1rem;
        font-size: 0.8rem;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 1.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .arrow_x {
        width: 1.2rem;
        height: 1.2rem;
      }
    }


  }
</style>
