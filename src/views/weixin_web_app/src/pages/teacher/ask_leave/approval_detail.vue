<template>
  <div class="details">
    <template v-if="show_page">
      <div class="content" :class="oper_flag != 0 ? 'content-type' : ''">
        <div class="content-top">
          <div class="top-title">
            <div class="title-item space-between">
              <div class="left">
                <div class="title">{{ info.cls_show_name ? '(' + info.cls_show_name + ')' : '' }}{{ info.stu_name }}的请假</div>
                <div class="type">{{ info.leave_type == '0' ? '事假' : info.leave_type == '1' ? '病假' : '其他' }}</div>
              </div>
              <div class="right" :class="info.leave_status == '2' ? 'through1' : info.leave_status == '1' ? 'audit' : info.leave_status == '3' ? '' : 'cancel'">
                {{ info.leave_status == '2' ? '审核通过' : info.leave_status == '1' ? '待审核' : info.leave_status == '3' ? '审核未通过' : '已取消' }}
              </div>
            </div>
            <div class="date-txt">{{ info.create_time | formatDate }}</div>
          </div>
          <div class="top-list">
            <div class="top-item">
              <div class="left-txt">开始时间：</div>
              <div class="desc-txt">{{ info.begin_time | formatDate }}</div>
            </div>
            <div class="top-item">
              <div class="left-txt">结束时间：</div>
              <div class="desc-txt">{{ info.end_time | formatDate }}</div>
            </div>
            <div class="top-item">
              <div class="left-txt">离校时间：</div>
              <div class="desc-txt">{{ info.leave_time | formatDate }}</div>
            </div>
            <div class="top-item">
              <div class="left-txt">返校时间：</div>
              <div class="desc-txt">{{ info.back_time | formatDate }}</div>
            </div>
            <div class="top-item">
              <div class="left-txt">请假事由：</div>
              <div class="desc-txt">{{ info.leave_reason }}</div>
            </div>
          </div>
        </div>

        <div class="progress">审批进度</div>

        <div class="content-list" v-if="relation.length > 0">
          <div v-for="(item, index) in relation" :key="index">
            <div class="list-item">
              <div class="left-item">
                <template v-if="item.audit_status == 1">
                  <img class="agree"  src="../../../assets/agree.png">
                </template>
                <template v-if="item.audit_status == 3">
                  <img class="agree"  src="../../../assets/reject.png">
                </template>
                <div class="photo">{{ item.audit_user_name.length > 2 ? item.audit_user_name.slice(-2) : item.audit_user_name }}</div>
              </div>
              <div class="right-item">
                <div class="top-item">
                  <div class="nickname">
                    <div class="name">{{ item.audit_user_name }}</div>
                    <div class="block" :class="item.audit_status == 1 ? 'refused' : item.audit_status == 2 ? '' : 'approval'">
                      {{ item.audit_status == 1 ? '待审批' : item.audit_status == 2 ? '已同意' : '已拒绝' }}
                    </div>
                  </div>
                  <div class="date-txt">{{ item.audit_time | formatDate }}</div>
                </div>
                <div class="desc-item">{{ item.audit_remark || '' }}</div>
              </div>
            </div>
            <div class="down-item" v-if="(index + 1) !== relation.length">
              <img class="bot" src="../../../assets/bot.png">
            </div>
          </div>
        </div>
      </div>

      <div class="suspend-button" v-if="oper_flag != 2">
        <template v-if="oper_flag == 0">
          <div class="button" @click="onSubmit(1)">
            <img class="undo" src="../../../assets/undo.png">撤销
          </div>
        </template>
        <template v-if="oper_flag == 1">
          <div class="agree" @click="onSubmit(2)">拒绝</div>
          <div class="agree down" @click="onSubmit(3)">同意</div>
        </template>
        <template v-if="oper_flag == 3">
          <div class="through" @click="onSubmit(4)">设置返校时间</div>
        </template>
      </div>
    </template>

    <!-- 选择日期时间组件 -->
    <mt-datetime-picker
        class="pickerstart"
        ref="picker1"
        :startDate="new Date()"
        type="datetime"
        v-model="pickerStart"
        @confirm="handleConfirm"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
  import { Tool } from '@/common/Tool'
  import { httpFormPostMethod } from '@/common/HttpService'
  import { mapMutations } from "vuex";

  export default {
    name: "approval_detail",
    data() {
      return {
        leave_id: this.$route.query.leave_id || '',
        pickerStart: new Date(),
        back_time: '',
        show_page: false,
        info: {},
        oper_flag: 2, // 0-撤销，1-审批 2-不可操作 3-返校时间
        relation: [],
      }
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'ask_leave',
        sign: false,
      });
      this.handleGetDetail()
    },
    filters: {
      formatDate(value) {
        if (value) {
          let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
          return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
        }
      }
    },
    methods: {
      ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
      // 详情
      handleGetDetail() {
        httpFormPostMethod('app/leave/detail', {
          leave_id: this.leave_id
        }).then((res) => {
          this.info = {...this.info, ...res.data.leave_info }
          this.relation = res.data.check_info_list
          this.oper_flag = res.data.oper_flag
          this.show_page = true
        })
      },
      // 设置返校时间
      handleConfirm() {
        this.begin_time = Tool.formate(this.pickerStart, "yyyy-MM-dd hh:mm")
        if (this.begin_time + ':00' < this.$options.filters.formatDate(this.info.end_time)) {
          Tool.tip('返校时间不能小于结束时间')
          return false
        }

        httpFormPostMethod('web/stu/leave/back/time', {
          leave_id: this.leave_id,
          back_time: Tool.handleFormatStr(this.begin_time)
        }).then(() => {
          Tool.tip('设置成功', 2000, () => {
            this.$router.replace('ask_leave')
          })
        })
      },
      // 审批操作
      onSubmit(type) {
        if (type === 1) {
          Tool.alert('您确定要撤销该条请假信息吗？撤销后不可恢复', '撤销提示', true, () => {
            httpFormPostMethod('web/stu/leave/cancel', {
              leave_id: this.leave_id,
            }).then((res) => {
              Tool.tip('撤销成功', 2000, () => {
                this.$router.replace('ask_leave')
              })
            })
          })
        } else if (type === 4) {
          this.$refs.picker1.open()
        } else {
          this.$router.push({
            path: 'note',
            query: {
              type: type,
              stu_name: this.info.stu_name,
              cls_name: this.info.cls_name,
              leave_id: this.leave_id,
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .details {
    .space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .content {
      width: 100%;
      height: 100%;

      .content-top {
        width: 100%;
        background: #ffffff;
        padding: 0.6rem;

        .top-title {
          border-bottom: 0.05rem solid #f0f2f5;

          .title-item {
            width: 100%;
            height: 1.4rem;
            margin-bottom: 0.2rem;

            .left {
              display: flex;
              align-items: center;

              .title {
                max-width: 10rem;
                margin-right: 0.4rem;
                font-size: 0.9rem;
                font-weight: 500;
                color: #2c2e33;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .type {
                border: 0.05rem solid #3399ff;
                border-radius: 0.1rem;
                padding: 0 0.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.55rem;
                font-weight: 400;
                color: #3399ff;
              }
            }

            .right {
              width: 3.5rem;
              font-size: 0.7rem;
              font-weight: 400;
              color: #f0644d;
              text-align: right;
            }
          }

          .date-txt {
            height: 0.9rem;
            font-size: 0.6rem;
            font-weight: 400;
            text-align: left;
            color: #c4c7cc;
            margin-bottom: 0.6rem;
          }
        }

        .top-list {
          width: 100%;
          padding: 0.6rem 0;

          .top-item {
            display: flex;
            align-items: flex-start;
            min-height: 1.3rem;
            font-size: 0.7rem;
            font-weight: 400;

            .left-txt {
              width: 4rem;
              color: #909399;
            }

            .desc-txt {
              width: 13.5rem;
              color: #2c2e33;
            }
          }
        }

      }

      .progress {
        width: 100%;
        height: 1.9rem;
        display: flex;
        align-items: center;
        padding: 0 0.6rem;
        font-size: 0.7rem;
        font-weight: 400;
        color: #909399;
      }

      .content-list {
        width: 100%;
        background: #ffffff;
        padding: 0.8rem 0.6rem;
        margin-bottom: 0.6rem;

        .list-item {
          display: flex;

          .left-item {
            position: relative;
            width: 2.4rem;
            height: 2.4rem;
            background: #f2f6ff;
            border: 0.05rem solid #e1e4eb;
            border-radius: 50%;

            .agree {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0.7rem;
              height: 0.7rem;
            }

            .photo {
              width: 2.35rem;
              height: 2.35rem;
              border-radius: 50%;
              background: #219bff;
              color: #ffffff;
              font-size: 0.7rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .right-item {
            width: 14.7rem;
            min-height: 2.4rem;
            margin-left: 0.5rem;

            .top-item {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-bottom: 0.2rem;

              .nickname {
                width: 8.5rem;
                height: 1.2rem;
                display: flex;
                align-items: center;

                .name {
                  max-width: 6rem;
                  height: 1.2rem;
                  font-size: 0.8rem;
                  font-weight: 400;
                  text-align: left;
                  color: #2c2e33;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .block {
                  margin-left: 0.4rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 2.2rem;
                  height: 1rem;
                  background: #66c46d;
                  border-radius: 0.1rem;
                  font-size: 0.55rem;
                  font-weight: 400;
                  color: #ffffff;
                }

                .approval {
                  background: #F98700;
                }

                .refused {
                  background: #F0644D;
                }
              }

              .date-txt {
                width: 6.5rem;
                height: 0.9rem;
                font-size: 0.6rem;
                font-weight: 400;
                text-align: right;
                color: #c4c7cc;
              }
            }

            .desc-item {
              width: 14.6rem;
              font-size: 0.7rem;
              font-weight: 400;
              text-align: left;
              color: #909399;
              line-height: 0.9rem;
            }
          }
        }

        .down-item {
          width: 100%;
          height: 1.65rem;
          background: #ffffff;
          display: flex;
          align-items: center;
          padding-left: 0.9rem;

          .bot {
            width: 0.6rem;
            height: 0.6rem;
          }
        }
      }
    }

    .content-type {
      height: calc(100vh - 4.9rem);
      overflow-y: auto;
    }

    .suspend-button {
      position: fixed;
      width: 100%;
      height: 4.9rem;
      left: 0;
      bottom: 0;
      background: #ffffff;
      padding: 0.4rem 0.8rem 0;
      display: flex;
      justify-content: center;

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 2.4rem;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #5e6166;
        border: 0.05rem solid #ebebeb;

        .undo {
          width: 1.1rem;
          height: 1.2rem;
          margin-right: 0.36rem;
        }
      }

      .agree {
        width: 50%;
        height: 2.4rem;
        background: #f0644d;
        border-radius: 0.2rem 0 0 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 400;
        color: #ffffff;
      }

      .down {
        background: #66c46d;
        border-radius: 0 0.2rem 0.2rem 0;
      }

      .through {
        width: 100%;
        height: 2.4rem;
        background: #3399ff;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .through1 {
      color: #66C46D !important;
    }

    .audit {
      color: #F98700 !important;
    }

    .cancel {
      color: #909399 !important;
    }
  }
</style>
