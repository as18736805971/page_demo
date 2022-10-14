<template>
  <div class="information">
    <div class="tab-list">
      <div class="item-tab" v-for="(item ,index) in tab_list" :key="index" @click="handleTab(index)">
        <div class="item" :class="index === activeIndex ? 'active' : ''">{{ item }}</div>
        <div class="line" v-if="activeIndex === index"></div>
      </div>
    </div>

    <div class="list-content">
      <template v-if="activeIndex === 1">
        <Parents :type="1" :list="parent_list" @onSubmit="handleSubmit" @handleDel="handleParentsDel"></Parents>
      </template>
      <template v-else-if="activeIndex === 2">
        <Parents :type="2" :list="phone_list" @onSubmit="handleSubmit" @handleDel="handleParentsDel"></Parents>
      </template>
      <template v-else>
        <div class="info-item">
          <div class="info">
            <div class="photo">
              <img class="photo-icon" :src="stu_info.stu_avatar || stu_info.user_photo_path || require('../../../assets/qqdh_photo.png')" :onerror="onerror">
              <label for="file">
                <img class="edit-icon" src="../../../assets/edit1.png">
              </label>
              <input id="file" style="display: none" type="file" ref="select_file" accept="image/png, image/jpeg, image/jpg" class="select-file" @change.stop="handlePortrait" />
            </div>
            <div class="nickname-txt">
              {{ stu_info.stu_name || '' }}
              <img v-if="stu_info.stu_sex == 1" class="male-icon" src="../../../assets/male.png">
              <img v-else-if="stu_info.stu_sex == 2" class="male-icon" src="../../../assets/female.png">
            </div>
          </div>
          <div class="list-item">
            <div class="item-title">年级</div>
            <div class="item-content">{{ stu_info.gra_show_name }}</div>
          </div>
          <div class="list-item">
            <div class="item-title">班级</div>
            <div class="item-content">{{ stu_info.cls_show_name }}</div>
          </div>
          <div class="list-item">
            <div class="item-title">卡号</div>
            <div class="item-content">{{ stu_info.stu_no }}</div>
          </div>
          <div class="list-item">
            <div class="item-title">在校状态</div>
            <div class="item-content" @click="handleSchool()">{{ stu_info.stay_name }}
              <img class="arrow-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="card-list" v-if="card_list.length > 0">
            <div class="card-item" v-for="(item, index) in card_list" :key="index">
              <div class="card-top space-between">
                <div class="top-left-txt">卡{{ index + 1 }}</div>
                <div class="top-right-txt open">{{ item.card_status_flag == 0 ? '' : item.status_name }}</div>
              </div>
              <div class="card-bottom">
                <div class="card-margin space-between">
                  <div class="bottom-left-txt">卡名称</div>
                  <div class="bottom-right-txt">{{ item.card_name }}</div>
                </div>
                <div class="card-margin space-between">
                  <div class="bottom-left-txt">卡类型</div>
                  <div class="bottom-right-txt">{{ item.card_type_name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!--<div class="suspend-button">
      <div class="button" @click="handleStudentDel()">
        <img class="del-icon" src="../../../assets/del.png">删除学生
      </div>
    </div>-->

    <mt-actionsheet
        :actions="school"
        v-model="schoolShow">
    </mt-actionsheet>
  </div>
</template>

<script>
  import { httpFormPostMethod, httpUploadFile } from '@/common/HttpService'
  import Parents from "./components/parents"
  import { Tool, compressImg } from '@/common/Tool'

  export default {
    name: "class_information",
    components: { Parents },
    data() {
      return {
        stu_id: this.$route.query.stu_id || '',
        activeIndex: 0, // tab栏索引
        tab_list: ['学生信息', '家长信息', '电话簿'],
        stu_info: {
          stu_id: '',
          stu_avatar: '',
          stu_name: '',
          stu_sex: 0,
          stu_no: '',
          cls_show_name: '',
          gra_show_name: '',
          stay_name: ''
        }, // 学生信息
        parent_list: [], // 家长信息
        phone_list: [], // 电话簿
        card_list: [], // 卡信息
        school: [{
          name: '未知',
          type: 0,
          method: this.handleSetSchool
        }, {
          name: '住校',
          type: 1,
          method: this.handleSetSchool
        }, {
          name: '走读',
          type: 2,
          method: this.handleSetSchool
        }],
        schoolShow: false,
        onerror: 'this.src="' + require('../../../assets/qqdh_photo.png') + '"',
        area: sessionStorage.getItem('area')
      }
    },
    created() {
      this.handleGetInfo()
    },
    methods: {
      handleGetInfo() {
        httpFormPostMethod('web/cls/stu/detail', {
          stu_id: this.stu_id
        }).then((res) => {
          let data = res.data
          this.stu_info = {...this.stu_info, ...data.stu}
          this.parent_list = data.fam
          this.phone_list = data.pb
          this.card_list = data.card
        })
      },
      // tab栏切换
      handleTab(index) {
        this.activeIndex = index
      },
      handleSchool() {
        this.schoolShow = true
      },
      handleSetSchool(data) {
        httpFormPostMethod('web/cls/edit/stayflag', {
          stu_id: this.stu_info.stu_id,
          stay_flag: data.type,
        }).then((res) => {
          if (res.status == 200) {
            this.stu_info.stay_name = data.name
          }
        })
      },
      // 删除家长信息及电话簿
      handleParentsDel(data) {
        let that = this
        let message = data.type == 1 ? '确认要删除当前家长信息?' : '确认要删除当前电话簿?'
        Tool.alert(message, '温馨提示', true, () => {
          if (data.type == 1) {
            httpFormPostMethod('WebApi/TeaMyClass/famDel', {
              fam_id: data.id
            }).then((res) => {
              if (res.status == 200) {
                Tool.tip('删除成功')
                that.parent_list.splice(data.index, 1)
              }
            })
          } else {
            httpFormPostMethod('WebApi/TeaMyClass/spbDel', {
              spb_id: data.id
            }).then((res) => {
              if (res.status == 200) {
                Tool.tip('删除成功')
                that.phone_list.splice(data.index, 1)
              }
            })
          }
        })
      },
      // 删除学生
      handleStudentDel() {
        Tool.alert('确定要删除当前学生?', '温馨提示', true, () => {
          httpFormPostMethod('WebApi/TeaMyClass/delStu', {
            stu_id: this.stu_info.stu_id
          }).then((res) => {
            if (res.status == 200) {
              Tool.tip('删除成功')
              this.$router.go(-1)
            }
          })
        })
      },
      // 添加家长及电话簿
      handleSubmit(data) {
        this.$router.push({
          path: 'add_parent',
          query: {
            type: data.type,
            stu_id: this.stu_info.stu_id,
          }
        })
      },
      // 选择头像
      async handlePortrait() {
        if (this.$refs.select_file.files[0].type !== 'image/jpeg') {
          Tool.tip('请上传.jpg格式图片')
          return false
        }
        if (this.$refs.select_file.files[0]) {
          Tool.loading('上传中...')
          let select_file = await compressImg(this.$refs.select_file.files[0], {
            width: 800,
            quality: 0.75
          })
          httpUploadFile('web/stu/upload', {
            stu_id: this.stu_info.stu_id,
            stu_pic: select_file
          }).then((res) => {
            if (res.status == 200) {
              if (this.area === 'ha') {
                this.stu_info.stu_avatar = res.data.stu_pic
                this.stu_info.user_photo_path = res.data.stu_pic
                Tool.close()
              } else {
                this.handleGetInfo()
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .information {
    .space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tab-list {
      width: 100%;
      height: 2.4rem;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 2.3rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #999999;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.2rem;
        }

        .line {
          width: 2.4rem;
          height: 0.1rem;
          background: #3297ff;
          border-radius: 0.05rem;
        }
      }

      .active {
        font-size: 0.8rem;
        font-weight: 600;
        color: #3399ff;
      }
    }

    .list-content {
      width: 100%;
      //height: calc(100vh - 7.3rem);
      height: calc(100vh - 2.4rem);
      overflow-y: auto;

      .info-item {
        .info {
          width: 100%;
          height: 5rem;
          background: #3399ff;
          padding: 0 1rem;
          display: flex;
          align-items: center;

          .photo {
            position: relative;
            width: 3rem;
            height: 3rem;

            .photo-icon {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
            }

            .edit-icon {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 1rem;
              height: 1rem;
            }
          }

          .nickname-txt {
            display: flex;
            align-items: center;
            margin-left: 0.7rem;
            height: 1.4rem;
            font-size: 1rem;
            font-weight: 500;
            color: #ffffff;

            .male-icon {
              margin-left: 0.2rem;
              width: 1rem;
              height: 1rem;
            }
          }
        }

        .list-item {
          width: 100%;
          height: 2.8rem;
          background: #ffffff;
          margin-bottom: 0.05rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.8rem;

          .item-title {
            height: 1.1rem;
            font-size: 0.8rem;
            font-weight: 400;
            color: #666666;
          }

          .item-content {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 1.1rem;
            font-size: 0.8rem;
            font-weight: 400;
            color: #333333;

            .arrow-icon {
              width: 1.2rem;
              height: 1.2rem;
            }
          }
        }

        .card-list {
          width: 100%;
          padding: 0.6rem;
          background: #ffffff;

          .card-item {
            margin-bottom: 0.6rem;

            .card-top {
              width: 100%;
              height: 2.3rem;
              background: #ffede5;
              border-radius: 0.4rem 0.4rem 0 0;
              padding: 0 0.8rem;
              font-size: 0.8rem;
              font-weight: 500;
              color: #333333;

              .top-right-txt {
                font-size: 0.7rem;
                font-weight: 400;
                color: #999999;
              }

              .open {
                color: #ED6B34 !important;
              }
            }

            .card-bottom {
              width: 100%;
              background: #ed6b34;
              border-radius: 0 0 0.4rem 0.4rem;
              padding: 0.5rem 0.8rem;
              font-size: 0.8rem;
              font-weight: 400;
              color: rgba(255,255,255,0.60);

              .card-margin {
                margin-bottom: 0.6rem;
              }

              .card-margin:last-child {
                margin-bottom: 0;
              }

              .bottom-right-txt {
                font-size: 0.8rem;
                font-weight: 400;
                color: #ffffff;
              }
            }
          }

          .card-item:last-child {
            margin-bottom: 0;
          }
        }
      }
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
        border: 0.05rem solid #ebebeb;
        width: 100%;
        height: 2.4rem;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #5E6166;

        .del-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.4rem;
        }
      }
    }
  }
</style>
