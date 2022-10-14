<template>
  <div class="homeHeader-main">
    <section class="title-colunm" :class="{'haveborder': type!==2 && type!=4}">
      <span>{{ title }}</span>
      <span v-show="type===1" class="viewall" @click="viewAll">查看全部</span>
      <div v-show="type===2" class="header-date">
        <el-date-picker
          v-model="date"
          type="date"
          :clearable="false"
          prefix-icon
          style="width: 100px; font-size: 12px;"
          format="yyyy/MM/dd"
          value-format="yyyyMMdd"
          @change="changeDate"
        />
        <i class="el-icon-arrow-down icon-down" />
      </div>
      <div v-show="type===3" class="thirdtype-date">
        <span style="color: #313233;font-size: 14px">年份：</span>
        <el-date-picker
          v-model="date"
          type="year"
          placeholder="选择年份"
          value-format="yyyy"
          @change="changeDate"
        />
        <i class="el-icon-arrow-down icon-down" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: Number
    }
  },
  data() {
    return {
      date: new Date()
    }
  },
  mounted() {},
  methods: {
    viewAll() {
      this.$emit('viewAll')
    },
    changeDate(date) {
      this.$emit('getDate', {
        title: this.title,
        date: date
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.homeHeader-main {
  .title-colunm {
    height: 50px;
    padding: 0 16px;
    line-height: 50px;
    color: #313233;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    .viewall {
      font-size: 14px;
      color: #3399ff;
      cursor: pointer;
    }
  }
  .haveborder {
    border-bottom: 1px solid #ebf0f5;
  }
}
</style>
<style lang="scss">
.homeHeader-main {
  .title-colunm {
    .header-date {
      .el-date-editor {
        .el-input__inner {
          padding: 0;
          padding-right: 15px;
          border: none;
          text-align: right;
          cursor: pointer;
        }
      }
    }
    .header-date {
      position: relative;
      .icon-down {
        position: absolute;
        right: 0;
        top: 21px;
      }
    }
    .thirdtype-date {
      position: relative;
      .el-date-editor {
        .el-input__inner {
          padding: 0 20px;
          font-size: 14px;
        }
      }
      .icon-down {
        position: absolute;
        right: 10px;
        top: 21px;
      }
    }
    .el-input--medium .el-input__icon {
      display: none;
    }
  }
}
</style>
