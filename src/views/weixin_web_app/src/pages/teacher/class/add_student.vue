<template>
  <div class="add-student">
    <div class="title">学生信息</div>

    <div class="form-list">
      <!-- <div class="list-item photo">
        <div class="label-title">
          <div class="required"></div>头像
        </div>
        <div class="label-right">
          <img class="photo-icon" @click="handleSetPortrait()" src="../../../assets/qqdh_photo.png">
          <img class="right-icon" src="../../../assets/arrow_right1.png">
        </div>
      </div> -->
      <div class="list-item">
        <div class="label-title">
          <div class="required">*</div>姓名
        </div>
        <div class="label-right">
          <input class="input-txt" type="text" placeholder="请输入姓名" v-model="form.stu_name" >
        </div>
      </div>
      <div class="list-item">
        <div class="label-title">
          <div class="required">*</div>性别
        </div>
        <div class="label-right" @click="handleSex()">
          <div class="desc-txt" :class="stu_sex === '' ? '' : 'active'">
            {{ stu_sex === '' ? '选择性别' : stu_sex }}
          </div>
          <img class="right-icon" src="../../../assets/arrow_right1.png">
        </div>
      </div>
      <div class="list-item">
        <div class="label-title">
          <div class="required"></div>年级
        </div>
        <div class="label-right">
          <div class="desc-txt active">{{ gra_name }}</div>
        </div>
      </div>
      <div class="list-item">
        <div class="label-title">
          <div class="required"></div>班级
        </div>
        <div class="label-right">
          <div class="desc-txt active">{{ cls_name }}</div>
        </div>
      </div>
      <div class="list-item">
        <div class="label-title">
          <div class="required">*</div>在校状态
        </div>
        <div class="label-right" @click="handleSchool()">
          <div class="desc-txt" :class="stay_flag === '' ? '' : 'active'">
            {{ stay_flag === '' ? '选择在校状态' : stay_flag }}
          </div>
          <img class="right-icon" src="../../../assets/arrow_right1.png">
        </div>
      </div>
    </div>

    <template v-if="add_contact.length > 0">
      <div v-for="(item, index) in add_contact" :key="index">
        <div class="title add">
          <div>第{{ index + 1 }}联系人</div>
          <img class="del-icon" @click="handleDelContact(index)" src="../../../assets/del.png">
        </div>

        <div class="form-list">
          <div class="list-item">
            <div class="label-title">
              <div class="required">*</div>关系
            </div>
            <div class="label-right" @click="handleBetween(index)">
              <div class="desc-txt" :class="item.between_txt === '' ? '' : 'active'">
                {{ item.between_txt === '' ? '选择关系' : item.between_txt }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item">
            <div class="label-title">
              <div class="required">*</div>手机号
            </div>
            <div class="label-right">
              <input class="input-txt" type="number" maxlength="11" placeholder="请输入联系人手机号" v-model="item.phone" >
            </div>
          </div>
          <div class="list-item">
            <div class="label-title">
              <div class="required"></div>家长姓名
            </div>
            <div class="label-right">
              <input class="input-txt" type="text" placeholder="请输入联系人姓名" v-model="item.parents_name" >
            </div>
          </div>
          <div class="list-item">
            <div class="label-title">
              <div class="required"></div>验证码
            </div>
            <div class="label-right">
              <input class="input-txt" type="number" placeholder="请输入验证码" v-model="item.code" >
            </div>
          </div>
          <div class="list-item">
            <div class="label-title">
              <div class="required"></div>是否存为电话簿
            </div>
            <div class="label-right">
              <mt-switch v-model="item.phone_book"></mt-switch>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="add-contact">
      <div class="add-btn" @click="handleAddContact()">
        <img class="add-icon" src="../../../assets/jia.png">
        <div class="add-txt">添加联系人</div>
      </div>
    </div>

    <div class="suspend-button">
      <div class="button" @click="onSubmit()">保存</div>
    </div>

    <mt-actionsheet
      :actions="sex"
      v-model="sexShow">
    </mt-actionsheet>

    <mt-actionsheet
      :actions="school"
      v-model="schoolShow">
    </mt-actionsheet>

    <mt-actionsheet
      :actions="between"
      v-model="betweenShow">
    </mt-actionsheet>
  </div>
</template>

<script>
  import { httpFormPostMethod } from "@/common/HttpService"
  import { Tool } from '@/common/Tool'

  export default {
    name: "add_student",
    data() {
      return {
        index: -1, // 索引
        gra_name: this.$route.query.gra_name || '', // 年级
        cls_name: this.$route.query.cls_name || '', // 班级
        form: {
          gra_id: this.$route.query.gra_id || '', // 年级id
          cls_id: this.$route.query.cls_id || '', // 班级id
          stu_name: '', // 学生姓名
          stu_sex: '', // 学生性别 0-未知 1-男 2-女
          stay_flag: '', // 在校状态 0-未知 1-住校 2-走读
          fam_phone: '', // 家长手机号，多个的话逗号分隔
          fam_name: '', // 家长姓名，多个的话逗号分隔
          fam_relation: '', // 学生与家长关系，多个的话逗号分隔：爸爸、妈妈、爷爷、奶奶、哥哥、姐姐、弟弟、妹妹、叔叔、阿姨
          invite_code: '', // 验证码，多个的话逗号分隔
          syn_spb: '', // 同步电话薄，多个的话逗号分隔，1-同步 0-不同步
        },
        sex: [{
          name: '未知',
          type: 0,
          method: this.handleSetSex
        }, {
          name: '男',
          type: 1,
          method: this.handleSetSex
        }, {
          name: '女',
          type: 2,
          method: this.handleSetSex
        }], // 性别
        sexShow: false,
        stu_sex: '',
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
        stay_flag: '',
        schoolShow: false,
        between: [{
          name: '爸爸',
          method: this.handleSetBetween
        }, {
          name: '妈妈',
          method: this.handleSetBetween
        }, {
          name: '爷爷',
          method: this.handleSetBetween
        }, {
          name: '奶奶',
          method: this.handleSetBetween
        }, {
          name: '哥哥',
          method: this.handleSetBetween
        }, {
          name: '姐姐',
          method: this.handleSetBetween
        }, {
          name: '弟弟',
          method: this.handleSetBetween
        }, {
          name: '妹妹',
          method: this.handleSetBetween
        }, {
          name: '叔叔',
          method: this.handleSetBetween
        }, {
          name: '阿姨',
          method: this.handleSetBetween
        }], // 关系
        betweenShow: false,
        add_contact: [], // 新增联系人
      }
    },
    methods: {
      handleSex() {
        this.sexShow = true
      },
      handleSetSex(data) {
        this.stu_sex = data.name
        this.form.stu_sex = data.type
      },
      handleSchool() {
        this.schoolShow = true
      },
      handleSetSchool(data) {
        this.stay_flag = data.name
        this.form.stay_flag = data.type
      },
      handleBetween(index) {
        this.index = index
        this.betweenShow = true
      },
      handleSetBetween(data) {
        this.add_contact[this.index].between_txt = data.name
        this.index = -1
      },
      // 添加联系人
      handleAddContact() {
        this.add_contact.push({
          between_txt: '', // 关系
          phone: '', // 手机号
          parents_name: '', // 家长姓名
          code: '', // 验证码
          phone_book: true, // 是否存为电话簿
        })
      },
      // 删除联系人
      handleDelContact(index) {
        this.add_contact.splice(index, 1)
      },
      onSubmit() {
        if (this.form.stu_name === '') {
          Tool.tip('请输入学生姓名')
          return false
        }
        if (this.form.stu_sex === '') {
          Tool.tip('请选择学生性别')
          return false
        }
        if (this.form.stay_flag === '') {
          Tool.tip('请选择在校状态')
          return false
        }

        if (this.add_contact.length > 0) {
          let fam_phone = [],
              fam_name = [],
              fam_relation = [],
              invite_code = [],
              syn_spb = []
          for (let item of this.add_contact) {
            if (item.between_txt === '') {
              Tool.tip('请选择联系人关系')
              return false
            }
            if (item.phone === '') {
              Tool.tip('请输入联系人手机号')
              return false
            } else {
              let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
              if (!reg_tel.test(item.phone)) {
                Tool.tip('请输入正确的手机号')
                return false
              }
            }
            if (item.code !== '') {
              let reg_tel = /^[0-9]{6}$/;
              if (!reg_tel.test(item.code)) {
                Tool.tip('验证码为6位数字格式')
                return false
              }
            }
            fam_phone.push(item.phone)
            fam_name.push(item.parents_name)
            fam_relation.push(item.between_txt)
            invite_code.push(item.code)
            syn_spb.push(item.phone_book ? 1 : 0)
          }

          this.form.fam_phone = fam_phone.join(',')
          this.form.fam_name = fam_name.join(',')
          this.form.fam_relation = fam_relation.join(',')
          this.form.invite_code = invite_code.join(',')
          this.form.syn_spb = syn_spb.join(',')
        } else {
          this.form.fam_phone = ''
          this.form.fam_name = ''
          this.form.fam_relation = ''
          this.form.invite_code = ''
          this.form.syn_spb = ''
        }

        httpFormPostMethod('web/cls/stu/save', this.form).then((res) => {
          if (res.status == 200) {
            Tool.tip('添加学生成功', 2000,() => {
              this.$router.go(-1)
            })
          } else {
            Tool.tip(res.message || '添加失败', 2000, () => {
              this.$router.go(-1)
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .add-student {
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 4rem;

    .title {
      width: 100%;
      height: 2rem;
      padding: 0 0.8rem;
      display: flex;
      align-items: center;
      background: #F5F7FA;
      font-size: 0.7rem;
      font-weight: 400;
      color: #999999;

      .del-icon {
        width: 1rem;
        height: 1rem;
      }
    }

    .add {
      justify-content: space-between;
      color: #3399FF !important;
    }

    .form-list {
      width: 100%;

      .photo {
        height: 2.8rem !important;
      }

      .list-item {
        width: 100%;
        height: 2.4rem;
        background: #ffffff;
        padding: 0 0.8rem 0 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.05rem solid #F0F2F5;

        .label-title {
          width: 6rem;
          height: 2.4rem;
          display: flex;
          align-items: center;

          .required {
            margin-top: 0.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 0.4rem;
            height: 0.5rem;
            color: #F0644D;
            margin-right: 0.12rem;
          }
        }

        .label-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 8rem;
          height: 2.4rem;

          .photo-icon {
            width: 2rem;
            height: 2rem;
          }

          .right-icon {
            width: 1.2rem;
            height: 1.2rem;
          }

          .desc-txt {
            font-size: 0.8rem;
            font-weight: 400;
            text-align: right;
            color: #cccccc;
          }

          .input-txt {
            width: 8rem;
            height: 2.4rem;
            font-size: 0.8rem;
            text-align: right;
          }

          .active {
            color: #333333;
          }
        }
      }

      .list-item:last-child {
        border-bottom: none;
      }
    }

    .add-contact {
      width: 100%;
      padding: 0.65rem 0.6rem;
      display: flex;
      align-items: center;

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 2.4rem;
        background: #ffffff;
        border-radius: 0.4rem;
        box-shadow: 0 0.05rem 0.15rem 0 rgba(0,0,0,0.06);

        .add-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.4rem;
        }

        .add-txt {
          font-size: 0.8rem;
          color: #333333;
        }
      }
    }

    .suspend-button {
      position: fixed;
      width: 100%;
      height: 4rem;
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
