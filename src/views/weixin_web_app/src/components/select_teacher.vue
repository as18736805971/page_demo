<template>
  <div class="select-down">
    <div class="search-item">
      <input class="input" v-model="search_name" placeholder="搜索姓名" type="text" @keyup.enter="handleChange" />
      <img class="icon-search" src="../assets/search1.png">
    </div>

    <div class="all-select center" v-if="type == 1">
      <div @click="handleAll()">{{ all ? '以全选' : '全选' }}</div>
    </div>

    <div class="select-list" :class="type == 2 ? 'leave' : ''">
      <div v-for="(item, index) in teacher_list" :key="index">
        <div class="list-item">
          <div class="item-center" @click="handleOneList(item, index)">
            <div class="item-left">
              <img class="radio-item" v-if="type == 1" @click.stop="handleOneSelect(item, index)" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
              <div class="title">{{ item.group_name }}</div>
            </div>
            <img class="arrow_x" v-if="item.children.length > 0" :src="item.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
          </div>
        </div>
        <template v-if="item.showChild">
          <div class="children-list">
            <div class="children-item" v-for="(cItem, cIndex) in item.children" :key="cIndex" @click="type == 1 ? handleTwoSelect(item, index, cItem, cIndex) : type == 2 ? handleRadio(cItem, index, cIndex, 1) : ''">
              <img class="radio-item" :src="cItem.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
              <img class="photo" src="../assets/qqdh_photo.png">
              <div class="info column">
                <div class="title">{{ cItem.tea_name }}</div>
                <div class="phone">{{ cItem.tea_phone }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="no_group center" v-if="search_type === 1">未分组人员</div>

      <div class="children-list no-item">
        <div class="children-item no-item" v-for="(vv, kk) in no_group" :key="kk" @click="type == 1 ? handleNoSelect(vv, kk) : type == 2 ? handleRadio(vv, 0, kk, 2) : ''">
          <img class="radio-item" :src="vv.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
          <img class="photo" src="../assets/qqdh_photo.png">
          <div class="info column">
            <div class="title">{{ vv.tea_name }}</div>
            <div class="phone">{{ vv.tea_phone }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="suspend-button" v-if="type == 1">
      <div class="button" @click="onSubmit()">确定</div>
    </div>
  </div>
</template>

<script>
  import { httpFormPostMethod } from '@/common/HttpService'
  import { mapMutations } from "vuex";

  export default {
    name: "select_teacher",
    data() {
      return {
        search_name: '',
        search_type: 1,
        all: false, // 全选
        no_group: [], // 未分组
        teacher_list: [], // 分组列表
        type: this.$route.query.type || 1, // 1 校信 2 请假
      }
    },
    created() {
      this.handleGetList()
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'select_teacher',
        sign: false,
      });
    },
    methods: {
      ...mapMutations(['UPDATE_INCLUDE_PAGE']),
      handleChange() {
        if (this.search_name !== '') {
          this.handleGetSearchList()
        } else {
          this.handleGetList()
        }
      },
      handleGetSearchList() {
        httpFormPostMethod('web/stu/leave/tea/search', {
          tea_name: this.search_name
        }).then((res) => {
          this.teacher_list = []
          this.search_type = 2
          let teacher_list = res.data
          let no_list = []
          teacher_list.map((item) => {
            item.status = false
            no_list.push(item)
          })
          this.no_group = no_list
        }).catch((err) => {
          console.log(err)
        })
      },
      // 同时请求教师分组及教师列表
      handleGetList() {
        let p1 = httpFormPostMethod('WebApi/TeaNotice/getContactGroup', {

        })
        let p2 = httpFormPostMethod('WebApi/TeaNotice/getTeacherList', {

        })
        Promise.all([p1, p2]).then((data) => {
          let group_list = data[0].data || []
          let teacher_list = data[1].data || []
          this.search_type = 1

          // 按组排序列表
          group_list.map((vv) => {
            vv.showChild = false
            vv.status = false
            vv.children = []
            teacher_list.map((vvv) => {
              if (vv.group_id === vvv.group_id) {
                vvv.status = false
                vv.children.push(vvv)
              }
            })
          })
          this.teacher_list = group_list

          // 未分组列表
          let no_list = []
          teacher_list.map((item) => {
            if (!item.group_id) {
              item.status = false
              no_list.push(item)
            }
          })
          this.no_group = no_list
        }).catch((err) => {
          console.log(err)
        })
      },
      // 全选
      handleAll() {
        this.all = !this.all
        this.teacher_list.map((item) => {
          item.status = this.all
          item.children.map((vv) => {
            vv.status = this.all
          })
        })

        this.no_group.map((item) => {
          item.status = this.all
        })
      },
      // 选择一级列表 查看二级列表
      handleOneList(data, index) {
        this.teacher_list[index].showChild = !this.teacher_list[index].showChild
      },
      // 选择一级
      handleOneSelect(data, index) {
        this.teacher_list[index].status = !this.teacher_list[index].status
        if (this.teacher_list[index].children.length > 0) {
          if (this.teacher_list[index].status) {
            this.teacher_list[index].children.map((item) => {
              item.status = true
            })
          } else {
            this.teacher_list[index].children.map((item) => {
              item.status = false
            })
          }
        }
      },
      // 选择二级
      handleTwoSelect(data, index, cdata, cindex) {
        this.teacher_list[index].children[cindex].status = !this.teacher_list[index].children[cindex].status

        // 监听子集全选中后 父级也处于选中状态
        let has = false
        for (let item of this.teacher_list[index].children) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          this.teacher_list[index].status = true
        } else {
          this.teacher_list[index].status = false
        }
      },
      // 选择未知分组
      handleNoSelect(data, index) {
        this.no_group[index].status = !this.no_group[index].status
      },
      // 单选
      handleRadio(item, index, cindex, type) {
        this.teacher_list.map((item) => {
          item.showChild = false
          item.children.map((vv) => {
            vv.status = false
          })
        })

        this.no_group.map((item) => {
          item.status = false
        })

        if (type == 1) {
          this.teacher_list[index].children[cindex].status = !this.teacher_list[index].children[cindex].status
        } else {
          this.no_group[cindex].status = !this.no_group[cindex].status
        }
        this.$selectPass.$emit('leave_teacher', item)
        this.$router.go(-1)
      },
      // 点击确定
      onSubmit() {
        let ids = []
        this.no_group.map((item) => {
          if (item.status) {
            ids.push(item.tea_id)
          }
        })
        this.teacher_list.map((vv) => {
          vv.children.map((vvv) => {
            if (vvv.status) {
              ids.push(vvv.tea_id)
            }
          })
        })

        this.$selectPass.$emit('select_teacher', {
          tea_id: ids.join(','),
        })

        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';

  .select-down {

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

    .center {
      display: flex;
      align-items: center;
    }

    .all-select {
      width: 100%;
      height: 2.3rem;
      background: #f5f7fa;
      padding: 0 0.8rem;
      font-size: 0.8rem;
      font-weight: 400;
      color: #3399ff;
    }

    .select-list {
      width: 100%;
      height: calc(100vh - 9.6rem);
      overflow-y: auto;

      .radio-item {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.8rem;
      }

      .list-item {
        width: 100%;
        height: 2.85rem;
        background: #ffffff;
        padding-left: 0.8rem;

        .item-center {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 2.85rem;
          border-bottom: 0.05rem solid #F0F2F5;

          .item-left {
            display: flex;
            align-items: center;

            .title {
              width: 9rem;
              height: 1.2rem;
              font-size: 0.8rem;
              font-weight: 600;
              text-align: left;
              color: #333333;
              line-height: 1.2rem ;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .arrow_x {
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.8rem;
          }
        }
      }

      .children-list {
        width: 100%;
        background: #fafafa;
        padding-left: 0.8rem;
      }

      .children-item {
        width: 100%;
        height: 3.25rem;
        background: #fafafa;
        display: flex;
        align-items: center;
        border-bottom: 0.05rem solid #f0f2f5;

        .photo {
          width: 2rem;
          height: 2rem;
          margin: 0 0.5rem 0 0;
        }

        .info {
          display: flex;
          width: 7rem;
          height: 2.3rem;

          .title {
            height: 1.2rem;
            font-size: 0.8rem;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 1.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .phone {
            height: 1.1rem;
            font-size: 0.7rem;
            font-weight: 400;
            text-align: left;
            color: #999999;
            line-height: 1.1rem;
          }
        }

        .column {
          flex-direction: column;
        }

        .student {
          align-items: center !important;
        }
      }

      .no-item {
        background: #ffffff;
      }

      .no_group {
        width: 100%;
        height: 2rem;
        background: #f5f7fa;
        padding: 0 0.8rem;
        font-size: 0.7rem;
        font-weight: 400;
        color: #666666;
      }
    }

    .leave {
      height: 100% !important;
    }

    .suspend-button {
      position: fixed;
      width: 100%;
      height: 4.9rem;
      left: 0;
      bottom: 0;
      background: #ffffff;
      padding: 0.4rem 0.8rem 0;

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 2.4rem;
        background: #3399ff;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
</style>
