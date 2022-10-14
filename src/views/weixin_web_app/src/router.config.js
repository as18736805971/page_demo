/**
 * 路由配置模块
 */
import Vue from 'vue';
import Router from 'vue-router';
import { routerMode } from './common/env.js';

const login = () => import("@/pages/login")
const index = () => import("@/pages/index")
const bulletin_board = () => import("@/pages/bulletin_board")
const play_video = () => import("@/pages/xst/play_video")
const sch_vision = () => import("@/pages/xst/sch_vision")
const tzgg_list = () => import("@/pages/tzgg/tzgg_list")
const tzgg_detail = () => import("@/pages/tzgg/tzgg_detail")
const xsqj = () => import("@/pages/xsqj/index")
const xsqj_detail = () => import("@/pages/xsqj/detail")
const mail_list = () => import("@/pages/xsqj/mail_list")
const zy = () => import("@/pages/zy/index")
const xskq = () => import("@/pages/xskq/index")
const xskq_detail = () => import("@/pages/xskq/detail")
const article_detail = () => import("@/pages/article/detail")
const qqdh = () => import("@/pages/qqdh/index")
const role = () => import("@/pages/my/role")
const system_setting = () => import("@/pages/my/system_setting")
const customer_service = () => import("@/pages/my/customer_service")
const question_details = () => import("@/pages/my/question_details")

/**
 * 新增教师端
 */
const teacher_index = () => import("@/pages/index1")
const my_class = () => import("@/pages/teacher/class")
const class_details = () => import("@/pages/teacher/class/details")
const add_student = () => import("@/pages/teacher/class/add_student")
const information = () => import("@/pages/teacher/class/information")
const school_letter = () => import("@/pages/teacher/school")
const switch_roles = () => import("@/pages/teacher/switch_roles")
const school_letter_my = () => import("@/pages/teacher/school/my_index")
const school_letter_add = () => import("@/pages/teacher/school/add")
const school_letter_detail = () => import("@/pages/teacher/school/details")
const select_teacher = () => import("@/components/select_teacher")
const select_teacher1 = () => import("@/components/select_teacher1")
const select_student = () => import("@/components/select_student")
const add_parent = () => import("@/pages/teacher/class/components/add_parent")
const ask_leave = () => import("@/pages/teacher/ask_leave")
const approval_detail = () => import("@/pages/teacher/ask_leave/approval_detail")
const note = () => import("@/pages/teacher/ask_leave/components/note")
const attendance = () => import("@/pages/teacher/attendance")
const att_detail = () => import("@/pages/teacher/attendance/components/detail")
const integral = () => import("@/pages/teacher/integral")
const teacher_vision = () => import("@/pages/teacher/vision")
const teacher_attendance = () => import("@/pages/teacher/teacher_attendance")
const attendance_detail = () => import("@/pages/teacher/teacher_attendance/detail")
const see_detail = () => import("@/pages/teacher/teacher_attendance/see_detail")
const affection = () => import("@/pages/teacher/affection")
const select_class = () => import("@/components/select_class")
const homework = () => import("@/pages/teacher/homework")
const add_homework = () => import("@/pages/teacher/homework/add_work")
const image_index = () => import("@/pages/teacher/acquisition")
const scl_collect = () => import("@/pages/teacher/acquisition/scl_collect")
const tea_collect = () => import("@/pages/teacher/acquisition/tea_collect")

Vue.use(Router)

