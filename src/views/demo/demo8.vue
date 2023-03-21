<template>
  <div class="page_index">
    <el-amap
      class="map_amap"
      ref="map"
      map-style="amap://styles/e3549d7520806df6f03f8e6e97f854bc"
      :center="center"
      view-mode="3D"
      :zoom="9"
      :pitch="40"
      :expand-zoom-range="true"
      :show-label="true"
    >
      <el-amap-marker
          v-for="(item, index) in markers"
          :key="index"
          :position="item.position"
      >
        <!--<div class="tips">
          <div class="tips-content">{{ item.title }}</div>
          <div class="popper__arrow" />
        </div>-->
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
      district: null,
      disProvince: null,
      markers: [{
        title: '某某学校',
        position: [113.729505,34.773002],
      },{
        title: '某某学校',
        position: [113.708704,34.773459],
      },{
        title: '某某学校',
        position: [113.547426,34.80907],
      },{
        title: '某某学校',
        position: [113.704732,34.403088],
      },{
        title: '某某学校',
        position: [112.986792,34.716157],
      }],
      icon: require('@/assets/images/map_coords.png'),
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
      let that = this
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

      that.district.search('郑州市', function (status, result) {
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
          fillColor: 'rgb(5,23,81)',//遮罩图层颜色
          fillOpacity: 0.7,
        });
        polygon.setPath(pathArray);
        that.$refs.map.$$getInstance().add(polygon)
        that.$refs.map.$$getInstance().setFitView(that.polygons) //视口自适应
      })

      if (!this.disProvince) {
        this.disProvince = new AMap.DistrictLayer.Province({
          zIndex: 12,
          depth: 2,
          adcode: ['410102', '410103', '410104', '410105', '410106', '410108', '410122', '410181', '410182', '410183', '410184', '410185'],//重点：添加要划分的子行政区码
          styles: {
            fill: 'rgba(4,18,109,0.5)',
            "province-stroke": "#47E2FF",
            "city-stroke": "#47E2FF",
            "county-stroke": "#47E2FF", //线条颜色
          },
        })
        this.disProvince.setMap(that.$refs.map.$$getInstance())
      }

      // that.district.search('郑州市', function (status, result) {
      //   let outer = [
      //     new AMap.LngLat(-360, 90, true),
      //     new AMap.LngLat(-360, -90, true),
      //     new AMap.LngLat(360, -90, true),
      //     new AMap.LngLat(360, 90, true),
      //   ];
      //   let holes = result.districtList[0].boundaries
      //   let pathArray = [
      //     outer
      //   ];
      //   pathArray.push.apply(pathArray, holes)
      //   let polygon = new AMap.Polygon({
      //     pathL: pathArray,
      //     strokeColor: '#00eeff',//边框线颜色
      //     strokeWeight: 1,
      //     fillColor: '#13305B',//遮罩图层颜色
      //     fillOpacity: 0.9
      //   });
      //   polygon.setPath(pathArray)
      //   that.$refs.map.$$getInstance().add(polygon)
      // })

      //行政区查询
      // let code = '郑州市'
      // that.district.search(code, function (status, result) {
      //   that.polygons = [];
      //   let bounds = result.districtList[0].boundaries;
      //   if (bounds) {
      //     for (var i = 0, l = bounds.length; i < l; i++) {
      //       //生成行政区划polygon
      //       let polygon = new AMap.Polygon({
      //         strokeWeight: 1,
      //         path: bounds[i],
      //         fillOpacity: 0.4,
      //         fillColor: "#80d8ff",
      //         strokeColor: "#0091ea",
      //       });
      //       that.polygons.push(polygon);
      //     }
      //   }
      //   console.log("polygons");
      //   console.log(that.polygons);
      //   AMap.Polygon.bind(that.polygons);
        // that.$refs.map.$amap.setFitView(that.polygons); //视口自适应
      // });
    }
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
