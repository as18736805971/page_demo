<template>
  <div class="ask-leave">
    <div class="tab-list">
      <div class="item-tab" v-for="(item ,index) in tab_list" :key="index" @click="share_box ? '' : handleTab(index)">
        <div class="item" :class="index === activeIndex ? 'active' : ''">{{ item }}
          <div class="tip" v-if="index === 1 && count > 0">{{ count }}</div>
        </div>
        <div class="line" v-if="activeIndex === index"></div>
      </div>
    </div>

    <div class="list-content" :class="activeIndex === 0 ? 'add-list' : activeIndex === 2 ? 'tip-list' : 'default'">
      <template v-if="activeIndex === 0">
        <div class="form-list">
          <div class="list-item margin">
            <div class="label-title">
              <div class="required">*</div>请假学生
            </div>
            <div class="label-right" @click="handleSelectStudent()">
              <div class="desc-txt" :class="stu_obj.stu_id === '' ? '' : 'active'">
                {{ stu_obj.stu_id === '' ? '请选择请假学生' : stu_obj.stu_name }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item margin">
            <div class="label-title">
              <div class="required">*</div>请假类型
            </div>
            <div class="label-right" @click="handleLeaveType()">
              <div class="desc-txt" :class="leave_txt === '' ? '' : 'active'">
                {{ leave_txt === '' ? '请选择请假类型' : leave_txt }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item time">
            <div class="label-title">
              <div class="required">*</div>开始时间
            </div>
            <div class="label-right" @click="handleSelectDate(1)">
              <div class="desc-txt" :class="form.begin_time === '' ? '' : 'active'">
                {{ form.begin_time === '' ? '请选择请假开始时间' : form.begin_time }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item time">
            <div class="label-title">
              <div class="required">*</div>结束时间
            </div>
            <div class="label-right" @click="handleSelectDate(2)">
              <div class="desc-txt" :class="form.end_time === '' ? '' : 'active'">
                {{ form.end_time === '' ? '请选择请假结束时间' : form.end_time }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item margin">
            <div class="label-title">
              <div class="required">*</div>离校时间
            </div>
            <div class="label-right" @click="handleSelectDate(3)">
              <div class="desc-txt" :class="form.leave_time === '' ? '' : 'active'">
                {{ form.leave_time === '' ? '请选择离校时间' : form.leave_time }}
              </div>
              <img class="right-icon" src="../../../assets/arrow_right1.png">
            </div>
          </div>
          <div class="list-item">
            <div class="label-title">
              <div class="required">*</div>请假事由
            </div>
            <div class="label-right"></div>
          </div>
          <div class="item-textarea margin">
            <textarea
              rows="4"
              placeholder="请输入请假事由"
              v-model="form.leave_reason"
              class="textarea"
            />
          </div>

          <div class="list-item">
            <div class="label-title">
              <div class="required">*</div>审批人
              <div class="desc-txt">(点击头像删除)</div>
            </div>
            <div class="label-right"></div>
          </div>
          <div class="approval-list margin">
            <template v-if="rover_list.length > 0">
              <div class="rover-list" v-for="(item, index) in rover_list" :key="index" @click="item.default ? handleAppRoverDel(index) : ''">
                <div class="photo-icon">
                  <img class="add_approve" src="../../../assets/person.png">
                  <div class="name-txt">{{ item.tea_name }}</div>
                </div>
                <img class="arrow_right" src="../../../assets/arrow_right2.png">
              </div>
            </template>
            <div class="photo-icon icon-margin" @click="handleAppRover()">
              <img class="add-icon" src="../../../assets/add_approve.png">
              <div class="name-txt">添加</div>
            </div>
          </div>
        </div>
        <div class="suspend-button">
          <div class="button" @click="onSubmit()">提交申请</div>
        </div>
      </template>
      <template v-if="activeIndex === 1">
        <template v-if="area === 'sc' || area === 'sn'">
          <section class="approval approval_list1" v-if="list.length > 0">
            <div class="list-item" :class="approval_status ? 'flex-list' : ''" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
              <div class="radio-img" v-if="approval_status" @click.stop="handleSelectRadio(item)">
                <img class="radio_icon" :src="item.status ? require('../../../assets/radio_active.png') : require('../../../assets/radio_no.png')">
              </div>
              <div class="radio-right">
                <div class="top space-between">
                  <div class="left">
                    <div class="title">{{ item.cls_show_name ? '(' + item.cls_show_name + ')' : '' }}{{ item.stu_name }}的请假</div>
                    <div class="type">{{ item.leave_type == '0' ? '事假' : item.leave_type == '1' ? '病假' : '其他' }}</div>
                  </div>
                  <div class="right" :class="item.leave_status == '2' ? 'through' : item.leave_status == '1' ? 'audit' : item.leave_status == '3' ? '' : 'cancel'">
                    {{ item.leave_status == '2' ? '审核通过' : item.leave_status == '1' ? '待审核' : item.leave_status == '3' ? '审核未通过' : '已取消' }}
                  </div>
                </div>
                <div class="content">
                  <div class="txt">开始时间：{{ item.begin_time | formatDate }}</div>
                  <div class="txt">结束时间：{{ item.end_time | formatDate }}</div>
                  <div class="txt">离校时间：{{ item.leave_time | formatDate }}</div>
                  <div class="txt">请假事由：{{ item.leave_reason }}</div>
                </div>
                <div class="bottom">{{ item.create_time | formatDate }}</div>
              </div>
            </div>
          </section>
          <section v-else class="main-no-data">
            <img src="../../../assets/no_data.png" alt class="img" />
            <div class="text">暂无内容</div>
          </section>
          <template v-if="area === 'sc' || area === 'sn'">
            <template v-if="manager_flag == '3' || manager_flag == '4'">
              <div v-if="list.length > 0" class="suspend-button">
                <div class="button" @click="handleAllApproval()">一键审批</div>
              </div>
            </template>
          </template>
        </template>
        <template v-else>
          <section v-if="list.length > 0" class="approval approval_list">
            <scroller class="scroller" style="height: calc(100vh - 2.4rem)" ref="loadMore" :refreshText="'上拉加载'" :on-infinite="handleLoadBottom">
              <div class="list-item" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
                <div class="top space-between">
                  <div class="left">
                    <div class="title">({{ item.cls_show_name }}){{ item.stu_name }}的请假</div>
                    <div class="type">{{ item.leave_type == '0' ? '事假' : item.leave_type == '1' ? '病假' : '其他' }}</div>
                  </div>
                  <div class="right" :class="item.leave_status == '2' ? 'through' : item.leave_status == '1' ? 'audit' : item.leave_status == '3' ? '' : 'cancel'">
                    {{ item.leave_status == '2' ? '审核通过' : item.leave_status == '1' ? '待审核' : item.leave_status == '3' ? '审核未通过' : '已取消' }}
                  </div>
                </div>
                <div class="content">
                  <div class="txt">开始时间：{{ item.begin_time | formatDate }}</div>
                  <div class="txt">结束时间：{{ item.end_time | formatDate }}</div>
                  <div class="txt">离校时间：{{ item.leave_time | formatDate }}</div>
                  <div class="txt">请假事由：{{ item.leave_reason }}</div>
                </div>
                <div class="bottom">{{ item.create_time | formatDate }}</div>
              </div>
            </scroller>
          </section>
          <section v-else class="main-no-data">
            <img src="../../../assets/no_data.png" alt class="img" />
            <div class="text">暂无内容</div>
          </section>
        </template>
      </template>
      <template v-if="activeIndex === 2">
        <div class="select-tip" v-if="!search_show">
          <div class="left">
            <div class="left-item" v-for="(item, index) in tab_item" :key="index" @click="handleTabItem(item, index)">
              <div class="left-txt">{{ item.title }}</div>
              <img class="bot-icon" :src="item.status ? require('../../../assets/top.png') : require('../../../assets/bot.png')">
            </div>
          </div>
          <div class="right" @click="handleSearch(true)">
            <img class="search" src="../../../assets/search1.png">
            <div class="search-txt">{{ param.keyword === '' ? '搜索' : param.keyword }}</div>
          </div>
        </div>
        <div class="search-item" v-if="search_show">
          <div class="input-item">
            <img class="search-icon" src="../../../assets/search1.png">
            <img class="cancel-icon" v-if="param.keyword !== ''" @click="param.keyword = ''" src="../../../assets/cancel.png">
            <input class="search-input" v-model="param.keyword" placeholder="搜索姓名" @change="handleGetStudent(2, true)" type="text" />
          </div>
          <div class="cancel" @click="handleSearch(false)">取消</div>
        </div>

        <!-- 下拉选择年级 -->
        <div class="share-box1" @click.stop="handleClose()" v-if="share_box">
          <div class="share-list1">
            <div class="share-item" v-for="(item, index) in select_list" :key="index" @click.stop="handleSelectClass(item, index)">
              <div class="share-txt" :class="item.status ? 'active' : ''">
                {{
                  tabIndex === 0 ?
                  item.gra_show_name ?
                  item.title_show + '（' + item.gra_show_name + '）'
                  : item.title_show
                  : item.title_show
                }}
              </div>
              <img v-if="item.status" class="select-icon" src="../../../assets/select.png">
            </div>
          </div>
        </div>
        <!-- 下拉选择年级 -->
        <section  v-if="list1.length > 0" class="approval">
          <scroller class="scroller" style="height: calc(100vh - 4.8rem)" ref="loadMore1" :refreshText="'上拉加载'" :on-infinite="handleLoadBottom1">
            <div class="list-item" v-for="(item, index) in list1" :key="index" @click="handleDetail(item)">
              <div class="top space-between">
                <div class="left">
                  <div class="title">{{ item.cls_show_name ? '(' + item.cls_show_name + ')' : '' }}{{ item.stu_name }}的请假</div>
                  <div class="type">{{ item.leave_type == '0' ? '事假' : item.leave_type == '1' ? '病假' : '其他' }}</div>
                </div>
                <div class="right" :class="item.leave_status == '2' ? 'through' : item.leave_status == '1' ? 'audit' : item.leave_status == '3' ? '' : 'cancel'">
                  {{ item.leave_status == '2' ? '审核通过' : item.leave_status == '1' ? '待审核' : item.leave_status == '3' ? '审核未通过' : '已取消' }}
                </div>
              </div>
              <div class="content">
                <div class="txt">开始时间：{{ item.begin_time | formatDate }}</div>
                <div class="txt">结束时间：{{ item.end_time | formatDate }}</div>
                <div class="txt">离校时间：{{ item.leave_time | formatDate }}</div>
                <div class="txt">请假事由：{{ item.leave_reason }}</div>
              </div>
              <div class="bottom">{{ item.create_time | formatDate }}</div>
            </div>
          </scroller>
        </section>
        <section v-else class="main-no-data">
          <img src="../../../assets/no_data.png" alt class="img" />
          <div class="text">暂无内容</div>
        </section>
      </template>
    </div>

    <!-- 选择请假类型 -->
    <mt-actionsheet
        :actions="leave_type"
        v-model="leaveShow">
    </mt-actionsheet>

    <!-- 选择日期时间组件 -->
    <mt-datetime-picker
        class="pickerstart"
        ref="picker1"
        :startDate="new Date()"
        type="datetime"
        v-model="begin_time"
        @confirm="handleConfirm(1)"
    >
    </mt-datetime-picker>
    <!-- 选择日期时间组件 -->
    <mt-datetime-picker
        class="pickerstart"
        ref="picker2"
        :startDate="new Date()"
        type="datetime"
        v-model="end_time"
        @confirm="handleConfirm(2)"
    >
    </mt-datetime-picker>
    <!-- 选择日期时间组件 -->
    <mt-datetime-picker
        class="pickerstart"
        ref="picker3"
        :startDate="new Date()"
        type="datetime"
        v-model="leave_time"
        @confirm="handleConfirm(3)"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
  import { Tool } from "@/common/Tool";
  import { mapMutations } from "vuex";
  import { httpFormPostMethod } from '@/common/HttpService'

  export default {
    name: "ask_leave",
    data() {
      return {
        count: 0, // 待审核的个数
        activeIndex: 0, // tab栏索引
        tab_list: ['发起申请', '待我审批', '全部申请'],
        tab_item: [{
          title: '年级',
          status: false,
        },{
          title: '班级',
          status: false,
        },{
          title: '类型',
          status: false,
        }],
        tabIndex: -1,
        classIndex: -1, // 存储选择年级的上索引
        share_box: false,
        search_show: false,
        stu_obj: {
          stu_name: '',
          gra_id: '',
          cls_id: '',
          stu_id: '',
        }, // 选择学生
        form: {
          stu_id: '',
          leave_reason: '', // 请假事由
          begin_time: '', // 开始时间
          end_time: '', // 结束时间
          leave_time: '', // 离校时间
          auditors: '', // 审核人，多个审核人用','分割
          leave_type: '', // 请假类型 0-事假 1-病假 2-其它
        },
        begin_time: new Date(),
        end_time: new Date(),
        leave_time: new Date(),
        leave_type: [{
          name: '事假',
          type: 0,
          method: this.handleSetType
        }, {
          name: '病假',
          type: 1,
          method: this.handleSetType
        }, {
          name: '其它',
          type: 2,
          method: this.handleSetType
        }],
        leaveShow: false,
        leave_txt: '',
        rover_list: [], // 审批人列表
        rover_ids: [], // 审批人ids
        param: {
          gra_id: '', // 年级id
          cls_id: '', // 班级id
          leave_status: '', // 审核状态：1-待审批，2-审批通过，3-审批拒绝，4-撤销
          keyword: '', // 学生姓名
          page_num: 1, //页数，默认是1
          page_size: 10,
          // for_me_flag: 0, // 是否是待我审批的 0-否，1-是
        },
        param1: {
          page_num: 1, //页数，默认是1
          page_size: 10,
          // for_me_flag: 1, // 是否是待我审批的 0-否，1-是
        },
        list: [], // 学生请假列表
        list1: [], // 学生请假列表
        class_list: [], // 年级列表
        type_list: [
          {
            type: 0,
            status: false,
            title_show: '审核通过',
          },
          {
            type: 1,
            status: false,
            title_show: '待审核',
          },
          {
            type: 2,
            status: false,
            title_show: '未通过',
          },
          {
            type: 3,
            status: false,
            title_show: '取消',
          },
          {
            type: 4,
            status: false,
            title_show: '重置选择',
          },
        ],
        select_list: [], // 选择列表
        class_index: -1, // 选择列表索引
        allLoaded: false, // 上拉加载
        nodata: false,
        showTxt: false,
        allLoaded1: false, // 上拉加载
        nodata1: false,
        showTxt1: false,
        area: sessionStorage.getItem('area'),
        approval_status: false, // 一键审批状态
        leave_ids: [], // 一键审批ids
        manager_flag: sessionStorage.getItem('manager_flag'),
      }
    },
    filters: {
      formatDate(value) {
        if (value) {
          let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
          return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
        }
      }
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'ask_leave',
        sign: true,
      });
      this.$selectPass.$off('leave_student')
      this.$selectPass.$on('leave_student',  (res) => {
        this.stu_obj = res
        this.form.stu_id = res.stu_id
        this.handleGetTeacher()
      })
      if (sessionStorage.getItem('area') === 'ha') {
        this.$selectPass.$off('leave_teacher')
        this.$selectPass.$on('leave_teacher',  (res) => {
          res.default = true
          this.rover_list.push(res)
          this.rover_ids.push(res.tea_id)
        })
      } else {
        this.$selectPass.$off('leave_teacher')
        this.$selectPass.$on('leave_teacher',  (res) => {
          res.default = true
          this.rover_list.push(res)
          this.rover_ids.push(res.tea_id)
        })
      }
      this.handleNumber()
      this.handleGetList(this.activeIndex)
    },
    methods: {
      ...mapMutations(['UPDATE_INCLUDE_PAGE']),
      // 获取待审核的个数
      handleNumber() {
        httpFormPostMethod('web/stu/leave/checking/num', {}, false).then((res) => {
          if (this.area === 'sn') {
            this.count = res.data.checking_num || 0
            this.count = this.count > 99 ? 99 : this.count
          } else {
            this.count = res.data.count || 0
            this.count = this.count > 99 ? 99 : this.count
          }
        })
      },
      // 获取学生班主任
      handleGetTeacher() {
        httpFormPostMethod('web/tea/leave/cls/mgr', {
          cls_id: this.stu_obj.cls_id
        }, false).then((res) => {
          this.rover_list = []
          this.rover_ids = []
          if (this.area === 'ha') {
            if (res.data && res.data.length !== 0){
              if (res.data.length !== 0) {
                res.data.map((item) => {
                  item.default = false
                  this.rover_ids.push(item.tea_id)
                })
                this.rover_list.push(res.data)
              } else {
                res.data.default = false
                this.rover_list.push(res.data)
                this.rover_ids.push(res.data.tea_id)
              }
            }
          } else {
            if (res.data) {
              res.data.default = false
              this.rover_list.push(res.data)
              this.rover_ids.push(res.data.tea_id)
            }
          }
        })
      },
      // tab 切换
      handleTab(index) {
        this.activeIndex = index
        if (index === 1) {
          this.list = []
          this.param1.page_num = 1
          this.handleGetStudent(1)
        } else if (index === 2) {
          this.list = []
          this.param.page_num = 1
          this.handleGetStudent(2)
        }
      },
      handleTabItem(item, index) {
        if (index === 0) {
          this.select_list = this.class_list
        } else if (index === 1) {
          if(this.class_index === -1) {
            Tool.tip('请先选择年级')
            return false
          }
          this.select_list = this.class_list[this.class_index].children
        } else {
          this.select_list = this.type_list
        }
        this.tab_item[index].status = !item.status
        this.tabIndex = index
        this.share_box = item.status
        this.tab_item.map((v, k) => {
         if (index !== k) {
           v.status = false
         }
        })
      },
      // 点击下拉列表项
      handleSelectClass(data, index) {
        if (this.tabIndex === 0) {
          this.class_index = this.select_list[index].gra_id === '' ? -1 : index
          this.class_list.map((item) => {
            item.status = false
          })
          this.select_list[index].status = this.select_list[index].gra_id === '' ? false : !this.select_list[index].status
          this.tab_item[this.tabIndex].title = this.select_list[index].gra_id === '' ? '年级' : this.select_list[index].title_show + '年级'
          this.param.gra_id = this.select_list[index].gra_id === '' ? '' : this.select_list[index].gra_id
          // 重新选择年级  清空班级
          if (this.param.cls_id !== '') {
            this.param.cls_id = ''
            this.tab_item[1].title = '班级'
            if (this.classIndex !== -1) {
              this.class_list[this.classIndex].children.map((item) => {
                item.status = false
              })
            }
          }
          this.classIndex = index

          // 重置年级
          if (this.select_list[index].gra_id === '') {
            this.class_list[index].children.map((vv) => {
              vv.status = false
            })
            this.tab_item[1].title = '班级'
            this.param.cls_id = ''
            this.classIndex = -1
          }
        } else if (this.tabIndex === 1) {
          this.class_list.map((item) => {
            item.children.map((vv) => {
              vv.status = false
            })
          })
          this.select_list[index].status = !this.select_list[index].status
          this.tab_item[this.tabIndex].title = this.select_list[index].title_show
          this.param.cls_id = this.select_list[index].cls_id
        } else {
          this.select_list.map((item) => {
            item.status = false
          })
          this.select_list[index].status = this.select_list[index].type === 4 ? false :  !this.select_list[index].status
          this.tab_item[this.tabIndex].title = this.select_list[index].type === 4 ? '类型' : this.select_list[index].title_show
          this.param.leave_status = this.select_list[index].type === 4 ? '' :  this.select_list[index].type
        }
      },
      // 获取学生请假列表
      handleGetStudent(type, status) {
        if (type === 2 && status) {
          this.param.page_num = 1
        }
        let data = type === 1 ? {}  : JSON.parse(JSON.stringify(this.param))
        if (type === 1 && this.area === 'ha') {
          data = JSON.parse(JSON.stringify(this.param1))
        }
        if (type === 2) {
          if (data.leave_status != '') {
            data.leave_status = data.leave_status == 0 ? 2 : data.leave_status == 1 ? 1 :data.leave_status == 2 ? 3 : 4
          }
        }
        let api = type === 1 ? 'web/stu/leave/mylist' : 'web/stu/leave/tea/paginate'
        httpFormPostMethod(api, data).then((res) => {
          let list = res.data.list || []
          if (type === 1) {
            if (this.area === 'ha') {
              if (this.param1.page_num === 1) {
                this.list = []
              }
              this.list = this.list.concat(list)
              this.showTxt = this.list.length < 10
              this.nodata = list.length === 0
              this.allLoaded = this.nodata
              this.$nextTick(() => {
                this.$refs.loadMore1.finishInfinite(false)
              })
            } else {
              res.data.map((item) => {
                item.status = false
              })
              this.list = res.data
            }
          } else {
            if (this.param.page_num === 1) {
              this.list1 = []
            }
            this.list1 = this.list1.concat(list)
            this.showTxt1 = this.list.length < 10
            this.nodata1 = list.length === 0
            this.allLoaded1 = this.nodata1
            this.$nextTick(() => {
              this.$refs.loadMore1.finishInfinite(false)
            })
          }
        })
      },
      // 获取年级列表
      handleGetList() {
        httpFormPostMethod('web/cls/cascade', {}).then((res) => {
          let gra_list = []
          let gra_id = ''
          res.data.map((item) => {
            if (gra_id !== item.gra_id) {
              gra_id = item.gra_id
              gra_list.push({
                status: false,
                gra_id: item.gra_id,
                gra_show_name: item.gra_show_name,
                title_show: item.gra_name,
                children: []
              })
            }
          })
          gra_list.map((vv) => {
            res.data.map((vvv) => {
              if (vvv.gra_id === vv.gra_id) {
                vvv.status = false
                vvv.title_show = vvv.cls_show_name
                vv.children.push(vvv)
              }
            })
          })
          gra_list.push({
            status: false,
            gra_id: '',
            title_show: '重置选择',
            children: []
          })
          this.class_list = gra_list
        })
      },
      // 关闭下拉选择
      handleClose() {
        this.param.page_num = 1
        this.tabIndex = -1
        this.share_box = false
        this.tab_item.map((item) => {
          item.status = false
        })
        this.handleGetStudent(2, true)
      },
      // 显示搜索框
      handleSearch(status) {
        this.search_show = status
        if (!status) {
          if (this.param.keyword === '') {
            this.handleGetStudent(2, true)
          }
        }
      },
      // 选择学生
      handleSelectStudent() {
        this.$router.push({
          path: 'select_student',
          query: {
            type: 2,
          }
        })
      },
      // 选择审批人
      handleAppRover() {
        if (this.stu_obj.stu_id === '') {
          Tool.tip('请先选择请假学生')
          return false
        } else {
          if (sessionStorage.getItem('area') === 'ha') {
            this.$router.push({
              path: 'select_teacher',
              query: {
                type: 2,
              }
            })
          } else {
            this.$router.push({
              path: 'select_teacher1',
              query: {
                type: 2,
              }
            })
          }
        }
      },
      handleAppRoverDel(index) {
        this.rover_list.splice(index, 1)
        this.rover_ids.splice(index, 1)
      },
      // 选择请假类型
      handleLeaveType() {
        this.leaveShow = true
      },
      handleSetType(data) {
        this.leave_txt = data.name
        this.form.leave_type = data.type
      },
      // 选择日期
      handleSelectDate(type) {
        type === 1 ?
          this.$refs.picker1.open()
        : type === 2 ?
          this.$refs.picker2.open()
        :type === 3 ?
          this.$refs.picker3.open()
        : ''
      },
      handleConfirm(type) {
        type === 1 ?
          this.form.begin_time = Tool.formate(this.begin_time, "yyyy-MM-dd hh:mm")
        : type === 2 ?
          this.form.end_time = Tool.formate(this.end_time, "yyyy-MM-dd hh:mm")
        :type === 3 ?
          this.form.leave_time = Tool.formate(this.leave_time, "yyyy-MM-dd hh:mm")
        : ''
      },
      // 上拉加载
      handleLoadBottom() {
        if (!this.nodata) {
          this.param1.page_num++
          this.handleGetStudent(1)
        } else {
          this.$refs.loadMore.finishInfinite(true)
        }
      },
      handleLoadBottom1() {
        if (!this.nodata1) {
          this.param.page_num++
          this.handleGetStudent(2)
        } else {
          this.$refs.loadMore1.finishInfinite(true)
        }
      },
      // 请假提交
      onSubmit() {
        let data = JSON.parse(JSON.stringify(this.form))

        if (data.stu_id === '') {
          Tool.tip('请选择请假学生')
          return false
        }
        if (data.leave_type === '') {
          Tool.tip('请选择请假类型')
          return false
        }
        if (data.begin_time === '') {
          Tool.tip('请选择请假开始时间')
          return false
        }
        if (data.end_time === '') {
          Tool.tip('请选择请假结束时间')
          return false
        } else {
          if (data.begin_time >= data.end_time) {
            Tool.tip('结束时间不能小于开始时间')
            return false
          }
        }
        if (data.leave_time === '') {
          Tool.tip('请选择离校时间')
          return false
        } else {
          if (data.leave_time >= data.end_time) {
            Tool.tip('离校时间不能大于结束时间')
            return false
          }
        }
        if (data.leave_reason === '') {
          Tool.tip('请输入请假事由')
          return false
        }
        if (this.rover_ids.length < 0) {
          Tool.tip('请选择审批人')
          return false
        }

        // 河南选择教师id参数 auditors 四川选择教师id参数check_user_id
        if (sessionStorage.getItem('area') === 'ha') {
          data.auditors = this.rover_ids.join(',')
        } else {
          data.check_user_id = this.rover_ids.join(',')
        }
        data.begin_time = Tool.handleFormatStr(data.begin_time)
        data.end_time = Tool.handleFormatStr(data.end_time)
        data.leave_time = Tool.handleFormatStr(data.leave_time)

        httpFormPostMethod('web/stu/leave/tea/save', data).then((res) => {
          if (res.status == 200) {
            Tool.tip('申请成功', 2000 ,() => {
              this.activeIndex = 1
              this.stu_obj = {
                stu_name: '',
                gra_id: '',
                cls_id: '',
                stu_id: '',
              }
              this.form = {
                stu_id: '',
                leave_reason: '', // 请假事由
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
                leave_time: '', // 离校时间
                auditors: '', // 审核人，多个审核人用','分割
                leave_type: '', // 请假类型 0-事假 1-病假 2-其它
              }
              this.begin_time = new Date()
              this.end_time = new Date()
              this.leave_time = new Date()
              this.rover_list = []
              this.rover_ids = []
              this.leaveShow = false
              this.leave_txt = ''
              this.list = []
              this.handleGetStudent(1)
            })
          } else {
            Tool.tip(res.message)
          }
        })
      },
      handleSelectRadio(data) {
        data.status = !data.status
        this.leave_ids = []
      },
      // 一键审批
      handleAllApproval() {
        if (this.approval_status) {
          this.list.map((item) => {
            if (item.status) {
              this.leave_ids.push(item.leave_id)
            }
          })
        }
        if (this.leave_ids.length > 0) {
          Array.from(new Set(this.leave_ids))
          Tool.alert('您确定要一键审批当前学生吗？', '审批提示', true, () => {
            httpFormPostMethod('web/stu/leave/one/check', {
              leave_ids: this.leave_ids.join(','),
              audit_status: 2
            }).then(() => {
              this.approval_status = false
              this.leave_ids = []
              Tool.tip('一键审批通过', 2000, () => {
                this.list = []
                this.handleGetStudent(1)
                this.handleNumber()
              })
            })
          }, () => {
            httpFormPostMethod('web/stu/leave/one/check', {
              leave_ids: this.leave_ids.join(','),
              audit_status: 3
            }).then(() => {
              this.approval_status = false
              this.leave_ids = []
              Tool.tip('一键审批拒绝', 2000, () => {
                this.list = []
                this.handleGetStudent(1)
                this.handleNumber()
              })
            })
          },true,'通过', '拒绝')
        } else {
          this.approval_status = !this.approval_status
        }
      },
      handleDetail(data) {
        this.$router.push({
          path: 'approval_detail',
          query: {
            leave_id: data.leave_id,
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .ask-leave {
    .tab-list {
      width: 100%;
      height: 2.4rem;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 2.3rem;
        font-size: 0.8rem;
        font-weight: 400;
        color: #999999;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.2rem;
        }

        .line {
          width: 2.4rem;
          height: 0.1rem;
          background: #3297ff;
          border-radius: 0.05rem;
        }
      }

      .active {
        font-size: 0.8rem;
        font-weight: 600;
        color: #3399ff;
      }

      .tip {
        margin-left: 0.2rem;
        width: 0.8rem;
        height: 0.8rem;
        background: #f0644d;
        border-radius: 50%;;
        font-size: 0.55rem;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .list-content {
      width: 100%;
      height: calc(100vh - 2.4rem);

      .form-list {
        width: 100%;
        height: calc(100vh - 6.9rem) !important;
        margin-top: 0.5rem;
        overflow-y: auto;

        .margin {
          margin-bottom: 0.5rem;
        }

        .time {
          margin-bottom: 0.05rem;
        }

        .list-item {
          width: 100%;
          height: 2.4rem;
          background: #ffffff;
          padding: 0 0.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .label-title {
            width: 7.5rem;
            height: 2.4rem;
            display: flex;
            align-items: center;

            .required {
              margin-top: 0.3rem;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 0.4rem;
              height: 0.5rem;
              color: #F0644D;
              margin-right: 0.12rem;
            }

            .desc-txt {
              margin-left: 0.4rem;
              font-size: 0.6rem;
              color: #909399;
            }
          }

          .label-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 9.5rem;
            height: 2.4rem;

            .photo-icon {
              width: 2rem;
              height: 2rem;
            }

            .right-icon {
              width: 1.2rem;
              height: 1.2rem;
            }

            .desc-txt {
              font-size: 0.8rem;
              font-weight: 400;
              text-align: right;
              color: #cccccc;
            }

            .input-txt {
              width: 8rem;
              height: 2.4rem;
              font-size: 0.8rem;
              text-align: right;
            }

            .active {
              color: #333333;
            }
          }
        }

        .item-textarea {
          width: 100%;
          height: 5.5rem;
          padding: 0 1.2rem 0.5rem;
          background: #ffffff;

          .textarea {
            width: 100%;
            font-size: 0.8rem;
          }
        }
      }

      .approval-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        height: auto;
        padding: 0 0.8rem 0.8rem;
        background: #ffffff;

        .arrow_right {
          width: 0.6rem;
          height: 0.6rem;
          margin: -1rem 0.4rem 0;
        }

        .photo-icon {
          display: flex;
          flex-direction: column;

          .add_approve {
            width: 2.4rem;
            height: 2.4rem;
            border: 0.05rem solid #e1e4eb;
            border-radius: 50%;
            margin-bottom: 0.2rem;
          }

          .add-icon {
            width: 2.4rem;
            height: 2.4rem;
            margin-bottom: 0.2rem;
          }

          .name-txt {
            width: 2.4rem;
            font-size: 0.7rem;
            color: #5e6166;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .rover-list {
          display: flex;
          align-items: center;
        }
      }

      .suspend-button {
        position: fixed;
        width: 100%;
        height: 4rem;
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
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 400;
          color: #ffffff;
          background: #3399FF;
        }
      }

      .select-tip {
        width: 100%;
        height: 2.4rem;
        background: #ffffff;
        padding: 0 0.6rem 0 1.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          width: 11rem;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left-item {
            height: 1.1rem;
            font-size: 0.7rem;
            font-weight: 400;
            color: #909399;
            display: flex;
            align-items: center;

            .left-txt {
              max-width: 3rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .bot-icon {
              width: 0.6rem;
              height: 0.6rem;
              margin-left: 0.2rem;
            }
          }
        }

        .right {
          width: 5.75rem;
          height: 1.8rem;
          margin-left: 1rem;
          background: #f0f2f5;
          border-radius: 0.2rem;
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 400;
          color: #c4c7cc;

          .search {
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
            margin-right: 0.3rem;
          }

          .search-txt {
            width: 3rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .search-item {
        width: 100%;
        height: 2.4rem;
        background: #ffffff;
        padding: 0 1rem 0 0.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .input-item {
          position: relative;
          width: 14.75rem;
          height: 1.8rem;
        }

        .search-icon {
          position: absolute;
          left: 0.5rem;
          top: 0.4rem;
          width: 1rem;
          height: 1rem;
        }

        .cancel-icon {
          position: absolute;
          right: 0.6rem;
          top: 0.5rem;
          width: 0.8rem;
          height: 0.8rem;
        }

        .search-input {
          width: 14.75rem;
          height: 1.8rem;
          background: #f0f2f5;
          border-radius: 0.2rem;
          padding: 0 1.8rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #333333;
        }

        .cancel {
          width: 1.4rem;
          height: 1.8rem;
          font-size: 0.7rem;
          font-weight: 400;
          text-align: right;
          color: #5e6166;
          line-height: 1.8rem;
        }
      }
    }

    .add-list {
      height: calc(100vh - 2.4rem) !important;
      //height: calc(100vh - 7.3rem) !important;
      //overflow-y: auto;
    }

    .default {
    }

    .tip-list {
      height: 100%;
    }

    .select-down-box {
      height: calc(100vh - 4.8rem) !important;
      overflow: scroll;
    }

    .share-box1 {
      position: fixed;
      top: 4.8rem;
      left: 0;
      width: 100%;
      height: calc(100vh - 4.8rem);
      background-color: rgba(0, 0, 0, 0.5);
      transition: .5s;
      z-index: 999;

      .share-list1 {
        width: 100%;
        max-height: 19rem;
        background: #ffffff;
        overflow-y: auto;

        .share-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 2.8rem;
          background: #ffffff;
          border-top: 0.05rem solid #f0f2f5;
          padding: 0 0.6rem;

          .share-txt {
            width: 7rem;
            height: 1.2rem;
            font-size: 0.8rem;
            font-weight: 400;
            color: #2c2e33;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .active {
            color: #3399FF !important;
          }

          .select-icon {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }
    }
  }

  .approval {
    position: absolute;
    top: 4.8rem;
    width: 100%;
    height: calc(100vh - 4.8rem);
    overflow-y: auto;

    .scroller {
      padding: 0.5rem;
    }

    .space-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .list-item {
      width: 100%;
      background: #ffffff;
      border-radius: 0.2rem;
      padding: 0.5rem;
      margin-bottom: 0.5rem;

      .radio-img {
        width: 1.2rem;
        height: 100%;
        margin-right: 0.5rem;

        .radio_icon {
          width: 1.2rem;
          height: 1.2rem;
        }
      }

      .radio-right {
        width: 100%;
        height: 100%;
      }

      .top {
        width: 100%;
        height: 1.2rem;
        margin-bottom: 0.5rem;

        .left {
          display: flex;
          align-items: center;
          height: 1.2rem;

          .title {
            max-width: 10rem;
            margin-right: 0.4rem;
            font-size: 0.8rem;
            font-weight: 500;
            color: #2c2e33;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .type {
            border: 0.05rem solid #3399ff;
            border-radius: 0.1rem;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.55rem;
            font-weight: 400;
            color: #3399ff;
          }
        }

        .right {
          width: 3.5rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #f0644d;
          text-align: right;
        }
      }

      .content {
        width: 100%;
        font-size: 0.7rem;
        font-weight: 400;
        text-align: left;
        color: #909399;

        .txt {
          height: 1.1rem;
        }
      }

      .bottom {
        width: 100%;
        height: 0.9rem;
        font-size: 0.6rem;
        font-weight: 400;
        text-align: right;
        color: #c4c7cc;
        margin-top: 0.4rem;
      }
    }

    .flex-list {
      display: flex;
      align-items: center;
    }

    .list-item:last-child {
      margin-bottom: 0;
    }

    .through {
      color: #66C46D !important;
    }

    .audit {
      color: #F98700 !important;
    }

    .cancel {
      color: #909399 !important;
    }
  }

  .approval_list {
    top: 2.4rem;
    height: calc(100vh - 2.4rem);
  }

  .approval_list1 {
    top: 2.4rem;
    height: calc(100vh - 6.4rem);
  }
</style>