export default new Router({
	mode: routerMode,
	routes: [
		{
			path: '/login',
			component: login,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/',
			component: index,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/bulletin_board',
			component: bulletin_board,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/play_video',
			component: play_video,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/sch_vision',
			component: sch_vision,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/tzgg_list',
			component: tzgg_list,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/tzgg_detail',
			component: tzgg_detail,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/xsqj',
			component: xsqj,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/xsqj_detail',
			component: xsqj_detail,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/mail_list',
			component: mail_list,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/zy',
			component: zy,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/xskq',
			component: xskq,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/xskq_detail',
			component: xskq_detail,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/article_detail',
			component: article_detail,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/qqdh',
			component: qqdh,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/role',
			component: role,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/system_setting',
			component: system_setting,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/customer_service',
			component: customer_service,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/question_details',
			component: question_details,
			meta: {
				title: '平安家校'
			}
		},
		/**
		 * 新增教师端
		 */
		{
			path: '/tea_index',
			component: teacher_index,
			meta: {
				title: '平安家校'
			}
		},
		{
			path: '/school_letter',
			component: school_letter,
			meta: {
				title: '校信'
			}
		},
		{
			path: '/school_letter_my',
			component: school_letter_my,
			meta: {
				title: '我发送的'
			}
		},
		{
			path: '/school_letter_detail',
			component: school_letter_detail,
			meta: {
				title: '校信详情'
			},
		},
		{
			path: '/school_letter_add',
			component: school_letter_add,
			meta: {
				title: '新增校信',
			}
		},
		{
			path: '/select_teacher',
			component: select_teacher,
			meta: {
				title: '选择教师'
			}
		},
		{
			path: '/select_teacher1',
			component: select_teacher1,
			meta: {
				title: '选择教师'
			}
		},
		{
			path: '/select_student',
			component: select_student,
			meta: {
				title: '选择学生'
			}
		},
		{
			path: '/my_class',
			component: my_class,
			meta: {
				title: '我的班级'
			}
		},
		{
			path: '/class_details',
			component: class_details,
			meta: {
				title: '我的班级'
			}
		},
		{
			path: '/add_student',
			component: add_student,
			meta: {
				title: '添加学生'
			}
		},
		{
			path: '/information',
			component: information,
			meta: {
				title: '学生信息'
			}
		},
		{
			path: '/switch_roles',
			component: switch_roles,
			meta: {
				title: '切换角色'
			}
		},
		{
			path: '/add_parent',
			component: add_parent,
			meta: {
				title: '添加家长'
			}
		},
		{
			path: '/ask_leave',
			component: ask_leave,
			meta: {
				title: '学生请假'
			}
		},
		{
			path: '/approval_detail',
			component: approval_detail,
			meta: {
				title: '请假详情'
			}
		},
		{
			path: '/note',
			component: note,
			meta: {
				title: '备注'
			}
		},
		{
			path: '/attendance',
			component: attendance,
			meta: {
				title: '考勤'
			}
		},
		{
			path: '/att_detail',
			component: att_detail,
			meta: {
				title: '考勤详情'
			}
		},
		{
			path: '/integral',
			component: integral,
			meta: {
				title: '我的积分'
			}
		},
		{
			path: '/teacher_vision',
			component: teacher_vision,
			meta: {
				title: '校视通'
			}
		},
		{
			path: '/teacher_attendance',
			component: teacher_attendance,
			meta: {
				title: '教师考勤'
			}
		},
		{
			path: '/attendance_detail',
			component: attendance_detail,
			meta: {
				title: '考勤列表'
			}
		},
		{
			path: '/see_detail',
			component: see_detail,
			meta: {
				title: '考勤详情'
			}
		},
		{
			path: '/affection',
			component: affection,
			meta: {
				title: '亲情电话'
			}
		},
		{
			path: '/select_class',
			component: select_class,
			meta: {
				title: '班级选择'
			}
		},
		{
			path: '/homework',
			component: homework,
			meta: {
				title: '作业'
			}
		},
		{
			path: '/add_homework',
			component: add_homework,
			meta: {
				title: '发布作业'
			}
		},
		{
			path: '/image_index',
			component: image_index,
			meta: {
				title: '照片采集'
			}
		},
		{
			path: '/scl_collect',
			component: scl_collect,
			meta: {
				title: '学生列表'
			}
		},
		{
			path: '/tea_collect',
			component: tea_collect,
			meta: {
				title: '教师列表'
			}
		},
	]
})
