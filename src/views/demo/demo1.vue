<template>
  <div class="demo_index">
    <div v-for="(item, index) in 24" :key="index">
      {{ index > 9 ? `${index}:00` :  `0${index}:00` }}
    </div>


    <div class="hea_index">
      <table class="hea_table" cellpadding="0" cellspacing="0" border="0">
        <tr class="hea_thead">
          <td class="td_title">文件标题</td>
          <td class="td_input length" :colspan="5">标题</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">发文单位1</td>
          <td class="td_input small" :colspan="2">单位</td>
          <td class="td_title">发文时间</td>
          <td class="td_input small" :colspan="2">2023-01-13 15:02:55</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">发文字号</td>
          <td class="td_input small" :colspan="2">12</td>
          <td class="td_title">收文时间</td>
          <td class="td_input small" :colspan="2">2023-01-13 15:02:55</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">文件类型</td>
          <td class="td_input small" :colspan="2">表格</td>
          <td class="td_title">收文编号</td>
          <td class="td_input small" :colspan="2">12335655665</td>
        </tr>
        <tr class="hea_thead" >
          <td class="td_title" :rowspan="5">领导批示</td>
          <td class="td_input length" :colspan="5">电子盖章</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_input length" :colspan="5">电子盖章</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_input length" :colspan="5">电子盖章</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_input length" :colspan="5">电子盖章</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_input length" :colspan="5">电子盖章</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">承办单位</td>
          <td class="td_input small">单位</td>
          <td class="td_title">承办人</td>
          <td class="td_input small">诶嘿</td>
          <td class="td_title">联系人电话</td>
          <td class="td_input small">18736805971</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">拟办意见</td>
          <td class="td_input length" :colspan="5">拟办意见</td>
        </tr>
        <tr class="hea_thead">
          <td class="td_title">备注</td>
          <td class="td_input length" :colspan="5">备注</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "demo1"
}
</script>

<style lang="scss" scoped>
.demo_index {
  width: 100%;
  height: 100vh;
  padding: 40px;
  color: #4968FF;

  .hea_index {
    width: 500px;
    border-top: 1px solid #4968FF;
  }
  .hea_table {
    color: #F8644E;
    .td_title {
      width: 300px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      border-bottom: 1px solid #4968FF;
      border-right: 1px solid #4968FF;
    }
    .td_input {
      width: 400px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      border-bottom: 1px solid #4968FF;
      border-right: 1px solid #4968FF;
    }
    .small {
      width: 200px;
    }
    .length {
      width: 600px;
    }
    .td_title:first-child {
      border-left: 1px solid #4968FF;
    }
    .bor_none {
      border-left: none !important;
    }
  }
}
</style>
