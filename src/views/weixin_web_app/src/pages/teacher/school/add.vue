<template>
  <div class="school-add">
    <div class="text-content margin">
      <div class="title">发送内容</div>
      <textarea
        rows="6"
        placeholder="请输入发送内容"
        v-model="form.content"
        class="textarea"
      />
    </div>

    <div class="column type">
      <div class="label">发送对象</div>
      <div class="label-content">
        <div class="radio teacher" @click="handleType(area === 'ha' ? 'select_teacher' : 'select_teacher1', 2)">
          <img class="radio_icon" :src="form.notice_scope == 2 ? require('../../../assets/radio_active.png') : require('../../../assets/radio_no.png')">
          <div class="radio_txt">教师</div>
        </div>
        <div class="radio" @click="handleType('select_student', 1)">
          <img class="radio_icon" :src="form.notice_scope == 1 ? require('../../../assets/radio_active.png') : require('../../../assets/radio_no.png')">
          <div class="radio_txt">学生</div>
        </div>
      </div>
    </div>

    <template v-if="area === 'ha'">
      <div class="column timing">
        <div class="label">定时发送</div>
        <div class="label-content">
          <mt-switch v-model="timing"></mt-switch>
        </div>
      </div>

      <div class="column datetime" v-if="timing">
        <div class="label">选择时间</div>
        <div class="label-content" @click="handleSelectDate()">
          <div class="desc-txt" :class="form.timing_time === '' ? '' : 'date-time'">{{ form.timing_time === '' ? '请选择发送时间' : form.timing_time }}</div>
          <img class="arrow_right" src="../../../assets/arrow_right.png">
        </div>
      </div>
      <div class="column timing send" v-if="show_sms">
        <div class="label">是否发送短信</div>
        <div class="label-content">
          <mt-switch v-model="form.is_sms"></mt-switch>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="column timing">
        <div class="label">发送方式</div>
        <div class="label-content">
          <div class="radio teacher" @click="form.send_type = 1">
            <img class="radio_icon" :src="form.send_type === 1 ? require('../../../assets/radio_active.png') : require('../../../assets/radio_no.png')">
            <div class="radio_txt">即时发送</div>
          </div>
          <div class="radio" @click="form.send_type = 2">
            <img class="radio_icon" :src="form.send_type === 2 ? require('../../../assets/radio_active.png') : require('../../../assets/radio_no.png')">
            <div class="radio_txt">定时发送</div>
          </div>
        </div>
      </div>

      <div class="column datetime" v-if="form.send_type === 2">
        <div class="label">选择时间</div>
        <div class="label-content" @click="handleSelectDate()">
          <div class="desc-txt" :class="form.timing === '' ? '' : 'date-time'">{{ form.timing === '' ? '请选择发送时间' : form.timing }}</div>
          <img class="arrow_right" src="../../../assets/arrow_right.png">
        </div>
      </div>
    </template>

    <div class="suspend-button">
      <div class="button" @click="handleSend()">发送</div>
    </div>

    <!-- 选择日期时间组件 -->
    <mt-datetime-picker
        class="pickerstart"
        ref="picker0"
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
    name: "school_letter_add",
    data () {
      return {
        pickerStart: new Date(),
        timing: true,
        show_sms: false, // 是否能发送短信
        area: sessionStorage.getItem('area'),
        form: {
          gra_id: '', // 年级id，多个年级用','分割
          cls_id: '', // 班级id，多个班级用','分割
          stu_id: '', // 学生id，多个学生用','分割
          tea_id: '', // 教师id，多个教师用','分割
          content: '', // 校信内容
          notice_scope: 0, // 发送对象：1-学生；2-教师
          timing_time: '', // 定时发送的时间
          is_sms: true, // 是否发送短信，0-不发送，1-发送
          send_type: 1, // 发送方式 1即时发送 2定时发送
          timing: '', // 定时发送的时间
        }
      }
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'school_letter_add',
        sign: true,
      });
      this.$selectPass.$off('select_teacher')
      this.$selectPass.$off('select_student')
      this.$selectPass.$on('select_teacher',  (res) => {
        this.form.tea_id = res.tea_id
        this.form.gra_id = ''
        this.form.cls_id = ''
        this.form.stu_id = ''
      })
      this.$selectPass.$on('select_student',  (res) => {
        this.form.gra_id = res.gra_id
        this.form.cls_id = res.cls_id
        this.form.stu_id = res.stu_id
        this.form.tea_id = ''
      })
      if (this.area === 'ha') {
        this.handleGetLetter()
      }
    },
    methods: {
      ...mapMutations(['UPDATE_INCLUDE_PAGE']),
      // 获取是否能发送校信
      handleGetLetter() {
        httpFormPostMethod('WebApi/TeaNotice/getSendSmsFlag', {}).then((res) => {
          this.show_sms = res.data
          if (!res.data) {
            delete this.form.is_sms
          }
        })
      },
      // 选择对象类型
      handleType(path, type) {
        this.form.notice_scope = type
        if (this.form.notice_scope === 1) {
          this.form.tea_id = ''
        } else {
          this.form.gra_id = ''
          this.form.cls_id = ''
          this.form.stu_id = ''
        }
        this.$router.push({
          path: path,
          query: {
            type: 1,
          }
        })
      },
      handleSelectDate() {
        this.$refs.picker0.open();
      },
      // 选择发送时间
      handleConfirm() {
        if (this.area === 'ha') {
          this.form.timing_time = Tool.formate(this.pickerStart, "yyyy-MM-dd hh:mm")
        } else {
          this.form.timing = Tool.formate(this.pickerStart, "yyyy-MM-dd hh:mm")
        }
      },
      handleFormatStr(val) {
        let str = ''
        val = val.split(' ')
        val[0].split('-').map((item) => {
          str += item
        })
        val[1].split(':').map((item) => {
          str += item
        })
        return str
      },
      // 发送
      handleSend() {
        let form = JSON.parse(JSON.stringify(this.form))
        let data = {
          gra_id: form.gra_id,
          cls_id: form.cls_id,
          stu_id: form.stu_id,
          tea_id: form.tea_id,
          content: form.content,
          notice_scope: form.notice_scope,
        }
        // 发送对象必选
        if (data.notice_scope == 0) {
          Tool.tip('请选择发送对象')
          return false
        }

        if (this.area === 'ha') {
          data.is_sms = form.is_sms ? 1 : 0
          if (!this.timing) {
            delete data.timing_time
          }
        } else {
          data.send_type = form.send_type
          if (data.send_type === 2) {
            data.timing = this.handleFormatStr(form.timing)
          }
        }

        httpFormPostMethod('web/campus/save', data).then((res) => {
          if (res.status == 200) {
            Tool.tip('发送成功', 2000, () => {
              this.$router.go(-1)
            })
          } else {
            Tool.tip(res.message)
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .school-add {

    .margin {
      margin: 0.5rem 0;
    }

    .text-content {
      width: 100%;
      height: 9rem;
      background: #ffffff;
      padding: 0.6rem 0.8rem;

      .title {
        width: 100%;
        height: 1.1rem;
        font-size: 0.8rem;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 1.1rem;
        margin-bottom: 0.7rem;
      }

      .textarea {
        width: 100%;
        font-size: 0.7rem;
      }
    }

    .column {
      width: 100%;
      height: 2.8rem;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.8rem;

      .label {
        width: 6rem;
        height: 1.1rem;
        font-size: 0.8rem;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 1.1rem;
      }

      .label-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .radio {
          display: flex;
          align-items: center;

          .radio_icon {
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.3rem;
          }

          .radio_txt {
            // width: 1.6rem;
            height: 1.2rem;
            font-size: 0.8rem;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 1.2rem;
          }
        }

        .teacher {
          margin-right: 1.2rem;
        }

        .desc-txt {
          height: 1.2rem;
          font-size: 0.8rem;
          font-weight: 400;
          text-align: right;
          color: #cccccc;
          line-height: 1.2rem;
        }

        .date-time {
          color: #333333 !important;
        }

        .arrow_right {
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }

    .send {
      margin-top: 0.5rem;
    }

    .type {
      margin: 0.5rem 0;
    }

    .timing {
      margin-bottom: 0.05rem;
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
