<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="editVisible = true">
            <svg-icon icon-class="add_school" />新增教育局
          </span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.keyword" placeholder="搜索教育局名称" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content_view">
      <!-- 搜索条件 -->
      <div class="search_criteria">
        <el-select v-model="search.provinceCode" class="select_provinces" placeholder="选择省份" clearable @change="handleGetNext(1)">
          <el-option
            v-for="item in provinces_list"
            :key="item.area_code"
            :label="item.area_name"
            :value="item.area_code"
          />
        </el-select>
        <el-select v-model="search.cityCode" class="select_provinces" placeholder="选择地市" clearable @change="handleGetNext(2)">
          <el-option
            v-for="item in cities_list"
            :key="item.area_code"
            :label="item.area_name"
            :value="item.area_code"
          />
        </el-select>
        <el-select v-model="search.countyCode" class="select_provinces" clearable placeholder="选择县区">
          <el-option
            v-for="item in county_list"
            :key="item.area_code"
            :label="item.area_name"
            :value="item.area_code"
          />
        </el-select>
        <span class="spp-btn spp-btn-primary" @click="queryData()">搜索</span>
        <span class="spp-btn" @click="resetData()">重置</span>
      </div>
      <!-- 表格 -->
      <el-table ref="table" :data="education_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="教育局名称" prop="edu_name" align="left" />
        <el-table-column label="地区" prop="province_name" width="130" align="left" />
        <el-table-column label="地市" prop="area_name" width="130" align="left" />
        <el-table-column label="县区" prop="county_name" width="130" align="left" />
        <el-table-column label="地址" prop="edu_address" width="250" align="left" />
        <el-table-column label="教育局管理员" prop="msg_user_id" width="200" align="left" />
        <el-table-column label="创建时间" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.bind != -1" type="text" @click="handleBoundSchool(scope.row)">绑定学校</el-button>
            <el-button v-if="auth.menu != -1" type="text" @click="handleAuth(scope.row)">管理权限</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑教育局 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="editVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="教育局名称：" prop="edu_name">
          <el-input v-model="form.edu_name" placeholder="请输入教育局名称" />
        </el-form-item>
        <el-form-item label="省级：" prop="province_code">
          <el-select v-model="form.province_code" class="select_provinces" placeholder="选择省份" @change="handleGetNext(3)">
            <el-option
              v-for="item in provinces_list"
              :key="item.area_code"
              :label="item.area_name"
              :value="item.area_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="市级：" prop="area_code">
          <el-select v-model="form.area_code" class="select_provinces" placeholder="选择地市" @change="handleGetNext(4)">
            <el-option
              v-for="item in cities_list"
              :key="item.area_code"
              :label="item.area_name"
              :value="item.area_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="县区：" prop="county_code">
          <el-select v-model="form.county_code" class="select_provinces" placeholder="选择县区">
            <el-option
              v-for="item in county_list"
              :key="item.area_code"
              :label="item.area_name"
              :value="item.area_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址：" prop="edu_address">
          <el-input v-model="form.edu_address" :rows="3" resize="none" type="textarea" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="服务类型：" prop="service_type">
          <el-radio-group v-model="form.service_type">
            <el-radio :label="0">教育局统一采购</el-radio>
            <el-radio :label="1">学校单独采购</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="教育局坐标：" prop="edu_coordinate">
          <span class="spp-btn" @click="mapVisible = true">选择坐标</span>
          <span class="coords-txt">{{ form.edu_coordinate }}</span>
        </el-form-item>
        <el-form-item v-if="form.type === 'add'" label="管理员姓名：" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item v-if="form.type === 'add'" label="管理员电话：" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入管理员电话" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
    <!-- 选择地选择坐标 -->
    <el-dialog
      title="选择坐标"
      :append-to-body="true"
      :visible="mapVisible"
      :custom-class="'default-big-size'"
      :close-on-click-modal="false"
      @close="handleCancelCoords"
    >
      <select-coords v-if="mapVisible" :coords-type="4" :markers.sync="markers" :center="center" @clickCoords="handleCoords" @getLocation="handleGetLocation" />
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="mapVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleSelectCoords()">保存</span>
      </span>
    </el-dialog>
    <!-- 管理权限 -->
    <el-dialog title="管理权限" :append-to-body="true" :visible.sync="authVisible" :custom-class="'default-big-size'" :close-on-click-modal="false">
      <div class="select-content">
        <div class="panel">
          <div class="header">权限列表</div>
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 280px">
            <el-tree ref="tree" node-key="menu_id" :data="menu_list" show-checkbox :props="{ children: 'child_menu', label: 'menu_name' }" @check-change="handleMenuClick">
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <img v-if="data.menu_type != 3" class="file-icon" src="../../../assets/images/file.png">
                <img v-else class="file-icon" src="../../../assets/images/auth_key.png">
                <span class="label-txt" :class="data.menu_type == 3 ? 'txt-active' : ''">{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="panel">
          <div class="header">已选权限列表</div>
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 280px">
            <div class="item-list">
              <div v-for="(item, index) in select_menu" :key="index" class="item">
                <img class="file-icon" src="../../../assets/images/auth_key.png">
                <div class="txt">{{ item.menu_name }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="authVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmitAuth()">保存</span>
      </span>
    </el-dialog>
    <!-- 绑定学校 -->
    <el-dialog title="绑定学校" :append-to-body="true" :visible.sync="schoolVisible" :custom-class="'default-big-size'" :close-on-click-modal="false">
      <div class="select-content">
        <div class="panel">
          <div class="header">学校列表</div>
          <el-input v-model="school_name" class="search_name" placeholder="请输入学校名称" />
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 236px">
            <el-tree ref="school_tree" node-key="scl_id" :data="school_show_list" show-checkbox :props="{ label: 'scl_name' }" @check-change="handleSchoolClick">
              <span slot-scope="{ node }" class="custom-tree-node">
                <svg-icon style="color: #4968ff" class="file-icon" icon-class="school" />
                <span class="label-txt">{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="panel">
          <div class="header">已选学校列表</div>
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 280px">
            <div class="item-list">
              <div v-for="(item, index) in select_school" :key="index" class="item">
                <svg-icon style="color: #4968ff" class="file-icon" icon-class="school" />
                <div class="txt">{{ item.scl_name }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="schoolVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmitSchool()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SelectCoords from '@/components/SelectCoords'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Education',
  components: { Pagination, SelectCoords },
  data() {
    return {
      height: window.innerHeight - 160,
      auth: {},
      center: ['113.731372', '34.768085'],
      markers: [
        {
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: ['113.730000', '34.768000']
        }
      ],
      lnglat: {
        lng: '113.730000',
        lat: '34.768000'
      },
      total: 0,
      school_name: '',
      search: {
        provinceCode: '', // 省份编码
        cityCode: '', // 地市编码
        countyCode: '', // 区县编码
        keyword: '', // 教育局名称
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      provinces_list: [], // 省份
      cities_list: [], // 地市
      county_list: [], // 县区
      education_list: [],
      mapVisible: false,
      editVisible: false,
      authVisible: false, // 管理权限弹框
      schoolVisible: false,
      school_list: [], // 学校列表
      select_school: [], // 已选学校列表
      select_edu_id: '',
      select_edu_ids: [],
      menu_list: [], // 菜单列表
      select_scl_id: '',
      select_menu: [], // 选择的菜单
      select_ids: [], // 选择的菜单
      p_ids: [], // 父级节点
      form: {
        title: '新增教育局',
        type: 'add',
        edu_id: '',
        edu_name: '', // 教育局名称
        province_code: '', // 省份编码
        area_code: '', // 地市编码
        county_code: '', // 区县编码
        edu_address: '', // 学校详细地址
        edu_coordinate: '', // 学校地理坐标
        service_type: 0, // 服务类型：0-教育局统一采购，1-学校单独采购
        userName: '', // 管理员姓名
        userPhone: '' // 管理员电话
      },
      rules: {
        edu_name: [
          { required: true, message: '请输入教育局名称', trigger: 'blur' }
        ],
        province_code: [
          { required: true, message: '请选择省级', trigger: 'blur' }
        ],
        area_code: [
          { required: true, message: '请选择市级', trigger: 'blur' }
        ],
        county_code: [
          { required: true, message: '请选择县区', trigger: 'blur' }
        ],
        edu_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        service_type: [
          { required: true, message: '请选择服务类型', trigger: 'blur' }
        ],
        edu_coordinate: [
          { required: true, message: '请选择地理坐标', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入管理员电话', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    }),
    school_show_list() {
      if (this.school_name !== '') {
        return this.school_list.filter((item) => {
          return item.scl_name.indexOf(this.school_name) > -1
        })
      } else {
        return this.school_list
      }
    }
  },
  watch: {
    editVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增教育局' : '编辑教育局'
      }
      if (!val) {
        this.markers = [
          {
            id: 1,
            status: false,
            draggable: false,
            position: ['113.730000', '34.768000'],
            zoomStyleMapping: {
              14: 0,
              15: 0,
              16: 0,
              17: 0,
              18: 0,
              19: 0,
              20: 0
            },
            styles: [{
              icon: {
                img: require('@/assets/images/map_coords.png'),
                size: [18, 22] // 可见区域的大小
              }
            }]
          }
        ]
        this.center = ['113.731372', '34.768085']
        this.search.cityCode = ''
        this.search.countyCode = ''
        this.cities_list = []
        this.county_list = []
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
    },
    authVisible(val) {
      if (!val) {
        this.select_menu = []
        this.select_ids = []
        this.$refs.tree.setCheckedKeys([])
      }
    },
    schoolVisible(val) {
      if (!val) {
        this.select_school = []
        this.select_edu_ids = []
        this.$refs.school_tree.setCheckedKeys([])
      }
    }
  },
  created() {
    this.permissionAuth()
    this.queryData()
    this.handleGetProvince()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/pajx/edu/insert')
      this.auth.update = this.permission.indexOf('/api/pajx/edu/update')
      this.auth.delete = this.permission.indexOf('/api/pajx/edu/delete')
      this.auth.menu = this.permission.indexOf('/api/pajx/scl/role/menu/save')
      this.auth.bind = this.permission.indexOf('/api/pajx/edu/bindEduScl')
    },
    handleGetProvince() {
      httpRequest('/api/sys/area/getProvince', {}, false).then(res => {
        this.provinces_list = JSON.parse(decrypt(res.data))
      })
    },
    handleGetNext(type, edit = false) {
      httpRequest('/api/sys/area/getNext', {
        areaPcode:
          type === 1 ? this.search.provinceCode
            : type === 2 ? this.search.cityCode
              : type === 3 ? this.form.province_code
                : this.form.area_code
      }, false).then(res => {
        if (type === 1) {
          this.search.cityCode = ''
          this.search.countyCode = ''
          this.cities_list = JSON.parse(decrypt(res.data))
        } else if (type === 2) {
          this.search.countyCode = ''
          this.county_list = JSON.parse(decrypt(res.data))
        } else if (type === 3) {
          if (!edit) {
            this.form.area_code = ''
            this.form.county_code = ''
          }
          this.cities_list = JSON.parse(decrypt(res.data))
        } else if (type === 4) {
          if (!edit) {
            this.form.county_code = ''
          }
          this.county_list = JSON.parse(decrypt(res.data))
        }
      })
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    resetData() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    fetchData() {
      httpRequest('/api/pajx/edu/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        this.total = data.total
        this.education_list = data.records
      })
    },
    handleUpdate(item) {
      this.form.type = 'edit'
      httpRequest('/api/pajx/edu/info', {
        eduId: item.edu_id
      }, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        this.form.edu_id = item.edu_id
        this.form.edu_name = data.edu_name
        this.form.province_code = data.province_code
        this.form.area_code = data.area_code
        this.form.county_code = data.county_code
        this.form.edu_address = data.edu_address
        this.form.edu_coordinate = data.edu_coordinate
        this.form.service_type = Number(data.service_type)
        this.handleGetNext(3, true)
        this.handleGetNext(4, true)
        if (data.edu_coordinate) {
          var str = data.edu_coordinate.split(',')
          this.markers[0].position[0] = str[0]
          this.markers[0].position[1] = str[1]
          this.center = [str[0], str[1]]
        }
        this.editVisible = true
      })
    },
    handleCoords(data) {
      this.markers = []
      this.markers.push({
        id: 1,
        top: '0',
        left: '0',
        status: false,
        position: [data.lng, data.lat]
      })
      this.lnglat.lng = data.lng
      this.lnglat.lat = data.lat
    },
    // 取消坐标
    handleCancelCoords() {
      if (this.form.edu_coordinate) {
        var str = this.form.edu_coordinate.split(',')
        this.center = [str[0].toString(), str[1].toString()]
        this.markers[0].position[0] = str[0].toString()
        this.markers[0].position[1] = str[1].toString()
      } else {
        this.center = ['113.731372', '34.768085']
        this.markers[0].position = ['113.730000', '34.768000']
      }
      this.mapVisible = false
    },
    handleSelectCoords() {
      this.form.edu_coordinate = this.lnglat.lng + ',' + this.lnglat.lat
      this.center = [this.lnglat.lng.toString(), this.lnglat.lat.toString()]
      this.markers[0].position[0] = this.lnglat.lng.toString()
      this.markers[0].position[1] = this.lnglat.lat.toString()
      this.mapVisible = false
    },
    handleGetLocation(data) {
      this.center = [data.lng, data.lat]
    },
    handleDel(data) {
      this.$confirm('确认要删除该学校吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/edu/delete', {
          eduId: data.edu_id
        }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var data = {
            edu_name: this.form.edu_name,
            province_code: this.form.province_code,
            area_code: this.form.area_code,
            county_code: this.form.county_code,
            edu_address: this.form.edu_address,
            edu_coordinate: this.form.edu_coordinate,
            service_type: this.form.service_type
          }
          var api = ''
          if (this.form.type === 'add') {
            api = '/api/pajx/edu/insert'
            data.userName = this.form.userName
            data.userPhone = this.form.userPhone
          } else {
            api = '/api/pajx/edu/update'
            data.edu_id = this.form.edu_id
          }
          httpRequest(api, data, false).then((res) => {
            this.editVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryData()
          })
        } else {
          return false
        }
      })
    },
    // 绑定学校
    handleBoundSchool(data) {
      this.select_edu_id = data.edu_id
      httpRequest('/api/pajx/edu/sclList', {
        eduId: this.select_edu_id
      }, false).then(res => {
        var school_list = JSON.parse(decrypt(res.data))
        school_list.map((item) => {
          item.disabled = Number(item.binded) === 2
        })
        this.school_list = school_list
        httpRequest('/api/pajx/edu/bindedScl', {
          eduId: this.select_edu_id
        }, false).then(res => {
          var list = JSON.parse(decrypt(res.data))
          list.map((item) => {
            this.select_edu_ids.push(item.scl_id)
          })
          setTimeout(() => {
            this.$refs.school_tree.setCheckedKeys(this.select_edu_ids)
          }, 500)
          this.schoolVisible = true
        })
      })
    },
    handleSchoolClick() {
      this.select_edu_ids = []
      this.select_school = []
      this.select_edu_ids = this.$refs.school_tree.getCheckedKeys()
      this.select_edu_ids.map((item) => {
        this.school_list.map((vv) => {
          if (item === vv.scl_id) {
            this.select_school.push(vv)
          }
        })
      })
    },
    onSubmitSchool() {
      httpRequest('/api/pajx/edu/bindEduScl', {
        eduId: this.select_edu_id,
        sclIds: this.select_edu_ids.join(',')
      }, false).then(res => {
        this.schoolVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    // 菜单管理列表
    handleAuth(data) {
      this.select_scl_id = data.edu_id
      httpRequest('/api/pajx/scl/role/menu/tree', {}, false).then(res => {
        this.menu_list = this.handleDisabled(JSON.parse(decrypt(res.data)))
        this.p_ids = this.handleDetectionArr(this.menu_list, '', [], 2)
        httpRequest('/api/pajx/scl/role/menu/list', {
          scl_id: this.select_scl_id,
          job_flag: 1
        }, false).then(res => {
          var list = JSON.parse(decrypt(res.data))
          list.map((item) => {
            this.select_ids.push(item.menu_id)
          })
          setTimeout(() => {
            this.$refs.tree.setCheckedKeys(this.select_ids)
          }, 500)
          this.authVisible = true
        })
      })
    },
    // 无子级则禁止选择
    handleDisabled(arr) {
      arr.map((item) => {
        if (Number(item.menu_type) !== 3) {
          if (item.child_menu.length > 0) {
            this.handleDisabled(item.child_menu)
          } else {
            item.disabled = true
          }
        }
      })
      return arr
    },
    // 选择的菜单权限
    handleMenuClick() {
      this.select_ids = []
      this.select_menu = []
      var select_ids = this.$refs.tree.getCheckedKeys()
      select_ids.map((item, index) => {
        if (this.p_ids.indexOf(item) === -1) {
          this.select_ids.push(item)
        }
      })
      this.select_menu = this.handleDetectionArr(this.menu_list, this.select_ids, [], 1)
    },
    // 选择的菜单权限列表
    handleDetectionArr(arr, str, value, type) {
      arr.map((item) => {
        if (type === 1) {
          if (str.indexOf(item.menu_id) > -1) {
            value.push({
              menu_id: item.menu_id,
              menu_name: item.menu_name
            })
          }
        }
        if (Number(item.menu_type) !== 3) {
          if (type === 2) {
            value.push(item.menu_id)
          }
          this.handleDetectionArr(item.child_menu, str, value, type)
        }
      })
      return value
    },
    // 保存管理权限
    onSubmitAuth() {
      var arr = []
      var selected = this.$refs.tree.getCheckedKeys()
      var uncheck = this.$refs.tree.getHalfCheckedKeys()
      arr = arr.concat(uncheck).concat(selected)
      httpRequest('/api/pajx/scl/role/menu/save', {
        scl_id: this.select_scl_id,
        job_flag: 1,
        menu_ids: arr.join(',')
      }, false).then(res => {
        this.authVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coords-txt {
  margin-left: 10px;
}

.select-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .panel {
    width: 312px;
    height: 340px;
    background: #ffffff;
    border: 1px solid #e6e7eb;
    border-radius: 2px;
    overflow: hidden;

    ::v-deep .el-tree-node__content {
      border-radius: 0;
      height: 32px !important;
    }

    ::v-deep .el-tree .el-tree-node__content:hover {
      background: #ffffff;
    }

    .header{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 312px;
      height: 40px;
      background: #f5f6fa;
      border-bottom: 1px solid #e1e3e6;
    }

    .item-list {
      padding: 12px;

      .file-icon {
        margin-right: 7px;
      }

      .item {
        display: flex;
        align-items: center;
        height: 32px;
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        color: #323338;
        line-height: 32px;
        .txt {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

        }
      }
    }

    .custom-tree-node {
      display: flex;
      align-items: center;

      .file-icon {
        width: 16px;
        height: 16px;
        margin-right: 7px;
      }

      .label-txt {
        font-size: 13px;
        color: #323338;
        letter-spacing: 0;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .txt-active {
        color: #1AB9FF;
      }
    }
  }
}

.search_name {
  width: 300px;
  margin: 4px 0 4px 6px;
}
</style>
