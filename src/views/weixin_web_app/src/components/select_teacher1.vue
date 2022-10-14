<template>
  <div class="select-down">
    <div class="all-select center" v-if="type == 1">
      <div @click="handleAll()">{{ all ? '以全选' : '全选' }}</div>
    </div>

    <div class="select-list" :class="type == 2 ? 'leave' : ''">
      <div v-for="(item, index) in teacher_list" :key="index">
        <div class="list-item">
          <div class="item-center" @click="handleOneList(item)">
            <div class="item-left">
              <img class="radio-item" v-if="type == 1" @click.stop="handleOneSelect(item, 1, null)" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
              <div class="title">{{ item.group_name }}</div>
            </div>
            <img class="arrow_x" v-if="item.tea_json.length > 0 || item.child_group.length > 0" :src="item.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
          </div>
        </div>
        <template v-if="item.showChild">
          <!-- 分组列表 -->
          <div v-for="(child, child_index) in item.child_group" :key="child_index">
            <div class="list-item">
              <div class="item-center" @click="handleTwoList(child)">
                <div class="item-left">
                  <img class="radio-item" v-if="type == 1" @click.stop="handleOneSelect(child, 2, item)" :src="child.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                  <div class="title">{{ child.group_name }}</div>
                </div>
                <img class="arrow_x" v-if="child.tea_json.length > 0" :src="child.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
              </div>
            </div>
            <template v-if="child.showChild">
              <!-- 教师列表 -->
              <div class="children-list">
                <div class="children-item"
                     v-for="(cItem, cIndex) in child.tea_json"
                     :key="cIndex"
                     @click="type == 1 ? handleTwoSelect(cItem, item, 2, child) : type == 2 ? handleRadio(cItem) : ''"
                >
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
          <!-- 教师列表 -->
          <div class="children-list">
            <div class="children-item"
                 v-for="(cItem, cIndex) in item.tea_json"
                 :key="cIndex"
                 @click="type == 1 ? handleTwoSelect(cItem, item, 1, null) : type == 2 ? handleRadio(cItem) : ''"
            >
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

      <div class="no_group center">未分组人员</div>

      <div class="children-list no-item">
        <div class="children-item no-item" v-for="(vv, kk) in no_group" :key="kk" @click="type == 1 ? handleNoSelect(vv) : type == 2 ? handleRadio(vv, 0, kk, 2) : ''">
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
      sign: true,
    });
  },
  methods: {
    ...mapMutations(['UPDATE_INCLUDE_PAGE']),
    // 同时请求教师分组及教师列表
    handleGetList() {
      let p1 = httpFormPostMethod('web/contact/tree', {})
      let p2 = httpFormPostMethod('web/contact/ungroup', {})
      Promise.all([p1, p2]).then((data) => {
        var group_list = data[0].data || []
        var no_group = data[1].data || []
        // 按组排序列表
        group_list.map((vv) => {
          vv.showChild = false
          vv.status = false
          vv.tea_json = vv.tea_json ? JSON.parse(vv.tea_json) : []
          vv.tea_json.map((tea) => {
            tea.status = false
          })
          vv.child_group.map((vvv) => {
            vvv.showChild = false
            vvv.status = false
            vvv.tea_json = vvv.tea_json ? JSON.parse(vvv.tea_json) : []
            vvv.tea_json.map((tea) => {
              tea.status = false
            })
          })
        })
        this.teacher_list = group_list
        // 未分组列表
        no_group.map((item) => {
          item.status = false
        })
        this.no_group = no_group
      }).catch((err) => {
        this.teacher_list = []
        this.no_group = []
        console.log(err)
      })
    },
    // 全选
    handleAll() {
      this.all = !this.all
      this.teacher_list.map((item) => {
        item.status = this.all
        item.child_group.map((vv) => {
          vv.status = this.all
          vv.tea_json.map((vv) => {
            vv.status = this.all
          })
        })
        item.tea_json.map((vv) => {
          vv.status = this.all
        })
      })

      this.no_group.map((item) => {
        item.status = this.all
      })
    },
    // 选择一级列表 查看二级列表及教师列表
    handleOneList(data) {
      data.showChild = !data.showChild
    },
    // 全选下级一级教师列表
    handleOneSelect(data, type, parent) {
      data.status = !data.status
      if (data.tea_json.length > 0 || data.child_group.length > 0) {
        data.child_group.map((item) => {
          item.status = data.status
          item.tea_json.map((vv) => {
            vv.status = data.status
          })
        })
        data.tea_json.map((item) => {
          item.status = data.status
        })
      }

      if (type === 2) {
        let has = false
        for (let item of parent.tea_json) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          let hasp = false
          for (let item of parent.child_group) {
            if (!item.status) {
              hasp = true
              break
            }
          }
          if (!hasp) {
            parent.status = true
          } else {
            parent.status = false
          }
        } else {
          parent.status = false
        }
      }
    },
    // 选择二级列表 查看教师列表
    handleTwoList(data) {
      data.showChild = !data.showChild
    },
    // 校信选择教师 type 1教师 2二层教师
    handleTwoSelect(data, parent, type, child) {
      data.status = !data.status

      // 监听子集全选中后 父级也处于选中状态
      if (type === 1) {
        let has = false
        for (let item of parent.tea_json) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          let hasv = false
          for (let item of parent.child_group) {
            if (!item.status) {
              hasv = true
              break
            }
          }
          if (!hasv) {
            parent.status = true
          } else {
            parent.status = false
          }
        } else {
          parent.status = false
        }
      } else {
        let has = false
        for (let item of child.tea_json) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          child.status = true
          let hasv = false
          for (let item of parent.tea_json) {
            if (!item.status) {
              hasv = true
              break
            }
          }
          if (!hasv) {
            let hasp = false
            for (let item of parent.child_group) {
              if (!item.status) {
                hasp = true
                break
              }
            }
            if (!hasp) {
              parent.status = true
            } else {
              parent.status = false
            }
          } else {
            parent.status = false
          }
        } else {
          child.status = false
          parent.status = false
        }
      }
    },
    // 选择未知分组
    handleNoSelect(data) {
      data.status = !data.status
    },
    // 请假单选
    handleRadio(data) {
      // 重置选中状态
      this.teacher_list.map((item) => {
        item.tea_json.map((vv) => {
          vv.status = false
        })
        item.child_group.map((vv) => {
          vv.tea_json.map((vvv) => {
            vvv.status = false
          })
        })
      })
      this.no_group.map((item) => {
        item.status = false
      })

      data.status = !data.status
      this.$selectPass.$emit('leave_teacher', data)
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
        vv.tea_json.map((vvv) => {
          if (vvv.status) {
            ids.push(vvv.tea_id)
          }
        })
        vv.child_group.map((vvv) => {
          vvv.tea_json.map((tea) => {
            if (tea.status) {
              ids.push(tea.tea_id)
            }
          })
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
    height: calc(100vh - 7.2rem);
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
