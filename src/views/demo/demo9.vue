<template>
  <div class="page_index">
    <el-amap
      class="map_amap"
      ref="map"
      map-style="amap://styles/e3549d7520806df6f03f8e6e97f854bc"
      :center="center"
      view-mode="3D"
      :zoom="12"
      :pitch="0"
      :expand-zoom-range="true"
      :show-label="true"
    >
      <el-amap-marker
          v-for="(item, index) in markers"
          :key="index"
          :position="item.position"
      >
        <div class="tips">
          <div class="tips-content">{{ item.title }}</div>
          <div class="popper__arrow" />
        </div>
        <img :src="icon" class="position-icon">
      </el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import VueAMap from '@vuemap/vue-amap'
export default {
  name: "Toolbar",
  data() {
    return {
      center: ['113.731372', '34.768085'],
      polygons: [],
      markers: [{
        title: '某某学校',
        position: [113.729505,34.773002],
      },{
        title: '某某学校',
        position: [113.708704,34.773459],
      }],
      icon: require('@/assets/images/map_coords.png'),
      district: null,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.drawBounds()
      })
    }, 2000)
  },
  methods: {
    drawBounds() {
      let that = this;
      //加载行政区划插件
      if (!that.district) {
        //实例化DistrictSearch
        var opts = {
          subdistrict: 1, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "city", //查询行政级别为 市
          features: ["road", "point", "bg"], //设置地图显示内容
        };
        that.district = new AMap.DistrictSearch(opts);
      }
      //行政区查询
      that.district.search('金水区', function (status, result) {
        // 外多边形坐标数组和内多边形坐标数组
        let outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true),
        ];
        let holes = result.districtList[0].boundaries
        let pathArray = [
          outer
        ];
        pathArray.push.apply(pathArray, holes)
        let polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: '#47E2FF',//边框线颜色
          strokeWeight: 3,
          strokeOpacity: 1,
          fillColor: '#0E336B',//遮罩图层颜色
          fillOpacity: 0.6
        });
        polygon.setPath(pathArray);
        that.$refs.map.$$getInstance().add(polygon)
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.page_index {
  width: 100%;
  height: 100vh;
}
.map_amap {
  width: 100%;
  height: 100%;
}
.tips {
  position: absolute;
  left: -67px;
  top: -120px;
  z-index: 8;
  background: url('~@/assets/images/tip.png') no-repeat;
  background-size: 100% 100%;
  width: 164px;
  height: 118px;
  //background: rgb(101 121 194 / 50%);
  //backdrop-filter: blur(4px);
  //border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  .tips-content {
    font-size: 12px;
    color: #FFFFFF;
  }
}
.position-icon {
  width: 30px;
  height: 48px;
}
</style>
