<template>
  <div class="select-down">
    <div v-if="area === 'ha'" class="search-item">
      <input class="input" v-model="search_name" placeholder="搜索姓名" type="text" @keyup.enter="handleChange" />
      <img class="icon-search" src="../assets/search1.png">
    </div>

    <div class="all-select center" v-if="type == 1">
      <div @click="handleAll()">{{ all ? '以全选' : '全选' }}</div>
    </div>

    <template v-if="show_list">
      <template v-if="area === 'ha'">
        <template v-if="search_type === 1">
          <div class="select-list student-list" v-if="manager_flag == 0">
            <div class="children-list">
              <div class="children-item" v-for="(item, index) in student" :key="index">
                <img class="radio-item" @click.stop="type == 1 ? handleRadio1(item, index) : type == 2 ? handleRadio1(item, index) : ''" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                <img class="photo" src="../assets/qqdh_photo.png">
                <div class="info student">
                  <div class="title">{{ item.stu_name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="select-list" :class="type == 2 ? 'leave' : ''" v-else>
            <div v-for="(item, index) in student_list" :key="index">
              <div class="list-item">
                <div class="item-center" @click="handleOneList(index)">
                  <div class="item-left">
                    <img class="radio-item" v-if="type == 1" @click.stop="handleOneSelect(index)" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                    <div class="title">{{ item.gra_show_name }}</div>
                  </div>
                  <img class="arrow_x" v-if="item.children.length > 0" :src="item.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
                </div>
              </div>

              <template v-if="item.showChild">
                <div v-for="(vv, kk) in item.children" :key="kk">
                  <div class="list-item">
                    <div class="item-center" @click="handleTwoList(index, kk, vv)">
                      <div class="item-left">
                        <img class="radio-item" v-if="type == 1" @click.stop="handleTwoSelect(index, kk, true)" :src="vv.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                        <div class="title class-number">{{ vv.cls_show_name }}</div>
                      </div>
                      <img class="arrow_x" :src="vv.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
                    </div>
                  </div>

                  <template v-if="vv.showChild">
                    <div class="children-list">
                      <div class="children-item" v-for="(vvv, kkk) in vv.children" :key="kkk">
                        <img class="radio-item" @click.stop="type == 1 ? handleThreeSelect(index, kk, kkk) : type == 2 ? handleRadio(item, vv, vvv, index, kk, kkk) : ''" :src="vvv.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                        <img class="photo" :src="vvv.stu_pic || require('../assets/qqdh_photo.png')">
                        <div class="info student">
                          <div class="title">{{ vvv.stu_name }}</div>
                        </div>
                      </div>
                    </div>
                  </template>

                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="select-list student-list">
            <div class="children-list">
              <div class="children-item" v-for="(item, index) in student" :key="index">
                <img class="radio-item" @click.stop="type == 1 ? handleRadio1(item, index) : type == 2 ? handleRadio1(item, index) : ''" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                <img class="photo" src="../assets/qqdh_photo.png">
                <div class="info student">
                  <div class="title">{{ item.stu_name }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="select-list student-list" v-if="manager_flag > 3">
          <div class="children-list">
            <div class="children-item" v-for="(item, index) in student" :key="index">
              <img class="radio-item" @click.stop="type == 1 ? handleRadio1(item, index) : type == 2 ? handleRadio1(item, index) : ''" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
              <img class="photo" :src="item.stu_pic || require('@/assets/qqdh_photo.png')">
              <div class="info student">
                <div class="title">{{ item.stu_name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="select-list" :class="type == 2 ? 'leave' : ''" v-else>
          <div v-for="(item, index) in student_list" :key="index">
            <div class="list-item">
              <div class="item-center" @click="handleOneList(index)">
                <div class="item-left">
                  <img class="radio-item" v-if="type == 1" @click.stop="handleOneSelect(index)" :src="item.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                  <div class="title">{{ item.gra_show_name }}</div>
                </div>
                <img class="arrow_x" v-if="item.children.length > 0" :src="item.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
              </div>
            </div>

            <template v-if="item.showChild">
              <div v-for="(vv, kk) in item.children" :key="kk">
                <div class="list-item">
                  <div class="item-center" @click="handleTwoList(index, kk, vv)">
                    <div class="item-left">
                      <img class="radio-item" v-if="type == 1" @click.stop="handleTwoSelect(index, kk, true)" :src="vv.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                      <div class="title class-number">{{ vv.cls_show_name }}</div>
                    </div>
                    <img class="arrow_x" :src="vv.showChild ? require('../assets/arrow_up.png') : require('../assets/arrow_x.png')">
                  </div>
                </div>

                <template v-if="vv.showChild">
                  <div class="children-list">
                    <div class="children-item" v-for="(vvv, kkk) in vv.children" :key="kkk">
                      <img class="radio-item" @click.stop="type == 1 ? handleThreeSelect(index, kk, kkk) : type == 2 ? handleRadio(item, vv, vvv, index, kk, kkk) : ''" :src="vvv.status ? require('../assets/radio_active.png') : require('../assets/radio_no.png')">
                      <img class="photo" :src="vvv.stu_pic || require('../assets/qqdh_photo.png')">
                      <div class="info student">
                        <div class="title">{{ vvv.stu_name }}</div>
                      </div>
                    </div>
                  </div>
                </template>

              </div>
            </template>
          </div>
        </div>
      </template>
    </template>

    <div class="suspend-button" v-if="type == 1">
      <div class="button" @click="onSubmit()">确定</div>
    </div>
  </div>
</template>

<script>
  import { httpFormPostMethod } from '@/common/HttpService'
  import { mapMutations } from "vuex";

  export default {
    name: "select_student",
    data() {
      return {
        search_name: '',
        search_type: 1,
        manager_flag: -1, // 用户类型
        show_list: false,
        all: false, // 全选
        student_list: [], // 年级及班级列表
        student: [], // 直接是学生列表
        type: this.$route.query.type || 1, // 1 校信 2 请假
        area: '',
      }
    },
    created() {
      this.area = sessionStorage.getItem('area')
      this.manager_flag = sessionStorage.getItem('manager_flag')
      if (this.area === 'ha') {
        if (this.manager_flag == 0) {
          this.handleGetStudent()
        } else {
          this.handleGetList()
        }
      } else {
        if (this.manager_flag > 3) {
          this.handleGetStudent()
        } else {
          this.handleGetList()
        }
      }
      this.show_list = true
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'select_student',
        sign: false,
      });
    },
    methods: {
      ...mapMutations(['UPDATE_INCLUDE_PAGE']),
      handleChange() {
        if (this.search_name !== '') {
          this.search_type = 2
          if (this.manager_flag == 0) {
            this.handleSearchStu()
          } else {
            this.handleSearchList()
          }
        } else {
          this.search_type = 1
          if (this.manager_flag == 0) {
            this.handleGetStudent()
          } else {
            this.handleGetList()
          }
        }
      },
      // 搜索年纪学生
      handleSearchList() {
        httpFormPostMethod('web/stu/leave/stu/search', {
          cls_id: '',
          stu_name: this.search_name
        }).then((res) => {
          res.data.map((item) => {
            item.status = false
          })
          this.student = res.data
        })
      },
      // 搜索班主任学生
      handleSearchStu() {
        let info = JSON.parse(sessionStorage.getItem('teacherUser'))
        httpFormPostMethod('web/stu/leave/stu/search', {
          cls_id: info.cls_id,
          stu_name: this.search_name
        }).then((res) => {
          let list = res.data || []
          list.map((item) => {
            item.cls_id = item.cls_id || info.cls_id
            item.status = false
          })
          this.student = list
        })
      },
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
          this.student_list = gra_list
        })
      },
      // 获取当前老师下面的学生
      handleGetStudent() {
        let info = JSON.parse(sessionStorage.getItem('teacherUser'))
        httpFormPostMethod('web/cls/stu/list', {
          cls_id: info.cls_id
        }).then((res) => {
          let list = res.data || []
          list.map((item) => {
            item.cls_id = item.cls_id || info.cls_id
            item.status = false
          })
          this.student = list
        })
      },
      // 全选
      handleAll() {
        this.all = !this.all
        if (this.area === 'ha') {
          if (this.manager_flag == 0) {
            this.student.map((item) => {
              item.status = this.all
            })
          } else {
            this.student_list.map((item) => {
              item.status = this.all
              item.children.map((vv) => {
                vv.status = this.all
                vv.children.map((vvv) => {
                  vvv.status = this.all
                })
              })
            })
          }
        } else {
          if (this.manager_flag > 3) {
            this.student.map((item) => {
              item.status = this.all
            })
          } else {
            this.student_list.map((item) => {
              item.status = this.all
              item.children.map((vv) => {
                vv.status = this.all
                vv.children.map((vvv) => {
                  vvv.status = this.all
                })
              })
            })
          }
        }
      },
      // 选择一级列表 查看二级列表
      handleOneList(index) {
        this.student_list[index].showChild = !this.student_list[index].showChild
      },
      // 选择一级
      handleOneSelect(index) {
        this.student_list[index].status = !this.student_list[index].status
        // 选择一级后所有下级全部处于选择状态
        if (this.student_list[index].children.length > 0) {
          if (this.student_list[index].status) {
            this.student_list[index].children.map((item) => {
              item.status = true
              if (item.children.length > 0) {
                item.children.map((vv) => {
                  vv.status = true
                })
              }
            })
          } else {
            this.student_list[index].children.map((item) => {
              item.status = false
              if (item.children.length > 0) {
                item.children.map((vv) => {
                  vv.status = false
                })
              }
            })
          }
        }
      },
      // 选择二级列表 查看三级列表
      handleTwoList(index, kk, vv) {
        this.student_list[index].children[kk].showChild = !this.student_list[index].children[kk].showChild
        if (this.student_list[index].children[kk].showChild) {
          if (this.student_list[index].children[kk].children.length === 0) {
            httpFormPostMethod('web/cls/stu/list', {
              cls_id: vv.cls_id
            }).then((res) => {
              res.data.map((item) => {
                item.status = vv.status
              })
              this.student_list[index].children[kk].children = res.data
            })
          }
        }
      },
      // 选择二级
      handleTwoSelect(index, kk, type = null) {
        if (type) {
          this.student_list[index].children[kk].status = !this.student_list[index].children[kk].status
        }

        // 监听子集全选中后 父级也处于选中状态
        let has = false
        for (let item of this.student_list[index].children) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          this.student_list[index].status = true
        } else {
          this.student_list[index].status = false
        }

        // 选择二级后所有下级全部处于选择状态
        if (this.student_list[index].children[kk].children.length > 0) {
          if (this.student_list[index].children[kk].status) {
            this.student_list[index].children[kk].children.map((item) => {
              item.status = true
            })
          } else {
            this.student_list[index].children[kk].children.map((item) => {
              item.status = false
            })
          }
        }
      },
      // 选择三级
      handleThreeSelect(index, kk, kkk) {
        this.student_list[index].children[kk].children[kkk].status = !this.student_list[index].children[kk].children[kkk].status

        // 监听子集全选中后 父级也处于选中状态
        let has = false
        for (let item of this.student_list[index].children[kk].children) {
          if (!item.status) {
            has = true
            break
          }
        }
        if (!has) {
          this.student_list[index].children[kk].status = true

          // 上级选中
          this.handleTwoSelect(index, kk, null)
        } else {
          this.student_list[index].children[kk].status = false
        }
      },
      // 单选
      handleRadio(item, vv, data, index, kk, kkk) {
        this.student_list.map((item) => {
          item.status = false
          item.showChild = false
          item.children.map((vv) => {
            vv.status = false
            vv.showChild = false
            vv.children.map((vvv) => {
              vvv.status = false
            })
          })
        })
        this.student_list[index].children[kk].children[kkk].status = !this.student_list[index].children[kk].children[kkk].status
        data['gra_id'] = item.gra_id
        data['cls_id'] = vv.cls_id
        this.$selectPass.$emit('leave_student', data)
        this.$router.go(-1)
      },
      // 其他权限
      handleRadio1(item, index) {
        if (this.type == 1) {
          this.student[index].status = !this.student[index].status
        } else if (this.type == 2) {
          this.student.map((v) => {
            v.status = false
          })
          this.student[index].status = !this.student[index].status
          this.$selectPass.$emit('leave_student', item)
          this.$router.go(-1)
        }
      },
      // 点击确定
      onSubmit() {
        if (this.area === 'ha') {
          if (this.search_type === 1) {
            if (this.manager_flag == 0) {
              let stu_id = []
              this.student.map((item) => {
                if (item.status) {
                  stu_id.push(item.stu_id)
                }
              })
              this.$selectPass.$emit('select_student', {
                gra_id: '',
                cls_id: '',
                stu_id: stu_id.join(','),
              })
            } else {
              let gra_id = [],
                  cls_id = [],
                  stu_id = []
              this.student_list.map((v) => {
                if (v.status) {
                  gra_id.push(v.gra_id)
                }
                v.children.map((vv) => {
                  if (vv.status) {
                    cls_id.push(vv.cls_id)
                  }
                  vv.children.map((vvv) => {
                    if (vvv.status) {
                      stu_id.push(vvv.stu_id)
                    }
                  })
                })
              })
              this.$selectPass.$emit('select_student', {
                gra_id: gra_id.join(','),
                cls_id: cls_id.join(','),
                stu_id: stu_id.join(','),
              })
            }
          } else {
            if (this.manager_flag == 0) {
              let stu_id = []
              this.student.map((item) => {
                if (item.status) {
                  stu_id.push(item.stu_id)
                }
              })
              this.$selectPass.$emit('select_student', {
                gra_id: '',
                cls_id: '',
                stu_id: stu_id.join(','),
              })
            } else {
              let stu_id = []
              this.student.map((item) => {
                if (item.status) {
                  stu_id.push(item.stu_id)
                }
              })
              this.$selectPass.$emit('select_student', {
                gra_id: '',
                cls_id: '',
                stu_id: stu_id.join(','),
              })
            }
          }
        } else {
          if (this.manager_flag > 3) {
            let stu_id = []
            this.student.map((item) => {
              if (item.status) {
                stu_id.push(item.stu_id)
              }
            })
            this.$selectPass.$emit('select_student', {
              gra_id: '',
              cls_id: '',
              stu_id: stu_id.join(','),
            })
          } else {
            let gra_id = [],
                cls_id = [],
                stu_id = []
            this.student_list.map((v) => {
              if (v.status) {
                gra_id.push(v.gra_id)
              }
              v.children.map((vv) => {
                if (vv.status) {
                  cls_id.push(vv.cls_id)
                }
                vv.children.map((vvv) => {
                  if (vvv.status) {
                    stu_id.push(vvv.stu_id)
                  }
                })
              })
            })
            this.$selectPass.$emit('select_student', {
              gra_id: gra_id.join(','),
              cls_id: cls_id.join(','),
              stu_id: stu_id.join(','),
            })
          }
        }

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

    .class-number {
      font-weight: 400 !important;
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
          border-radius: 50%;
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

    .student-list {
      width: 100%;
      height: 100% !important;
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
