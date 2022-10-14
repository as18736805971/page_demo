<template>
  <div class="note">
    <div class="content">
      <div class="title" :class="type == 3 ? 'agree'  : ''">
        {{ type == 3 ? '同意' : '拒绝' }}{{ cls_name ? '(' + cls_name + ')' : '' }}{{ stu_name }}的请假申请
      </div>

      <div class="desc-txt">
        <textarea class="textarea" v-model="audit_remark" placeholder="备注"></textarea>
      </div>
    </div>

    <div class="suspend-button">
      <div class="agree" @click="onSubmit(2)">取消</div>
      <div class="agree down" @click="onSubmit(3)">提交</div>
    </div>
  </div>
</template>

<script>
  import { Tool } from '@/common/Tool'
  import { httpFormPostMethod } from '@/common/HttpService'

  export default {
    name: "note",
    data() {
      return {
        leave_id: this.$route.query.leave_id || '',
        type: this.$route.query.type || '',
        cls_name: this.$route.query.cls_name || '',
        stu_name: this.$route.query.stu_name || '',
        audit_remark: '',
      }
    },
    methods: {
      onSubmit(type) {
        if (type == 3) {
          // 2拒绝 3同意
          let api = this.type == 3 ? 'web/stu/leave/submit' : 'web/stu/leave/submit'
          httpFormPostMethod(api, {
            leave_id: this.leave_id,
            audit_remark: this.audit_remark,
            audit_status: this.type == 3 ? 2 : 3
          }).then((res) => {
            if(res.status == 200) {
              Tool.tip('审批成功', 2000, () => {
                this.$router.replace('ask_leave')
              })
            }
          })
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../styles/mixin';

  .note {
    background: #ffffff;
    padding-top: 1rem;

    .content {
      width: 100%;
      height: calc(100vh - 4.9rem);
    }

    .title {
      width: 100%;
      height: 1.3rem;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
      color: #f0644d;
      line-height: 1.3rem;
      margin: 0 auto 1rem;
    }

    .agree {
      color: #66C46D;
    }

    .desc-txt {
      width: 100%;
      padding: 0.6rem;

      .textarea {
        width: 100%;
        height: 15rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #333333;
        line-height: 1.2rem;
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
      display: flex;
      justify-content: center;

      .agree {
        width: 50%;
        height: 2.4rem;
        border: 0.05rem solid #ebebeb;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 400;
        color: #909399;
      }

      .down {
        background: #3399ff;
        border-radius: 0.2rem;
        margin-left: 0.55rem;
        color: #ffffff;
      }
    }
  }
</style>
