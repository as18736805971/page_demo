<template>
  <div class="add_parent">

    <div class="form-list">
      <template v-if="type == 2">
        <div class="list-item">
          <div class="label-title">
            <div class="required">*</div>联系人姓名
          </div>
          <div class="label-right">
            <input class="input-txt" type="text" placeholder="请输入联系人姓名" v-model="phone_form.spb_name" >
          </div>
        </div>
        <div class="list-item">
          <div class="label-title">
            <div class="required">*</div>手机号
          </div>
          <div class="label-right">
            <input class="input-txt" type="number" maxlength="11" placeholder="请输入联系人手机号" v-model="phone_form.spb_phone" >
          </div>
        </div>
      </template>

      <template v-else>
        <div class="list-item">
          <div class="label-title">
            <div class="required">*</div>关系
          </div>
          <div class="label-right" @click="handleBetween()">
            <div class="desc-txt" :class="parent_form.fam_relation === '' ? '' : 'active'">
              {{ parent_form.fam_relation === '' ? '选择关系' : parent_form.fam_relation }}
            </div>
            <img class="right-icon" src="../../../../assets/arrow_right1.png">
          </div>
        </div>
        <div class="list-item">
          <div class="label-title">
            <div class="required">*</div>手机号
          </div>
          <div class="label-right">
            <input class="input-txt" type="number" maxlength="11" placeholder="请输入联系人手机号" v-model="parent_form.fam_phone" >
          </div>
        </div>
        <div class="list-item">
          <div class="label-title">
            <div class="required"></div>家长姓名
          </div>
          <div class="label-right">
            <input class="input-txt" type="text" placeholder="请输入联系人姓名" v-model="parent_form.fam_name" >
          </div>
        </div>
        <div class="list-item">
          <div class="label-title">
            <div class="required"></div>验证码
          </div>
          <div class="label-right">
            <input class="input-txt" type="number" placeholder="请输入验证码" v-model="parent_form.invite_code" >
          </div>
        </div>
        <div class="list-item">
          <div class="label-title">
            <div class="required"></div>是否存为电话簿
          </div>
          <div class="label-right">
            <mt-switch v-model="parent_form.syn_spb"></mt-switch>
          </div>
        </div>
      </template>
    </div>

    <div class="suspend-button">
      <div class="button" @click="onSubmit()">保存</div>
    </div>

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
    name: "add_parent",
    data() {
      return {
        type: this.$route.query.type || '',
        parent_form: {
          stu_id: this.$route.query.stu_id || '', // 学生ID
          fam_phone: '', // 家长手机号
          fam_name: '', // 家长姓名
          fam_relation: '', // 学生与家长关系
          fam_order: '', // 顺序
          invite_code: '', // 验证码
          syn_spb: false, // 同步电话薄，1-同步 0-不同步
        },
        phone_form: {
          stu_id: this.$route.query.stu_id || '', // 学生ID
          spb_name: '', // 联系人姓名
          spb_phone: '', // 联系人联系方式
        },
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
      }
    },
    created() {
      window.document.title = this.$route.query.type == 1 ? '添加家长' : '添加电话簿'
    },
    methods: {
      handleBetween() {
        this.betweenShow = true
      },
      handleSetBetween(data) {
        this.parent_form.fam_relation = data.name
      },
      onSubmit() {
        if (this.type == 1) {
          let data = JSON.parse(JSON.stringify(this.parent_form))

          if (data.fam_relation === '') {
            Tool.tip('请选择联系人关系')
            return false
          }
          if (data.fam_phone === '') {
            Tool.tip('请输入联系人手机号')
            return false
          } else {
            let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
            if (!reg_tel.test(data.fam_phone)) {
              Tool.tip('请输入正确的手机号')
              return false
            }
          }
          if (data.invite_code !== '') {
            let reg_tel = /^[0-9]{6}$/;
            if (!reg_tel.test(data.invite_code)) {
              Tool.tip('验证码为6位数字格式')
              return false
            }
          }
          data.syn_spb = data.syn_spb ? 1 : 0

          httpFormPostMethod('web/cls/fam/save', data).then((res) => {
            if (res.status == 200) {
              Tool.tip('添加成功', 2000, () => {
                this.$router.go(-1)
              })
            }
          })
        } else if (this.type == 2) {
          if (this.phone_form.spb_name === '') {
            Tool.tip('请输入联系人姓名')
            return false
          }
          if (this.phone_form.spb_phone === '') {
            Tool.tip('请输入联系人手机号')
            return false
          } else {
            let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
            if (!reg_tel.test(this.phone_form.spb_phone)) {
              Tool.tip('请输入正确的手机号')
              return false
            }
          }

          httpFormPostMethod('web/cls/phonebook/save', this.phone_form).then((res) => {
            if (res.status == 200) {
              Tool.tip('添加成功', 2000, () => {
                this.$router.go(-1)
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .add_parent {

    .form-list {
      width: 100%;
      height: calc(100vh - 4.9rem);
      overflow-y: auto;

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
