<template>
  <div style="position: relative">
    <baidu-map class="map" ak="B6f231e9da2aad1f23cce74400698550" :scroll-wheel-zoom="true" @ready="handler" />
    <div class="board">
      <div>
        学校(所)<span class="spp-font">{{ formatNum(scl_count) }}</span>
      </div>
      <div>
        教师(人)<span class="spp-font">{{ formatNum(tea_count) }}</span>
      </div>
      <div>
        学生(人)<span class="spp-font">{{ formatNum(stu_count) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import red from '@/assets/icon/red.png'
import yellow from '@/assets/icon/yellow.png'
import orange from '@/assets/icon/orange.png'
import green from '@/assets/icon/green.png'
import { getSchoolListInfo } from '@/api/bureau'
export default {
  components: { BaiduMap },
  props: {
    position: {
      type: Object,
      default: () => {}
    },
    mystyle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      BMap: null,
      search_name: '',
      scl_count: 0,
      stu_count: 0,
      tea_count: 0
    }
  },
  methods: {
    handler({ BMap, map }) {
      this.BMap = BMap
      this.map = map
      this.enableMapClick = false
      getSchoolListInfo().then(res => {
        const data = res.data
        const area_name = data.area_name + data.county_name
        this.scl_count = data.scl_list.length
        data.scl_list.forEach(item => {
          this.markSchool(item)
          this.stu_count += item.scl_stu_num
          this.tea_count += item.scl_tea_num
        })
        var bdary = new this.BMap.Boundary()
        // 获取行政区域
        bdary.get(area_name, rs => {
          // 清除地图覆盖物
          // this.map.clearOverlays()
          // 行政区域的点有多少个
          var count = rs.boundaries.length
          if (count === 0) {
            this.$message.error('未能获取当前输入行政区域')
            return
          }
          var pointArray = []
          for (var i = 0; i < count; i++) {
            var ply = new this.BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeStyle: 'dashed', strokeColor: '#8ee2a5' })
            ply.setFillOpacity(parseFloat('0.1'))
            this.map.addOverlay(ply)
            pointArray = pointArray.concat(ply.getPath())
          }
          this.map.setViewport(pointArray)
        })
      })
    },
    // 标注学校点
    markSchool(scl_info) {
      if (!scl_info.scl_location) {
        return false
      }
      const position = JSON.parse(scl_info.scl_location)
      if (!position.hasOwnProperty('lng')) {
        return false
      }
      const red_icon = new this.BMap.Icon(red, new this.BMap.Size(22, 32), { anchor: new this.BMap.Size(11, 0), imageSize: new this.BMap.Size(22, 32) })
      const green_icon = new this.BMap.Icon(green, new this.BMap.Size(22, 32), { anchor: new this.BMap.Size(11, 0), imageSize: new this.BMap.Size(22, 32) })
      const yellow_icon = new this.BMap.Icon(yellow, new this.BMap.Size(22, 32), { anchor: new this.BMap.Size(11, 0), imageSize: new this.BMap.Size(22, 32) })
      const orange_icon = new this.BMap.Icon(orange, new this.BMap.Size(22, 32), { anchor: new this.BMap.Size(11, 0), imageSize: new this.BMap.Size(22, 32) })
      const danger_count = scl_info.danger_count
      let icon = null
      if (danger_count === 0) {
        icon = green_icon
      } else if (danger_count > 0 && danger_count <= 5) {
        icon = yellow_icon
      } else if (danger_count > 5 && danger_count <= 10) {
        icon = orange_icon
      } else {
        icon = red_icon
      }
      const point = new this.BMap.Point(position.lng, position.lat)
      this.map.centerAndZoom(point, 13)
      this.map.setMapStyleV2({ styleJson: style })
      const myMarker = new this.BMap.Marker(new this.BMap.Point(position.lng, position.lat), { icon: icon })
      var label = new this.BMap.Label(scl_info.scl_name, { offset: new this.BMap.Size(-10, -26) })
      label.setStyle(
        {
          'background-color': 'rgba(51, 51, 51, 0.6)',
          'border': 'none',
          'color': '#ffffff',
          'padding': '0 5px',
          'line-height': '24px'
        }
      )
      myMarker.setLabel(label)
      var opts = {
        width: 300, // 信息窗口宽度
        height: 140, // 信息窗口高度
        title: scl_info.scl_name // 信息窗口标题
      }
      let html = '<span class="scl_address">' + (scl_info.scl_address ? scl_info.scl_address : '') + '</span><br/>'
      html += '<p class="scl_info">'
      html += '<span style="width:50%"><span class="scl_info_title">成员数</span><span class="scl_people_num">' + scl_info.scl_stu_num + '</span></span>'
      html += '<span style="width:50%"><span class="scl_info_title">管理员数</span><span class="scl_people_num">' + scl_info.scl_tea_num + '</span></span>'
      html += '</p>'
      html += '<p class="scl_info">'
      html += '<span style="width:50%"><span class="scl_info_title">风险数</span><span class="risk_count">' + scl_info.risk_count + '</span></span>'
      html += '<span style="width:50%"><span class="scl_info_title">隐患数</span><span class="danger_count">' + scl_info.danger_count + '</span></span>'
      html += '</p>'
      const infoWindow = new this.BMap.InfoWindow(html, opts) // 创建信息窗口对象
      myMarker.addEventListener('click', function() {
        this.map.openInfoWindow(infoWindow, point) // 开启信息窗口
      })
      this.map.addOverlay(myMarker)
    },
    formatNum(num) {
      if (num >= 10000) {
        return Math.floor((num / 10000) * 10) / 10 + '万'
      }
      return num
    }
  }
}
const style = [
  {
    'featureType': 'land',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'color': '#164495ff'
    }
  }, {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#b6d2f3ff'
    }
  }, {
    'featureType': 'building',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#2471d8ff'
    }
  }, {
    'featureType': 'building',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#0a3c7eff'
    }
  }, {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'color': '#6599e0ff'
    }
  }, {
    'featureType': 'village',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'town',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'district',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'country',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'city',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'continent',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'poilabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'poilabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'scenicspotslabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'scenicspotslabel',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'transportationlabel',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'transportationlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'airportlabel',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'airportlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#2a8fb6ff'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'weight': '4'
    }
  }, {
    'featureType': 'green',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'color': '#003172ff'
    }
  }, {
    'featureType': 'scenicspots',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'color': '#0d4691ff'
    }
  }, {
    'featureType': 'scenicspots',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'scenicspots',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'continent',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'country',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'city',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'city',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'scenicspotslabel',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'airportlabel',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'transportationlabel',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'railway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'subway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'highwaysign',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'nationalwaysign',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'nationalwaysign',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'provincialwaysign',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'provincialwaysign',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'tertiarywaysign',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'tertiarywaysign',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'subwaylabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'subwaylabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#91abceff',
      'weight': '90'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'shopping',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'scenicspots',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'scenicspotslabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'manmade',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'manmade',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'highwaysign',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'water',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#15253b00'
    }
  }, {
    'featureType': 'road',
    'stylers': {
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'stylers': {
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'stylers': {
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels.text',
    'stylers': {
      'fontsize': '24'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'weight': '3'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry',
    'stylers': {
      'weight': '3'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'local',
    'elementType': 'geometry.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#4ab8e2ff'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#2d6ebbff'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#0040b0ff'
    }
  }, {
    'featureType': 'local',
    'elementType': 'geometry.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#0040b0ff'
    }
  }, {
    'featureType': 'local',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'local',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'labels.text.fill',
    'stylers': {
      'visibility': 'on',
      'color': '#adb5c0ff'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'visibility': 'on',
      'color': '#083a81ff',
      'weight': '1'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'weight': '1'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on',
      'weight': '1'
    }
  }, {
    'featureType': 'local',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'weight': '1'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'geometry',
    'stylers': {
      'weight': '3'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry',
    'stylers': {
      'weight': '3'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry',
    'stylers': {
      'weight': '3'
    }
  }, {
    'featureType': 'highway',
    'stylers': {
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'stylers': {
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'stylers': {
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'stylers': {
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'stylers': {
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'stylers': {
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'nationalway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'provincialway',
    'stylers': {
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'provincialway',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'provincialway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '8-10'
    }
  }, {
    'featureType': 'cityhighway',
    'stylers': {
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'stylers': {
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'stylers': {
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '6',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '7',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '8',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'cityhighway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '6-9'
    }
  }, {
    'featureType': 'arterial',
    'stylers': {
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '9-9'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '9-9'
    }
  }, {
    'featureType': 'arterial',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
      'level': '9',
      'curZoomRegionId': '0',
      'curZoomRegion': '9-9'
    }
  }, {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'building',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'subwaystation',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'education',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'highway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'local',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'scenicspotsway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'universityway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'vacationway',
    'elementType': 'geometry',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'districtlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'educationlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'medicallabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'entertainmentlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'estatelabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'businesstowerlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'governmentlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'restaurantlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'hotellabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'lifeservicelabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'carservicelabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'transportationlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'financelabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'carservicelabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'lifeservicelabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'shoppinglabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'restaurantlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'governmentlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'on'
    }
  }, {
    'featureType': 'companylabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'medicallabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'entertainmentlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'educationlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'airportlabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'estatelabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'businesstowerlabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'companylabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'hotellabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'shoppinglabel',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'financelabel',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'local',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'fourlevelway',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'tertiaryway',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }, {
    'featureType': 'roadarrow',
    'elementType': 'labels.icon',
    'stylers': {
      'visibility': 'off'
    }
  }]
</script>
<style lang="scss" scoped>
  .map{
    width: 100%;
    height: 100%;
  }
  .board{
    position:absolute;
    top:10px;
    left: 10px;
    background-color: rgba(0, 55, 129, 0.8);
    color: #fff;
    padding: 10px 20px;
    width: 196px;
    height: 195px;
    font-size: 16px;
    line-height: 55px;
    span{
      margin-left: 12px;
      color: #FABF00;
      // font-weight: bold;
      font-size: 24px;
      position: relative;
      top: 3px;
    }
  }
</style>
