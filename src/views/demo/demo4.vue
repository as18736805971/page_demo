<template>
  <div class='demo-app'>
    <div class='demo-app-main'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
         <div class="padding" >
           <div v-if="arg.event.title">
             {{ arg.event.title ? '[ ' + arg.event.title + ' ]' : '' }}
           </div>
           <div>
             {{ arg.timeText }} {{ arg.event.extendedProps.content }}
           </div>
           <div v-if="arg.event.extendedProps.remarks">
             备注：{{ arg.event.extendedProps.remarks }}
           </div>
         </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import cnLocale from '@fullcalendar/core/locales/zh-cn'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        locale: cnLocale, // 转换为中文文字
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin
        ],
        themeSystem: 'bootstrap5',
        headerToolbar: {
          left: 'prev,next today', // prev上 next下 today 当前
          center: 'title', // 中间日期标题
          right: 'timeGridDay,timeGridWeek,dayGridMonth'
        },
        initialView: 'timeGridWeek',
        // 无结束日期 end 表示为 全天日程事件
        initialEvents: [{
          id: 1,
          title: '标题',
          content: '全天内容',
          remarks: '',
          start: '2023-05-18',
          backgroundColor: ''
        }, {
          id: 2,
          title: '标题1',
          content: '内容222',
          remarks: '做好笔记',
          start: '2023-05-17 08:00:00',
          end: '2023-05-17 10:00:00',
          backgroundColor: ''
        }, {
          id: 3,
          title: '标题52',
          content: '内容333',
          remarks: '',
          start: '2023-05-18 11:00:00',
          end: '2023-05-18 12:00:00',
          backgroundColor: ''
        }, {
          id: 4,
          title: '标题3',
          content: '内容444',
          remarks: '',
          start: '2023-05-18 14:00:00',
          end: '2023-05-18 16:00:00',
          backgroundColor: ''
        }, {
          id: 5,
          title: '标题4',
          content: '内容444',
          remarks: '',
          start: '2023-05-20 20:00:00',
          end: '2023-05-21 16:00:00',
          backgroundColor: ''
        }, {
          id: 6,
          title: '标题6',
          content: '内容444',
          remarks: '',
          start: '2023-05-19 14:00:00',
          end: '2023-05-19 16:00:00',
          backgroundColor: ''
        }], // 设置数据
        // 左侧时间格式
        // 左侧轴时间格式
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'lowercase',
          hour12: false, // false设置时间为24小时
        },
        nowIndicator: true, // 是否显示指示当前时间的标记
        eventColor: '#d7d7d7', // 日程事件的背景颜色
        eventBorderColor: '#000000', // 日程事件的边框颜色
        eventTextColor: '#000000', // 日程事件的文字颜色
        editable: true, // 是否可新增/编辑日程事件 即拖拽调整日程事件 点击新增日程事件
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        allDaySlot: true, // 是否显示全天，不显示；设置显示后会在时间网格头部显示
        weekends: true, // 是否显示周末，设为false则不显示周六和周日
        weekNumbers: true, // 是否在日历中显示周次(一年中的第几周)
        select: this.handleDateSelect,
        eventClick: this.handleEventClick, // 点击日程事件，显示详情
        removeEvents: this.removeEvents
      }
    }
  },
  created() {
    this.calendarOptions.initialEvents.map((item) => {
      if (item.start && item.end) {
        let type = this.handleTimeContrast('2023-05-19 11:52:00', item.start, item.end)
        item.backgroundColor = type === 1 ? '#0fb817' : type === 2 ? '#8a8a8a' : '#41fcf6'
      } else {
        // 全天日程
        item.backgroundColor = '#fc4141'
      }
    })
  },
  methods: {
    // 新增数据 即新增新的时间段数据
    handleDateSelect(data) {
      // console.log(data, '选择的时间区域')
      let calendarApi = data.view.calendar
      // 取消选择
      calendarApi.unselect()
      // 新增日程事件 及调取接口新增
      calendarApi.addEvent({
        id: '5',
        title: '标题',
        start: this.handleFormatDate(data.startStr),
        end: this.handleFormatDate(data.endStr),
        allDay: data.allDay // 是否为全天日程事件
      })
    },
    // 点击事件 即显示的数据
    handleEventClick(data) {
      let info = data.event['_def']
      console.log(info, '当前数据')
      console.log(info.publicId, 'id')
      console.log(info.extendedProps, '自定义参数')
    },
    removeEvents(data) {
      console.log(data, '删除')
    },
    // 转换日期格式
    handleFormatDate(str) {
      let arr = str.split('+')
      return arr[0].replace(/T/g, ' ')
    },
    /*
     * 时间对比
     * time  当前时间
     * star  开始时间
     * end   结束时间
     * 未过期 1 已过期 2 跨天 3
     */
    handleTimeContrast(time, star, end) {
      if (end >= time) {
        if (this.handleDateContrast(star, end)) {
          return 1
        } else {
          return 3
        }
      } else {
        if (this.handleDateContrast(star, end)) {
          return 2
        } else {
          return 3
        }
      }
    },
    handleDateContrast(star, end) {
      let arr1 = star.split(' ')
      let arr2 = end.split(' ')
      return arr1[0] === arr2[0]
    }
  }
}
</script>

<style lang='css'>
h2 {
  margin: 0;
  font-size: 16px;
}
ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}
li {
  margin: 1.5em 0;
  padding: 0;
}
b { /* used for event dates/times */
  margin-right: 3px;
}
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}
.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}
.padding {
  width: 100%;
  height: 100%;
  padding: 5px;
  border-radius: 2px;
}
</style>
