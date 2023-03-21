<template>
  <div class="baojimap" ref="baojimap" id="baojimap"></div>
</template>

<script>
import * as echarts from "echarts";
import 'echarts-gl'
import henan from '../../utils/henan.json'

export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      var chartDom = document.getElementById("baojimap");
      var myChart = echarts.init(chartDom);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      myChart.off("click");

      echarts.registerMap("js", henan);
      echarts.registerMap("js2", henan);
      var option;

      // 柱状图 图中的位置
      var center = {
        渭滨区: [107.144467, 34.271008],
        金台区: [107.080003, 34.425192],
        陈仓区: [107.383645, 34.352747],
        凤翔区: [107.400577, 34.581668],
        岐山县: [107.694464, 34.44296],
        扶风县: [107.929419, 34.375497],
        眉县: [107.799971, 34.142137],
        陇县: [106.857066, 34.893262],
        千阳县: [107.174987, 34.742584],
        麟游县: [107.696608, 34.777714],
        凤县: [106.758122, 33.998464],
        太白县: [107.419533, 33.960015],
      };
      // 图中 省份字的位置
      var center2 = {
        渭滨区: [107.144467, 34.271008],
        金台区: [107.080003, 34.425192],
        陈仓区: [107.383645, 34.352747],
        凤翔区: [107.400577, 34.581668],
        岐山县: [107.694464, 34.44296],
        扶风县: [107.929419, 34.375497],
        眉县: [107.799971, 34.142137],
        陇县: [106.857066, 34.893262],
        千阳县: [107.174987, 34.742584],
        麟游县: [107.696608, 34.777714],
        凤县: [106.758122, 33.998464],
        太白县: [107.419533, 33.960015],
      };
      // 数据
      var data = [
        { name: "渭滨区", value: 700 },
        { name: "金台区", value: 200 },
        { name: "陈仓区", value: 700 },
        { name: "凤翔区", value: 700 },
        { name: "岐山县", value: 1200 },
        { name: "扶风县", value: 700 },
        { name: "眉县", value: 700 },
        { name: "陇县", value: 1000 },
        { name: "千阳县", value: 700 },
        { name: "麟游县", value: 100 },
        { name: "凤县", value: 700 },
        { name: "太白县", value: 1500 },
      ];
      var lineData = data.map((item) => {
        return {
          coords: [
            center[item.name],
            [center[item.name][0], center[item.name][1] + item.value * 0.0001],
          ],
        };
      });
      var scatterData = data.map((item) => {
        return [
          center[item.name][0],
          center[item.name][1] + item.value * 0.0001,
        ];
      });
      var scatterData2 = data.map((item) => {
        return center[item.name];
      });
      var scatterData3 = data.map((item) => {
        return center2[item.name].concat(item.name);
      });
      option = {
        backgroundColor: "rgba(0,0,0,0)",
        tooltip: {
          trigger: 'item',
          show: true,
          enterable: true,
          textStyle:{
            fontSize:20,
            color: '#fff'
          },
          backgroundColor: 'rgba(0,0,0,0.5)',
          // backgroundColor: 'rgba(0,2,89,0.8)',
          // formatter: '{b}'
          formatter: function (item) {
            var aaaaa = data
            return `商户数${aaaaa[item.dataIndex].value}`;;
          },
        },
        // 地图图层样式
        geo: [
          {
            map: "js",
            aspectScale: 0.9,
            // roam: false, //是否允许缩放
            roam:false,
            //zoom: 1.1, //默认显示级别
            layoutSize: "95%",
            layoutCenter: ["50%", "50%"],
            itemStyle: {
              areaColor: "transparent",
              borderColor: "#47E2FF",
              borderWidth: 2,
            },
            emphasis: {
              itemStyle: {
                areaColor: "#0E336B",
              },
              label: {
                show: 0,
                color: "#fff",
              },
            },
            zlevel: 3,
            // regions: [ // 区域配置
            //   {
            //     name: '金台区', //区块名称
            //     itemStyle: {
            //       normal: {
            //         areaColor: '#B9D696' // 区域颜色
            //       }
            //     }
            //   },
            // ]
          },
          {
            map: "js2",
            aspectScale: 0.9,
            roam: false, //是否允许缩放
            //zoom: 1.1, //默认显示级别
            layoutSize: "95%",
            layoutCenter: ["50%", "50%"],
            itemStyle: {
              areaColor: '#0E336B',
              borderColor: "#47E2FF",
              borderWidth: 2,
            },
            zlevel: 2,
            silent: true,
          },
          {
            map: "js2",
            aspectScale: 0.9,
            roam: false, //是否允许缩放
            //zoom: 1.1, //默认显示级别
            layoutSize: "95%",
            layoutCenter: ["50%", "52%"],
            itemStyle: {
              areaColor: "#6AC8FF",
              borderColor: "#47E2FF",
              borderWidth: 1,
            },
            zlevel: 1,
            silent: true,
          },
        ],
        series: [
          // 画柱状图
          // {
          //   type: "lines",
          //   zlevel: 5,
          //   effect: {
          //     show: false,
          //     period: 4, //箭头指向速度，值越小速度越快
          //     trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          //     symbol: "arrow", //箭头图标
          //     symbolSize: 5, //图标大小
          //   },
          //   lineStyle: {
          //     width: 15, //尾迹线条宽度
          //     color: 'rgb(22,255,255, .6)',
          //     opacity: 1, //尾迹线条透明度
          //     curveness: 0, //尾迹线条曲直度
          //   },
          //   label: {
          //     show: 0,
          //     position: "end",
          //     formatter: "245",
          //   },
          //   silent: true,
          //   data: lineData,
          // },
          // // 柱形数量显示
          // {
          //   type: "scatter",
          //   coordinateSystem: "geo",
          //   geoIndex: 0,
          //   zlevel: 5,
          //   label: {
          //     show: !0,
          //     position: "left",
          //     formatter: (params) => data[params.dataIndex].value,
          //     padding: [4, 8],
          //     backgroundColor: "#003F5E",
          //     borderRadius: 5,
          //     borderColor: "#67F0EF",
          //     borderWidth: 1,
          //     color: "#67F0EF",
          //   },
          //   symbol: "circle",
          //   symbolSize: [15, 8],
          //   itemStyle: {
          //     color: 'rgb(22,255,255, .6)',
          //     opacity: 1,
          //   },
          //   silent: true,
          //   data: scatterData,
          // },
          // // 图中圆点设置
          // {
          //   type: "scatter",
          //   coordinateSystem: "geo",
          //   geoIndex: 0,
          //   zlevel: 5,
          //   symbol: "circle",
          //   symbolSize: [15, 8],
          //   itemStyle: {
          //     color: 'rgb(22,255,255, .6)',
          //     opacity: 1,
          //     shadowColor: "#000",
          //     shadowBlur: 5,
          //     shadowOffsetY: 2,
          //   },
          //   silent: true,
          //   data: scatterData2,
          // },
          // {
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   geoIndex: 0,
          //   symbol: "circle",
          //   symbolSize: 4,
          //   showEffectOn: "render",
          //   rippleEffect: {
          //     brushType: "fill",
          //     scale: 10,
          //   },
          //   hoverAnimation: true,
          //   label: {
          //     formatter: (p) => p.data[2],
          //     position: "right",
          //     color: "#fff",
          //     fontSize: 14,
          //     distance: 10,
          //     show: !0,
          //   },
          //   itemStyle: {
          //     color: 'rgb(22,255,255, .6)',
          //   },
          //   zlevel: 6,
          //   data: scatterData3,
          // },
        ],
      };
      myChart.setOption(option);

      // option && myChart.setOption(option);
    },
  },
};
</script>
<style>
.baojimap {
  height: 100vh;
  /*background: #4968FF;*/
  width: 100%;
}
</style>
