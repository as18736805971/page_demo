<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">风险点分类：</label>
          <el-select
            v-model="riskcontrolObj.risk_type"
            clearable
            placeholder="请选择风险点分类"
          >
            <el-option label="设施风险" value="1" />
            <el-option label="活动风险" value="2" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">风险点名称：</label>
          <el-input v-model="riskcontrolObj.risk_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">风险点等级：</label>
          <el-select
            v-model="riskcontrolObj.risk_rank"
            clearable
            placeholder="请选择风险点等级"
          >
            <el-option label="重大风险" value="1" />
            <el-option label="较大风险" value="2" />
            <el-option label="一般风险" value="3" />
            <el-option label="低风险" value="4" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">是否已有建议措施：</label>
          <el-select
            v-model="riskcontrolObj.has_measures"
            clearable
            placeholder="请选择"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div class="riskcontrol-container spp-no-control">
      <div class="main-body">
        <el-table
          ref="multipleTable"
          :data="controlData"
          style="text-align: center"
        >
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="风险项目" prop="risk_relation_name" />
          <el-table-column label="风险点名称" prop="risk_name" />
          <el-table-column label="风险点位置" prop="building_name" />
          <el-table-column label="风险点分类" prop="risk_type" width="120">
            <template slot-scope="scope">{{
              scope.row.risk_type | riskType
            }}</template>
          </el-table-column>
          <el-table-column label="风险点等级" prop="risk_rank" width="100">
            <template slot-scope="scope">
              <span
                v-show="scope.row.risk_rank === '1'"
                class="risk_label big_risk"
              >重大风险</span>
              <span
                v-show="scope.row.risk_rank === '2'"
                class="risk_label middle_risk"
              >较大风险</span>
              <span
                v-show="scope.row.risk_rank === '3'"
                class="risk_label small_risk"
              >一般风险</span>
              <span
                v-show="scope.row.risk_rank === '4'"
                class="risk_label micro_risk"
              >低风险</span>
            </template>
          </el-table-column>
          <el-table-column label="建议措施" prop="control_measures" width="200">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-tooltip
                  v-for="(item, index) in scope.row.control_measures"
                  :key="index"
                  :content="distabMeasure(item)"
                  placement="top"
                  style="margin-right: 15px"
                >
                  <img
                    v-if="item === '1'"
                    src="../../assets/images/manage.png"
                    alt
                    style="width: 20px"
                  >
                  <img
                    v-if="item === '2'"
                    src="../../assets/images/emergency.png"
                    alt
                    style="width: 20px"
                  >
                  <img
                    v-if="item === '3'"
                    src="../../assets/images/engineering.png"
                    alt
                    style="width: 20px"
                  >
                  <img
                    v-if="item === '4'"
                    src="../../assets/images/Train.png"
                    alt
                    style="width: 20px"
                  >
                  <img
                    v-if="item === '5'"
                    src="../../assets/images/protection.png"
                    alt
                    style="width: 20px"
                  >
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="评估时间" prop="estimate_time" width="170">
            <template slot-scope="scope">{{
              scope.row.estimate_time | fgTime
            }}</template>
          </el-table-column>
          <el-table-column label="评估人" prop="estimate_user_name" width="80" />
          <el-table-column prop="address" label="操作" width="170" fixed="right">
            <template slot-scope="scope">
              <span
                v-if="functionList.includes('A15005')"
                class="edit common_text"
                @click="openDialog(scope.row.risk_id)"
              >管理建议措施</span>
              <span
                v-if="functionList.includes('A15006')"
                class="edit common_text"
                @click="viewDetail(scope.row.risk_id)"
              >详情</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="riskcontrolObj.page_num"
          :limit.sync="riskcontrolObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <!-- 详情模态框 -->
    <el-dialog
      v-if="dialogVisible"
      title="风险点详情"
      :visible.sync="dialogVisible"
      width="720px"
      class="right-all-content risk-control-detail riskcontrol-measures"
    >
      <div class="detailtab_wrapper">
        <el-radio-group v-model="detailTab">
          <el-radio-button
            v-for="(item, k) in detailtab_name"
            :key="k"
            :label="k"
          >{{ item }}</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="detailTab === '1'" class="detail_wrapper">
        <div class="common-item">
          <span class="title">风险项目:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_relation_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险名称:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险类型:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_category_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">项目潜在风险点:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.potential_risk" />
        </div>
        <div class="common-item">
          <span class="title">可能导致后果:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.risk_result" />
        </div>
        <div class="common-item">
          <span class="title">管控措施:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.control_measure" />
        </div>
        <div class="common-item">
          <span class="title">应急措施:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.emergency_measure" />
        </div>
        <div class="common-item">
          <span class="title">风险依据:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.risk_according" />
        </div>
        <div class="common-item">
          <span class="title">风险评估类型:</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '1'"
            class="content"
          >风险矩阵法-1（LS-1）</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '2'"
            class="content"
          >风险矩阵法-2（LS-2）</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '3'"
            class="content"
          >作业条件危险性分析法（LEC）</span>
        </div>
        <div class="common-item">
          <span class="title">风险等级:</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '1'"
            class="content"
          >重大风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '2'"
            class="content"
          >较大风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '3'"
            class="content"
          >一般风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '4'"
            class="content"
          >低风险</span>
        </div>
      </div>
      <div v-if="detailTab === '2'" class="detail_wrapper">
        <div class="common-item">
          <span class="title">管理层级:</span>
          <span class="content">
            <span
              v-if="riskDetailObj.risk_detail.control_level === '1'"
            >校级</span>
            <span
              v-if="riskDetailObj.risk_detail.control_level === '2'"
            >部门级</span>
            <span
              v-if="riskDetailObj.risk_detail.control_level === '3'"
            >组级</span>
            <span
              v-if="riskDetailObj.risk_detail.control_level === '4'"
            >岗位级</span>
          </span>
        </div>
        <div class="common-item">
          <span class="title">责任部门:</span>
          <span class="content">{{
            riskDetailObj.risk_detail.responsible_dept_name
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">责任岗位/责任人:</span>
          <span class="content">{{
            riskDetailObj.risk_detail.responsible_man_name
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">警示标志:</span>
          <div class="warnsign-wrapper">
            <div
              v-for="(opt, index) in riskDetailObj.danger_icon"
              :key="index"
              class="sign-item"
            >
              <el-image
                fit="fill"
                class="sign-image"
                :src="down_url + '/' + opt.icon_url"
                @click="see_pic(down_url + '/' + opt.icon_url)"
              />
            </div>
          </div>
        </div>
        <div class="common-item">
          <span class="title">剩余风险:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.remaining_risk" />
        </div>
      </div>
      <div v-if="detailTab === '3'" class="detail_wrapper">
        <MeasureTab
          :selected-id="riskDetailObj.risk_detail.risk_id"
          :risk-category="categoryObj"
          @viewEmergencyDetail="viewEmergencyDetail"
        />
      </div>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="[pic_url]"
      />
    </el-dialog>
    <!-- 管理建议措施模态框 -->
    <el-drawer
      v-if="showDialog"
      title="管理建议措施"
      :visible.sync="showDialog"
      class="spp-drawer right-noall-content riskcontrol-measures"
      :wrapper-closable="false"
    >
      <el-steps class="step_class" :active="stepActive" align-center>
        <el-step title="风险点详情" />
        <el-step title="基本信息" />
        <el-step title="建议措施" />
      </el-steps>
      <div v-if="stepActive === 1" class="riskcontrol-manage-detail">
        <!-- 风险点详情 -->
        <div class="common-item">
          <span class="title">风险项目:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_relation_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险名称:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">风险类型:</span>
          <span class="content">{{ riskDetailObj.risk_detail.risk_category_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">项目潜在风险点:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.potential_risk" />
        </div>
        <div class="common-item">
          <span class="title">可能导致后果:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.risk_result" />
        </div>
        <div class="common-item">
          <span class="title">管控措施:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.control_measure" />
        </div>
        <div class="common-item">
          <span class="title">应急措施:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.emergency_measure" />
        </div>
        <div class="common-item">
          <span class="title">风险依据:</span>
          <span class="content" v-html="riskDetailObj.risk_detail.risk_according" />
        </div>
        <div class="common-item">
          <span class="title">风险评估类型:</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '1'"
            class="content"
          >风险矩阵法-1（LS-1）</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '2'"
            class="content"
          >风险矩阵法-2（LS-2）</span>
          <span
            v-show="riskDetailObj.risk_detail.estimate_type === '3'"
            class="content"
          >作业条件危险性分析法（LEC）</span>
        </div>
        <div class="common-item">
          <span class="title">风险等级:</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '1'"
            class="content"
          >重大风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '2'"
            class="content"
          >较大风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '3'"
            class="content"
          >一般风险</span>
          <span
            v-show="riskDetailObj.risk_detail.risk_rank === '4'"
            class="content"
          >低风险</span>
        </div>
      </div>
      <div v-if="stepActive === 2" class="riskcontrol-manage-detail">
        <!-- 基本信息 -->
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="管理层级">
            <el-select
              v-model="ruleForm.control_level"
              style="width: 100%"
              clearable
              placeholder="请选择管理层级"
            >
              <el-option label="校级" value="1" />
              <el-option label="部门级" value="2" />
              <el-option label="组级" value="3" />
              <el-option label="岗位级" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="责任岗位">
            <SelectDepartment v-model="ruleForm.responsible_dept" />
          </el-form-item>
          <el-form-item label="责任人">
            <SelectUser
              v-model="ruleForm.responsible_man"
              :multiple="true"
              @getCheckuser="getCheckuser"
            />
          </el-form-item>
          <el-form-item label="警示标志">
            <div class="warnsign-wrapper">
              <div
                v-for="(opt, index) in ruleForm.risk_icon"
                :key="index"
                class="sign-item"
              >
                <el-image
                  fit="fill"
                  class="sign-image"
                  :src="down_url + '/' + opt.icon_url"
                  @click="see_pic(down_url + '/' + opt.icon_url)"
                />
                <div
                  style="
                    text-align: center;
                    width: 100%;
                    position: absolute;
                    bottom: -20px;
                  "
                >
                  <el-button
                    type="text"
                    size="mini"
                    @click="deleteWarnsign(index)"
                  >删除</el-button>
                </div>
              </div>

              <div class="add-WranSign sign-item" @click="addWarnSign">
                <img
                  src="../../assets/images/addWarnSign.png"
                  alt
                  class="add-image"
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="剩余风险">
            <el-input
              v-model="ruleForm.remaining_risk"
              type="textarea"
              :rows="4"
              placeholder="请输入剩余风险"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="stepActive === 3">
        <div class="tab-wrapper">
          <el-radio-group v-model="tabMeasure" @change="switchTabMeasure">
            <el-radio-button label="1">管理措施</el-radio-button>
            <el-radio-button label="2">应急措施</el-radio-button>
            <el-radio-button label="3">工程技术措施</el-radio-button>
            <el-radio-button label="4">培训教育措施</el-radio-button>
            <el-radio-button label="5">个人防护措施</el-radio-button>
          </el-radio-group>
        </div>
        <div class="spp-add-btn" @click="openMeasureDialog">
          新增{{ distabMeasure(tabMeasure) }}
        </div>
        <section class="manage-measure">
          <el-form label-width="120px">
            <div
              v-for="(item, k) in measuresList"
              :key="k"
              class="measures-list manage-measures-list"
              :class="{
                measureshaveborder:
                  countAttachList(item.measure_id).length === 0 &&
                  tabMeasure !== '1',
              }"
            >
              <div class="title">
                <div class="left">
                  <span class="text">{{ item.risk_result }}</span>
                </div>
                <div class="right">
                  <svg-icon
                    icon-class="edit"
                    style="margin-right: 15px; cursor: pointer"
                    @click="openMeasureDialog(item)"
                  />
                  <svg-icon
                    icon-class="delete"
                    style="cursor: pointer"
                    @click="deleteMeasures(item.measure_id)"
                  />
                </div>
              </div>
              <ul class="detail-el-form">
                <li
                  v-for="(opt, index) in item.content"
                  :key="index"
                  class="detail-el-form-item"
                  v-html="opt ? opt.replace(/\n/g, '<br>') : ''"
                />
              </ul>
              <AttachmentList
                v-if="countAttachList(item.measure_id).length > 0"
                :attachment="countAttachList(item.measure_id)"
                :editable="true"
                @deleteAttachment="deleteMeasuresAttach"
              />
              <div
                v-if="tabMeasure === '1'"
                class="control"
                :class="{
                  haveattach: countAttachList(item.measure_id).length > 0,
                }"
              >
                <span
                  class="spp-btn"
                  style="margin-right: 0"
                  @click="editdailypatrol(item.measure_id)"
                >生成日常巡检计划</span>
              </div>
            </div>
          </el-form>
        </section>
        <section v-if="tabMeasure === '2'" class="emergency-measure">
          <div class="title-wrapper">添加应急预案</div>
          <el-form
            ref="emergencyForm"
            :inline="true"
            :model="ruleMeasureForm"
            :rules="rules"
            class="demo-form-inline"
          >
            <el-form-item prop="emer_id">
              <el-cascader
                v-model="ruleMeasureForm.emer_id"
                :props="props"
                clearable
              />
            </el-form-item>
            <span
              class="spp-btn spp-btn-primary"
              style="margin-left: 20px"
              @click="addEmergencyMeasures"
            >添加</span>
          </el-form>
          <el-table
            class="static_table"
            :data="emergency_measure_detail"
            border
          >
            <el-table-column
              prop="plan_name"
              label="应急预案名称"
              width="300"
            />
            <el-table-column prop="risk_category" label="风险类型">
              <template slot-scope="scope">
                <span class="riskcategory">{{
                  categoryObj[scope.row.risk_category]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="plan_start_type" label="启动类型">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.plan_start_type === '1'"
                  class="plan_start_type_first plan_start_type"
                >自启动</span>
                <span
                  v-if="scope.row.plan_start_type === '0'"
                  class="plan_start_type_second plan_start_type"
                >非自启动</span>
              </template>
            </el-table-column>
            <el-table-column prop="response_man_phone" label="内容" width="100">
              <template slot-scope="scope">
                <span
                  style="color: #3399ff; cursor: pointer"
                  @click="viewEmergencyDetail(scope.row.emer_id)"
                >详情</span>
                <div
                  class="tab_del_btn"
                  @click="delEmergencyrelation(scope.row.id)"
                >
                  <svg-icon icon-class="delete" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </div>
      <el-drawer
        title="选择警示标志"
        :append-to-body="true"
        :visible.sync="selectWarnSign"
        :wrapper-closable="false"
        class="spp-child-drawer right-all-content selectwarnsign-dialog"
      >
        <div class="selectwarnsign-main">
          <div
            v-for="(item, index) in selectWarnsignList"
            :key="index"
            class="selectwarnsign-list"
            :class="{ selectsign: item.checked }"
          >
            <img
              :src="down_url + '/' + item.icon_url"
              class="warn-image"
              alt
              @click="selectItemsign(item)"
            >
          </div>
        </div>
        <div class="dialog-btn riskcontrol-btn">
          <span class="spp-btn" @click="selectWarnSign = false">取消</span>
          <span
            class="spp-btn spp-btn-primary"
            @click="sureCheckSign"
          >确定</span>
        </div>
      </el-drawer>
      <!-- 新增管理措施 -->
      <el-drawer
        :title="editMeasureTitle"
        :append-to-body="true"
        :visible.sync="editMeasureDialog"
        class="spp-child-drawer right-noall-content"
        :wrapper-closable="false"
      >
        <el-form
          v-if="editMeasureDialog"
          ref="ruleMeasureForm"
          :model="ruleMeasureForm"
          :rules="rules"
          label-width="100px"
        >
          <!--<el-form-item label="风险类型" prop="risk_category">
            <el-select
              v-model="ruleMeasureForm.risk_category"
              placeholder="请选择风险类型"
              style="width: 320px"
            >
              <el-option
                v-for="(opt, key) in riskDetailObj.risk_detail.risk_category.split(',')"
                :key="key"
                :label="categoryObj[opt]"
                :value="opt"
              />
            </el-select>
          </el-form-item>-->
          <el-form-item label="事件名称" prop="risk_result">
            <el-input
              v-model="ruleMeasureForm.risk_result"
              placeholder="请输入事件名称"
            />
          </el-form-item>
          <el-form-item label="应急措施" prop="stepContent">
            <StepInput :list="ruleMeasureForm.stepContent" />
          </el-form-item>
          <el-form-item
            v-if="editMeasureTitle.includes('新增')"
            label="上传附件"
          >
            <Uploadfile @getFileList="getFileList" />
          </el-form-item>
        </el-form>
        <div class="dialog-btn riskcontrol-btn">
          <span class="spp-btn" @click="editMeasureDialog = false">取消</span>
          <span class="spp-btn spp-btn-primary" @click="addMeasures">确定</span>
        </div>
      </el-drawer>
      <!-- 生成日常巡检计划 -->
      <el-drawer
        title="生成日常巡检计划"
        :append-to-body="true"
        :visible.sync="dailypatrolDialog"
        class="spp-child-drawer right-noall-content"
      >
        <el-form
          ref="ruleMeasureForm"
          :model="ruleMeasureForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="巡查频率" prop="patrol_rate">
            <el-select
              v-model="ruleMeasureForm.patrol_rate"
              placeholder="请选择巡查频率"
            >
              <el-option
                v-for="(opt, key) in patrolrateObj"
                :key="key"
                :label="opt"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog-btn riskcontrol-btn">
          <span class="spp-btn" @click="dailypatrolDialog = false">取消</span>
          <span
            class="spp-btn spp-btn-primary"
            @click="dailypatrol(item)"
          >确定</span>
        </div>
      </el-drawer>
      <div class="dialog-btn riskcontrol-btn">
        <span
          v-show="stepActive !== 1"
          class="spp-btn"
          @click="previousStep"
        >上一步</span>
        <span
          v-show="stepActive !== 3"
          class="spp-btn spp-btn-primary"
          @click="nextStep"
        >下一步</span>
        <span
          v-show="stepActive === 3"
          class="spp-btn spp-btn-primary"
          @click="completeControl"
        >完成</span>
      </div>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="[pic_url]"
      />
    </el-drawer>
    <el-dialog
      title="应急预案详情"
      :visible.sync="showDetailEmergencyDialog"
      width="600px"
      class="draw_dialog"
    >
      <EmergencyDetail
        v-if="showDetailEmergencyDialog"
        :id="selected_id"
        :risk-category="categoryObj"
      />
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import AttachmentList from '@/components/AttachmentList'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import SelectUser from '@/components/SelectUser'
import SelectDepartment from '@/components/SelectDepartment'
import StepInput from '@/components/StepInput'
import EmergencyDetail from '@/components/EmergencyDetail'
import MeasureTab from '@/components/MeasureTab'
import Uploadfile from '@/components/Uploadfile'
import { processAttach } from '@/utils'
import {
  riskCategory,
  controlPaginate,
  gainControlDetail,
  saveRiskResponse,
  saveMeasures,
  updateMeasures,
  deleteMeasures,
  deleteMeasuresAttach,
  getMeasuresList,
  getMeasuresAttach,
  riskPatrolrate,
  dailypatrol,
  getEmergencyrelation,
  addEmergencyrelation,
  delEmergencyrelation,
  getPlanList
} from '@/api/risk_point'
import { getIconList } from '@/api/dangericon'
export default {
  name: 'Riskcontrol',
  components: {
    Pagination,
    AttachmentList,
    ElImageViewer,
    SelectUser,
    SelectDepartment,
    StepInput,
    EmergencyDetail,
    Uploadfile,
    MeasureTab
  },
  data() {
    const self = this
    const validatestepContent = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请填写步骤'))
      } else {
        if (
          !value.every((item) => {
            return item.text
          })
        ) {
          callback(new Error('步骤内容不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      riskcontrolObj: {
        risk_type: '',
        risk_category: '',
        risk_name: '',
        risk_rank: '',
        has_measures: '',
        page_num: 1,
        page_size: 10
      },
      categoryObj: {}, // 风险类型字典
      patrolrateObj: {}, // 风险巡检频率字典
      controlData: [], // 列表数据List
      total: 0,
      riskDetailObj: {
        risk_detail: {},
        control_measures: []
      }, // 详情数据对象
      activeName: ['first', 'second', 'third'],
      dialogVisible: false, // 详情模态框
      showDialog: false, // 管理建议措施模态框
      editMeasureDialog: false, // 新增或者编辑管理措施
      dailypatrolDialog: false,
      showDetailEmergencyDialog: false,
      editMeasureTitle: '',
      selectWarnSign: false, // 选择警示标志模态框
      stepActive: 1,
      ruleForm: {
        control_level: '',
        responsible_dept: '',
        responsible_man: '',
        remaining_risk: '',
        risk_icon: []
      },
      ruleMeasureForm: {
        patrol_rate: '',
        risk_category: '',
        emer_id: '',
        risk_result: '',
        stepContent: []
      },
      rules: {
        control_level: [
          { required: true, message: '请选择管理层级', trigger: 'blur' }
        ],
        patrol_rate: [
          { required: true, message: '请选择巡查频率', trigger: 'blur' }
        ],
        emer_id: [
          { required: true, message: '请选择应急预案', trigger: 'blur' }
        ],
        risk_result: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        stepContent: [
          { required: true, trigger: 'blur', validator: validatestepContent }
        ]
      },
      emergency_measure_detail: [],
      deptResponsList: [], // 责任部门数组
      personResponsList: [], // 责任人数组
      measuresList: [], // 管控措施列表
      attachList: [], // 管控措施附件列表
      checkedImage: null,
      selectWarnsignList: [],
      tabMeasure: '1',
      measure_id: '', // 当前编辑的措施id
      showViewer: false,
      filesData: {},
      selected_id: '',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          self.getPlanList(node, resolve)
        }
      },
      detailTab: '1',
      detailtab_name: {
        1: '风险点详情',
        2: '基本信息',
        3: '管控信息'
      },
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
    this.getCategory()
    this.getRiskPatrolrate()
  },
  methods: {
    see_pic(url) {
      this.pic_url = url
      this.showViewer = true
    },
    closeViewer: function() {
      this.showViewer = false
    },

    // 获取管理措施上传的附件
    getFileList(files) {
      this.filesData = processAttach(files)
    },

    // 获取所有应急预案
    getPlanList(node, resolve) {
      const { level } = node
      const { value } = node
      const nodes = []
      if (level === 0) {
        // this.riskDetailObj.risk_detail.risk_category
        //   .split(',')
        //   .forEach((item) => {
        //     const tmp = {
        //       value: item,
        //       label: this.categoryObj[item],
        //       leaf: false
        //     }
        //     nodes.push(tmp)
        //   })
        // resolve(nodes)
        resolve([])
      } else {
        getPlanList(value).then((response) => {
          const data = response.data
          data.forEach((item) => {
            const tmp = {
              value: item.id,
              label: item.plan_name,
              leaf: true
            }
            nodes.push(tmp)
          })
          resolve(nodes)
        })
      }
    },

    // 获取风险巡检频率字典
    getRiskPatrolrate() {
      riskPatrolrate().then((res) => {
        this.patrolrateObj = res.data
      })
    },

    // 打开添加警示标志模态框
    async addWarnSign() {
      getIconList().then((res) => {
        this.selectWarnsignList = res.data
        this.selectWarnsignList.forEach((opt) => {
          opt.checked = false
        })
        this.selectWarnSign = true
      })
    },

    // 获取风险类型
    getCategory() {
      riskCategory().then((res) => {
        this.categoryObj = res.data
      })
    },

    // 选中责任部门时触发事件
    fSelectDept(id) {
      this.deptResponsList.forEach((item) => {
        if (item.dept_id === id) {
          this.personResponsList = [item]
          this.ruleForm.responsible_man = item.dept_response_man
        }
      })
    },

    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.riskcontrolObj,
        this.$options.data().riskcontrolObj
      )
    },

    searchData() {
      this.riskcontrolObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      const {
        risk_type,
        risk_category,
        risk_name,
        risk_rank,
        has_measures,
        page_num,
        page_size
      } = this.riskcontrolObj
      controlPaginate(
        '',
        risk_type,
        risk_category,
        risk_name,
        risk_rank,
        has_measures,
        page_num,
        page_size
      ).then((res) => {
        this.controlData = res.data.list
        this.controlData.forEach((opt) => {
          if (opt.control_measures) {
            opt.control_measures = Array.from(
              new Set(opt.control_measures.split(','))
            )
          }
        })
        this.total = res.data.totalRow
      })
    },

    // 查看详情
    viewDetail(risk_id) {
      gainControlDetail(risk_id).then((res) => {
        this.riskDetailObj = res.data
        if (this.riskDetailObj.risk_detail.potential_risk && this.isJSON(this.riskDetailObj.risk_detail.potential_risk)) {
          this.riskDetailObj.risk_detail.potential_risk = JSON.parse(this.riskDetailObj.risk_detail.potential_risk).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.risk_result && this.isJSON(this.riskDetailObj.risk_detail.risk_result)) {
          this.riskDetailObj.risk_detail.risk_result = JSON.parse(this.riskDetailObj.risk_detail.risk_result).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.control_measure && this.isJSON(this.riskDetailObj.risk_detail.control_measure)) {
          this.riskDetailObj.risk_detail.control_measure = JSON.parse(this.riskDetailObj.risk_detail.control_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.emergency_measure && this.isJSON(this.riskDetailObj.risk_detail.emergency_measure)) {
          this.riskDetailObj.risk_detail.emergency_measure = JSON.parse(this.riskDetailObj.risk_detail.emergency_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.remaining_risk && this.isJSON(this.riskDetailObj.risk_detail.remaining_risk)) {
          this.riskDetailObj.risk_detail.remaining_risk = JSON.parse(this.riskDetailObj.risk_detail.remaining_risk).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.risk_according && this.isJSON(this.riskDetailObj.risk_detail.risk_according)) {
          this.riskDetailObj.risk_detail.risk_according = JSON.parse(this.riskDetailObj.risk_detail.risk_according).replace(/\n/g, '<br>')
        }
        this.riskDetailObj.control_measures.forEach((item) => {
          item.content = JSON.parse(item.measures_content)
        })
        this.tabMeasure = '1'
        this.switchTabdetail()
        this.detailTab = '1'
        this.dialogVisible = true
      })
    },

    // 打开管控模态框
    openDialog(risk_id) {
      gainControlDetail(risk_id).then((res) => {
        this.riskDetailObj = res.data
        if (this.riskDetailObj.risk_detail.potential_risk && this.isJSON(this.riskDetailObj.risk_detail.potential_risk)) {
          this.riskDetailObj.risk_detail.potential_risk = JSON.parse(this.riskDetailObj.risk_detail.potential_risk).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.risk_result && this.isJSON(this.riskDetailObj.risk_detail.risk_result)) {
          this.riskDetailObj.risk_detail.risk_result = JSON.parse(this.riskDetailObj.risk_detail.risk_result).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.control_measure && this.isJSON(this.riskDetailObj.risk_detail.control_measure)) {
          this.riskDetailObj.risk_detail.control_measure = JSON.parse(this.riskDetailObj.risk_detail.control_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.emergency_measure && this.isJSON(this.riskDetailObj.risk_detail.emergency_measure)) {
          this.riskDetailObj.risk_detail.emergency_measure = JSON.parse(this.riskDetailObj.risk_detail.emergency_measure).replace(/\n/g, '<br>')
        }
        if (this.riskDetailObj.risk_detail.risk_according && this.isJSON(this.riskDetailObj.risk_detail.risk_according)) {
          this.riskDetailObj.risk_detail.risk_according = JSON.parse(this.riskDetailObj.risk_detail.risk_according).replace(/\n/g, '<br>')
        }
        this.stepActive = 1
        this.tabMeasure = '1'
        this.ruleForm = this.riskDetailObj.risk_detail
        this.ruleForm.risk_icon = this.riskDetailObj.danger_icon
        this.ruleForm.responsible_man = this.ruleForm.responsible_man ? this.ruleForm.responsible_man : ''
        this.ruleForm.responsible_man_name = this.ruleForm.responsible_man_name ? this.ruleForm.responsible_man_name : ''
        this.showDialog = true
      })
    },

    // 区分管理措施标识
    distabMeasure(id) {
      let str = ''
      switch (id) {
        case '1':
          str = '管理措施'
          break
        case '2':
          str = '应急措施'
          break
        case '3':
          str = '工程技术措施'
          break
        case '4':
          str = '培训教育措施'
          break
        case '5':
          str = '个人防护措施'
          break
      }
      return str
    },

    // 打开新增或者编辑管理措施模态框
    openMeasureDialog(item) {
      Object.assign(
        this.$data.ruleMeasureForm,
        this.$options.data().ruleMeasureForm
      )
      this.filesData = {}
      !item.measure_id
        ? (this.editMeasureTitle = '新增' + this.distabMeasure(this.tabMeasure))
        : (this.editMeasureTitle =
            '编辑' + this.distabMeasure(this.tabMeasure))
      if (item.measure_id) {
        this.ruleMeasureForm = JSON.parse(JSON.stringify(item))
        const list = JSON.parse(item.measures_content)
        const arr = []
        list.map((item) => {
          arr.push({
            text: item
          })
        })
        this.ruleMeasureForm.stepContent = arr
        this.ruleMeasureForm = JSON.parse(JSON.stringify(this.ruleMeasureForm))
      }
      this.measure_id = item.measure_id
      this.editMeasureDialog = true
    },

    // 选择责任岗位/责任人
    getCheckuser(user) {
      const responsible_man_list = user.map((opt) => {
        return opt[opt.length - 1]
      })
      this.ruleForm.responsible_man = responsible_man_list.join(',')
    },

    // 点击下一步
    nextStep() {
      if (this.stepActive < 3) {
        if (this.stepActive === 2) {
          // 提交基本信息
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              const {
                control_level,
                responsible_dept,
                responsible_man,
                remaining_risk
              } = this.ruleForm
              const icon_id = this.ruleForm.risk_icon
                .map((item) => {
                  return item.icon_id
                })
                .join(',')
              saveRiskResponse(
                this.ruleForm.risk_id,
                control_level,
                responsible_dept,
                responsible_man,
                remaining_risk,
                icon_id
              ).then((res) => {
                this.stepActive++
                this.getMeasuresList()
                this.getMeasuresAttachList()
              })
            } else {
            }
          })
        } else {
          this.stepActive++
        }
      }
    },

    // 点击上一步
    previousStep() {
      if (this.stepActive > 1) {
        this.stepActive--
      }
    },

    // 切换管理措施tab栏
    switchTabMeasure() {
      this.measuresList = []
      this.attachList = []
      this.getMeasuresList()
      this.getMeasuresAttachList()
      if (this.tabMeasure === '2') {
        Object.assign(
          this.$data.ruleMeasureForm,
          this.$options.data().ruleMeasureForm
        )
        this.getEmergencyrelation()
      }
    },

    // 切换详情中的tab栏
    switchTabdetail() {
      this.measuresList = []
      this.attachList = []
      this.riskDetailObj.control_measures.forEach((item) => {
        if (item.measures_type === this.tabMeasure) {
          this.measuresList.push(item)
        }
      })
      this.riskDetailObj.control_measures_attachment.forEach((item) => {
        if (item.measures_type === this.tabMeasure) {
          this.attachList.push(item)
        }
      })
      if (this.tabMeasure === '2') {
        this.getEmergencyrelation()
      }
    },

    // 获取该风险点下的管控措施列表
    getMeasuresList() {
      this.measuresList = []
      getMeasuresList(this.ruleForm.risk_id, this.tabMeasure).then((res) => {
        this.measuresList = res.data
        this.measuresList.forEach((item) => {
          item.content = JSON.parse(item.measures_content)
        })
        this.$forceUpdate()
      })
    },

    // 获取该风险点下的管控措施附件列表
    getMeasuresAttachList() {
      this.attachList = []
      getMeasuresAttach(this.ruleForm.risk_id, this.tabMeasure).then((res) => {
        this.attachList = res.data
        this.$forceUpdate()
      })
    },

    // 获取该风险点下的应急措施列表
    getEmergencyrelation() {
      getEmergencyrelation(this.ruleForm.risk_id).then((res) => {
        this.emergency_measure_detail = res.data
      })
    },

    // 计算该措施下的附件
    countAttachList(id) {
      const newAttachlist = []
      this.attachList.forEach((item) => {
        if (item.mid === id) {
          newAttachlist.push(item)
        }
      })
      return newAttachlist
    },

    // 添加风险点管控
    addMeasures() {
      this.$refs.ruleMeasureForm.validate((valid) => {
        if (valid) {
          const {
            risk_result,
            risk_category,
            stepContent
          } = this.ruleMeasureForm
          const arr_step = []
          stepContent.map((item) => {
            arr_step.push(item.text)
          })
          if (!this.measure_id) {
            saveMeasures(
              this.ruleForm.risk_id,
              risk_category,
              this.tabMeasure,
              risk_result,
              JSON.stringify(arr_step),
              this.ruleForm.responsible_man,
              this.filesData.attachment_url,
              this.filesData.attachment_name,
              this.filesData.attachment_ext
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getMeasuresList()
              this.getMeasuresAttachList()
              this.editMeasureDialog = false
            })
          } else {
            updateMeasures(
              this.measure_id,
              risk_category,
              risk_result,
              this.ruleForm.risk_id,
              this.tabMeasure,
              JSON.stringify(arr_step),
              this.ruleForm.responsible_man
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getMeasuresList()
              this.editMeasureDialog = false
            })
          }
        } else {
          return false
        }
      })
    },

    // 完成风险点管控
    completeControl() {
      this.getData()
      this.showDialog = false
    },

    // 添加应急措施
    addEmergencyMeasures() {
      this.$refs.emergencyForm.validate((valid) => {
        if (valid) {
          const { emer_id } = this.ruleMeasureForm
          addEmergencyrelation(
            this.ruleForm.risk_id,
            emer_id[0],
            emer_id[1]
          ).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getEmergencyrelation()
          })
        } else {
        }
      })
    },

    // 删除应急风险管控措施
    delEmergencyrelation(id) {
      this.$confirm('您确定要删除该应急措施吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delEmergencyrelation(id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getEmergencyrelation()
          })
        })
        .catch(() => {})
    },

    // 删除风险点管控措施
    deleteMeasures(id) {
      this.$confirm('您确定要删除该风险点管控措施吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMeasures(id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getMeasuresList()
          })
        })
        .catch(() => {})
    },

    // 删除风险点管控附件
    deleteMeasuresAttach(item) {
      this.$confirm('您确定要删除该附件吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMeasuresAttach(item.attachment_id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getMeasuresAttachList()
          })
        })
        .catch(() => {})
    },

    // 选择警示标志
    selectItemsign(item) {
      this.selectWarnsignList.forEach((opt) => {
        opt.checked = false
      })
      item.checked = true
      this.checkedImage = item
      this.selectWarnsignList = JSON.parse(
        JSON.stringify(this.selectWarnsignList)
      )
    },

    // 确定选中的警示标志
    sureCheckSign() {
      this.ruleForm.risk_icon.push(this.checkedImage)
      this.selectWarnSign = false
    },

    // 删除所选出来的警示标志
    deleteWarnsign(index) {
      this.ruleForm.risk_icon.splice(index, 1)
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
    },

    editdailypatrol(id) {
      this.measure_id = id
      this.dailypatrolDialog = true
    },

    // 生成日常巡检计划
    dailypatrol() {
      dailypatrol(this.measure_id, this.ruleMeasureForm.patrol_rate).then(
        (res) => {
          this.$message({
            message: '生成成功',
            type: 'success',
            duration: 3000
          })
          this.dailypatrolDialog = false
        }
      )
    },

    // 查看应急预案详情
    viewEmergencyDetail(id) {
      this.selected_id = id
      this.showDetailEmergencyDialog = true
    },

    isJSON(str) {
      if (typeof str === 'string') {
        try {
          const obj = JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.riskcontrol-manage-detail {
  .el-checkbox {
    margin-right: 10px;
  }
  .el-form .el-form-item label {
    text-align: left;
    font-weight: normal;
  }
}
.riskcontrol-measures {
  .riskcontrol-manage-detail {
    .el-form-item .el-select,
    .el-cascader {
      width: 302px;
    }
  }
  .emergency-measure {
    .el-form-item .el-select {
      width: 252px;
    }
  }
  .manage-measure {
    .el-form {
      .el-form-item__label {
        text-align: left;
        font-weight: normal;
      }
      .el-form-item--medium .el-form-item__content {
        line-height: 20px;
        color: #626466;
      }
    }
  }
}

.riskcontrol-container {
  .table-measure {
    width: 200px !important;
  }
}
.detailtab_wrapper {
  .el-radio-group {
    width: 100%;
  }
  .el-radio-button {
    width: 33.3%;
  }
  .el-radio-button--medium .el-radio-button__inner {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.riskcontrol-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(187, 187, 187);
  }
  .common_text {
    font-size: 14px;
    cursor: pointer;
  }
  .edit {
    color: #3399ff;
    margin-left: 10px;
    &:first-of-type {
      margin-left: 0;
    }
  }
}
.filter-container {
  .label {
    width: 130px;
  }
}
.detail_wrapper {
  margin-top: 30px;
}
.risk-warn-sign {
  .title {
    width: 80px;
  }
  .content {
    margin-left: 0;
  }
  .image {
    width: 120px;
    height: 160px;
    margin-left: 10px;
  }
}
.riskcontrol-measures {
  .riskcontrol-manage-detail {
    margin-top: 30px;
  }
  .warnsign-wrapper {
    display: flex;
    flex-wrap: wrap;
    .sign-image {
      width: 122px;
      height: 162px;
    }
  }
  .add-WranSign {
    width: 122px;
    height: 162px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(215, 217, 219, 1);
    position: relative;
    .add-image {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
  .sign-item {
    position: relative;
    margin-right: 10px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 4px;
  }
  .tab-wrapper {
    margin: 30px 0;
    text-align: center;
  }
  .measures-list {
    border: 1px solid rgba(225, 227, 230, 1);
    font-size: 14px;
    color: #313233;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid rgba(225, 227, 230, 1);
      .text {
        font-weight: bold;
      }
    }
    .content {
      padding: 10px;
      min-height: 80px;
      color: #626466;
    }
    .detail-el-form-item {
      padding: 5px 10px 5px 0;
      line-height: 24px;
    }
  }
  .manage-measures-list {
    border: none;
    .title {
      border-bottom: none;
      border: 1px solid rgba(225, 227, 230, 1);
    }
    .detail-el-form {
      padding-left: 30px;
      border: 1px solid rgba(225, 227, 230, 1);
      border-top: none;
      border-bottom: none;
    }
    .control {
      padding: 10px;
      border: 1px solid #e1e3e6;
      text-align: right;
    }
    .haveattach {
      border-top: none;
    }
  }
  .havenoattach {
    border-bottom: 1px solid rgba(225, 227, 230, 1);
  }
  .manage-measure {
    .plan_step {
      margin-bottom: 0;
      border-bottom: none;
    }
  }
  .emergency-measure {
    .title-wrapper {
      font-size: 14px;
      color: #313233;
      margin-bottom: 10px;
    }
  }
  .riskcategory {
    border: 1px solid #f76d02;
    border-radius: 2px;
    color: #f76d02;
    padding: 2px 4px;
  }
  .plan_start_type {
    border-radius: 2px;
    padding: 2px 4px;
  }
  .plan_start_type_first {
    color: #4dcd70;
    border: 1px solid #4dcd70;
  }
  .plan_start_type_second {
    color: #999999;
    border: 1px solid #999999;
  }
}
.riskcontrol-btn {
  text-align: right;
  .spp-btn {
    margin-left: 0;
    margin-right: 20px;
  }
}
.selectwarnsign-dialog {
  .selectwarnsign-main {
    display: flex;
    flex-wrap: wrap;
    .selectwarnsign-list {
      width: 122px;
      height: 162px;
      margin-right: 18px;
      margin-bottom: 15px;
      border: 1px solid rgba(215, 217, 219, 1);
      cursor: pointer;
      border-radius: 4px;
      position: relative;
      .warn-image {
        width: 106px;
        height: 146px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -73px;
        margin-left: -53px;
        border-radius: 4px;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
    .selectsign {
      border: 1px solid rgba(51, 153, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(51, 153, 255, 0.4);
    }
  }
}
.spp-child-drawer {
  .riskcontrol-btn {
    position: absolute;
    width: 100%;
    height: 50px;
    line-height: 50px;
    bottom: 0;
    left: 0;
    width: calc(100% -50px);
    border-top: 1px solid #d3d7db;
  }
}
.risk-control-detail {
  .tab-wrapper {
    margin: 0;
    padding-bottom: 20px;
  }
}
.measureshaveborder {
  border-bottom: 1px solid rgba(225, 227, 230, 1) !important;
}
</style>
<style lang="scss">
.riskcontrol-measures {
  .el-collapse .el-collapse-item__header {
    font-weight: bold;
  }
}
</style>
