<template>
  <div class="info" :style="{ height: height + 'px'}">
    <div v-if="url" class="plan-img">
      <!-- <img class="plan-info-img" :src="url">-->
      <el-image class="plan-info-img" :src="url" :fit="'fit'">
        <div slot="error" class="image-slot">
          <div style="position: relative; width: 100%; height: 100%">
            <div :style="{height: height + 'px', background: 'url(' + no_model +')', backgroundSize: 'cover'}" />
            <div style="position:absolute; top:0;left:0; display:flex; justify-content: center; align-items: center" :style="{height: '100%', width: '100%'}">
              <span style="color: #fff; font-size: 32px;">学校平面图加载失败</span>
            </div>
          </div>
        </div>
      </el-image>
    </div>
    <div v-else style="position: relative; width: 100%; height: 100%">
      <div :style="{height: '100%', background: 'url(' + no_model +')', backgroundSize: 'cover'}" />
      <div style="position:absolute; top:0;left:0; display:flex; justify-content: center; align-items: center" :style="{height: '100%', width: '100%'}">
        <span style="color: #fff; font-size: 32px;">请先上传学校平面图</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanImg',
  props: {
    height: {
      type: [String, Number],
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      no_model: require('@/assets/images/no_model.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-img {
  width: 100%;
  height: 100%;
  border-radius: 4px;

  .plan-info-img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    // object-fit: contain;
  }
}
</style>
