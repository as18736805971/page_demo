<template>
  <section>
    <!-- 风险矩阵法（L?S）1 -->
    <div v-show="type === 1" class="matrix-method-first">
      <table class="matrix-table">
        <tr>
          <td rowspan="7" class="title">
            后
            <br>果
            <br>严
            <br>重
            <br>性
          </td>
        </tr>
        <tr class="content">
          <td>4级</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 1 && yaxis === 4}">一般风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 2 && yaxis === 4}">一般风险</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 3 && yaxis === 4}">较大风险</td>
          <td :class="{'red': !levelShow, 'levelred': xaxis === 4 && yaxis === 4}">重大风险</td>
        </tr>
        <tr class="content">
          <td>3级</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 1 && yaxis === 3}">低风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 2 && yaxis === 3}">一般风险</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 3 && yaxis === 3}">较大风险</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 4 && yaxis === 3}">较大风险</td>
        </tr>
        <tr class="content">
          <td>2级</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 1 && yaxis === 2}">低风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 2 && yaxis === 2}">一般风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 3 && yaxis === 2}">一般风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 4 && yaxis === 2}">一般风险</td>
        </tr>
        <tr class="content">
          <td>1级</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 1 && yaxis === 1}">低风险</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 2 && yaxis === 1}">低风险</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 3 && yaxis === 1}">低风险</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 4 && yaxis === 1}">一般风险</td>
        </tr>
        <tr class="content">
          <td colspan="2">1级</td>
          <td>2级</td>
          <td>3级</td>
          <td>4级</td>
        </tr>
        <tr class="content">
          <td colspan="5">事故发生的可能性</td>
        </tr>
      </table>
    </div>
    <!-- 风险矩阵法（L?S）2 -->
    <div v-show="type === 2" class="matrix-method-second">
      <table class="matrix-table">
        <tr class="content">
          <td colspan="2" rowspan="2">风险等级</td>
          <td colspan="7">可能发生的事故后果</td>
        </tr>
        <tr class="content">
          <td>影响特别重大（5）</td>
          <td>影响重大（4）</td>
          <td>影响较大（3）</td>
          <td>影响一般（2）</td>
          <td>影响很小（1）</td>
        </tr>
        <tr class="content">
          <td rowspan="5" style="width: 30px">可<br>能<br>性</td>
          <td>Ⅰ极有可能发生（5）</td>
          <td :class="{'red': !levelShow, 'levelred': xaxis === 5 && yaxis === 5}">25</td>
          <td :class="{'red': !levelShow, 'levelred': xaxis === 4 && yaxis === 5}">20</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 3 && yaxis === 5}">15</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 2 && yaxis === 5}">10</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 1 && yaxis === 5}">5</td>
        </tr>
        <tr class="content">
          <td>Ⅱ很可能发生（4）</td>
          <td :class="{'red': !levelShow, 'levelred': xaxis === 5 && yaxis === 4}">20</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 4 && yaxis === 4}">16</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 3 && yaxis === 4}">12</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 2 && yaxis === 4}">8</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 1 && yaxis === 4}">4</td>
        </tr>
        <tr class="content">
          <td>Ⅲ可能发生（3）</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 5 && yaxis === 3}">15</td>
          <td :class="{'orange': !levelShow, 'levelorange': xaxis === 4 && yaxis === 3}">12</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 3 && yaxis === 3}">9</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 2 && yaxis === 3}">6</td>
          <td>3</td>
        </tr>
        <tr class="content">
          <td>Ⅳ较不可能发生（2）</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 5 && yaxis === 2}">10</td>
          <td :class="{'yellow': !levelShow, 'levelyellow': xaxis === 4 && yaxis === 2}">8</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 3 && yaxis === 2}">6</td>
          <td>4</td>
          <td>2</td>
        </tr>
        <tr class="content">
          <td>Ⅴ基本不可能发生（1）</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 5 && yaxis === 1}">5</td>
          <td :class="{'blue': !levelShow, 'levelblue': xaxis === 4 && yaxis === 1}">4</td>
          <td>3</td>
          <td>2</td>
          <td>1</td>
        </tr>
        <tr class="content">
          <td colspan="7">红色：极高风险等级，橙色：高风险等级，黄色：中风险等级，蓝色：低风险等级。</td>
        </tr>
      </table>
    </div>
    <!-- 教学条件危险性分析评价法（LEC）1 -->
    <div v-show="type === 3" class="matrix-method-third">
      <table class="matrix-table">
        <tr class="content">
          <td>风险值</td>
          <td colspan="2">风险等级</td>
        </tr>
        <tr class="content">
          <td>&gt;320</td>
          <td>1级</td>
          <td :class="{ 'red': !levelShow, 'levelred': xaxis * yaxis > 320 }">重大风险</td>
        </tr>
        <tr class="content">
          <td>160~320</td>
          <td>2级</td>
          <td :class="{ 'orange': !levelShow, 'levelorange': xaxis * yaxis <= 320 && xaxis * yaxis >= 160 }">较大风险</td>
        </tr>
        <tr class="content">
          <td>70~160</td>
          <td>3级</td>
          <td :class="{ 'yellow': !levelShow, 'levelyellow': xaxis * yaxis < 160 && xaxis * yaxis >= 70 }">一般风险</td>
        </tr>
        <tr class="content">
          <td>&lt;70</td>
          <td>4级</td>
          <td :class="{ 'blue': !levelShow, 'levelblue': xaxis * yaxis < 70 }">低风险</td>
        </tr>
      </table>
    </div>
    <!-- 教学条件危险性分析评价法（LEC）2-->
    <div v-show="type === 4" class="matrix-method-third">
      <table class="matrix-table">
        <tr class="content">
          <td>风险值</td>
          <td colspan="2">风险等级</td>
        </tr>
        <tr class="content">
          <td>&gt;160</td>
          <td>不可容许的危险</td>
          <td :class="{ 'red': !levelShow, 'levelred': xaxis * yaxis > 160 }">重大风险</td>
        </tr>
        <tr class="content">
          <td>70~160</td>
          <td>高度</td>
          <td :class="{ 'orange': !levelShow, 'levelorange': xaxis * yaxis <= 160 && xaxis * yaxis >= 70 }">较大风险</td>
        </tr>
        <tr class="content">
          <td>20~70</td>
          <td>中度危险</td>
          <td :class="{ 'yellow': !levelShow, 'levelyellow': xaxis * yaxis < 70 && xaxis * yaxis >= 20 }">一般风险</td>
        </tr>
        <tr class="content">
          <td>&lt;20</td>
          <td>轻度和可容许的危险</td>
          <td :class="{ 'blue': !levelShow, 'levelblue': xaxis * yaxis < 20 }">低风险</td>
        </tr>
      </table>
    </div>
    <!-- 风险矩阵法（L?S）1评估详情 -->
    <div v-show="type === 5" class="assessment-details">
      <div class="title">可能性（L）</div>
      <div>
        <div v-for="(item, index) in firstPossibility" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, firstPossibility)">{{ item.title }}</div>
      </div>
      <div class="title">严重性（S）</div>
      <div>
        <div v-for="(item, index) in firstSerious" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, firstSerious)">{{ item.title }}</div>
      </div>
    </div>
    <!-- 风险矩阵法（L?S）2评估详情 -->
    <div v-show="type === 6" class="assessment-details">
      <div class="title">可能性（L）</div>
      <div>
        <div v-for="(item, index) in secondPossibility" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, secondPossibility)">{{ item.title }}</div>
      </div>
      <div class="title">严重性（S）</div>
      <div>
        <div v-for="(item, index) in secondSerious" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, secondSerious)">{{ item.title }}</div>
      </div>
    </div>
    <!-- 教学条件危险性分析评价法（LEC-1）评估详情 -->
    <div v-show="type === 7" class="assessment-details">
      <div class="title">可能性（L）</div>
      <div>
        <div v-for="(item, index) in thirdPossibility" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, thirdPossibility)">{{ item.title }}</div>
      </div>
      <div class="title">频繁程度（E）</div>
      <div>
        <div v-for="(item, index) in frequency" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, frequency)">{{ item.title }}</div>
      </div>
      <div class="title">严重性（C）</div>
      <div>
        <div v-for="(item, index) in thirdSerious" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, thirdSerious)">{{ item.title }}</div>
      </div>
    </div>
    <!-- 教学条件危险性分析评价法（LEC-2）评估详情 -->
    <div v-show="type === 8" class="assessment-details">
      <div class="title">可能性（L）</div>
      <div>
        <div v-for="(item, index) in fourthPossibility" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, fourthPossibility)">{{ item.title }}</div>
      </div>
      <div class="title">频繁程度（E）</div>
      <div>
        <div v-for="(item, index) in frequency" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, frequency)">{{ item.title }}</div>
      </div>
      <div class="title">严重性（C）</div>
      <div>
        <div v-for="(item, index) in fourthSerious" :key="index" class="details-common" :class="{'checkopt': item.checked}" @click="checkedOpt(item, fourthSerious)">{{ item.title }}</div>
      </div>
    </div>
    <!-- 风险矩阵法（L?S）1评估   查看详情时用到 -->
    <div v-if="type === 9" class="estimate-child-detail">
      <div class="title">可能性（L）</div>
      <div>{{ firstPossibility[4-detailIndex.L]['title'] }}</div>
      <div class="title">严重性（S）</div>
      <div>{{ firstSerious[4-detailIndex.S]['title'] }}</div>
    </div>
    <!-- 风险矩阵法（L?S）2评估   查看详情时用到 -->
    <div v-if="type === 10" class="estimate-child-detail">
      <div class="title">可能性（L）</div>
      <div>{{ secondPossibility[5-detailIndex.L]['title'] }}</div>
      <div class="title">严重性（S）</div>
      <div>{{ secondSerious[5-detailIndex.S]['title'] }}</div>
    </div>
    <!--教学条件危险性分析评价法（LEC-1）  查看详情时用到 -->
    <div v-if="type === 11" class="estimate-child-detail">
      <div class="title">可能性（L）</div>
      <div v-show="parseInt(detailIndex.L) === 10">{{ thirdPossibility[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 6">{{ thirdPossibility[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 3">{{ thirdPossibility[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 1">{{ thirdPossibility[3]['title'] }}</div>
      <div class="title">频繁程度（E）</div>
      <div v-show="parseInt(detailIndex.E) === 10">{{ frequency[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 6">{{ frequency[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 3">{{ frequency[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 2">{{ frequency[3]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 1">{{ frequency[4]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 0.5">{{ frequency[5]['title'] }}</div>
      <div class="title">后果严重性（C）</div>
      <div v-show="parseInt(detailIndex.C) === 50">{{ thirdSerious[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 30">{{ thirdSerious[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 20">{{ thirdSerious[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 10">{{ thirdSerious[3]['title'] }}</div>
    </div>
    <!--教学条件危险性分析评价法（LEC-2）  查看详情时用到 -->
    <div v-if="type === 12" class="estimate-child-detail">
      <div class="title">可能性（L）</div>
      <div v-show="parseInt(detailIndex.L) === 10">{{ fourthPossibility[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 6">{{ fourthPossibility[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 3">{{ fourthPossibility[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.L) === 1">{{ fourthPossibility[3]['title'] }}</div>
      <div v-show="detailIndex.L === 0.5">{{ fourthPossibility[4]['title'] }}</div>
      <div v-show="detailIndex.L === 0.2">{{ fourthPossibility[5]['title'] }}</div>
      <div v-show="detailIndex.L === 0.1">{{ fourthPossibility[6]['title'] }}</div>
      <div class="title">频繁程度（E）</div>
      <div v-show="parseInt(detailIndex.E) === 10">{{ frequency[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 6">{{ frequency[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 3">{{ frequency[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 2">{{ frequency[3]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 1">{{ frequency[4]['title'] }}</div>
      <div v-show="parseInt(detailIndex.E) === 0.5">{{ frequency[5]['title'] }}</div>
      <div class="title">后果严重性（C）</div>
      <div v-show="parseInt(detailIndex.C) === 100">{{ fourthSerious[0]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 40">{{ fourthSerious[1]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 15">{{ fourthSerious[2]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 7">{{ fourthSerious[3]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 3">{{ fourthSerious[4]['title'] }}</div>
      <div v-show="parseInt(detailIndex.C) === 1">{{ fourthSerious[5]['title'] }}</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Matrixarray',
  props: {
    type: {
      required: true,
      type: Number
    },
    levelShow: {
      type: Boolean,
      default: false
    },
    detailIndex: {
      required: false,
      type: Object,
      default: () => {}
    },
    xaxis: {
      required: false,
      type: Number,
      default: () => 0
    },
    yaxis: {
      required: false,
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      firstPossibility: [
        {
          score: 4,
          checked: true,
          title:
            '现场有采取防范、监测、保护、控制措施，曾经发生过安全事故，安全管理不规范，发生安全事故的可能性极大。(4级)'
        },
        {
          score: 3,
          checked: false,
          title:
            '现场有防范、监测、保护、控制措施，但管理人员未有效执行或控制措施不当，可能发生安全事故。(3级)'
        },
        {
          score: 2,
          checked: false,
          title:
            '现场有防范控制措施，如发生安全事故，能有效控制，发生安全事故的可能性很小。(2级)'
        },
        {
          score: 1,
          checked: false,
          title:
            '有充分、有效的防范、控制、监测、保护措施，管理人员安全意识相当高，严格执行操作规程。极不可能发生安全事故。(1级)'
        }
      ],
      secondPossibility: [
        {
          score: 5,
          checked: true,
          title:
            '全国范围内发生频率极高(5级)'
        },
        {
          score: 4,
          checked: false,
          title:
            '全国范围内发生频率较高(4级)'
        },
        {
          score: 3,
          checked: false,
          title:
            '全国范围内发生过，类似区域/行业也偶有发生；评估范围未发生过，但类似区域/行业发生频率较高。(3级)'
        },
        {
          score: 2,
          checked: false,
          title:
            '全国范围内未发生过，类似区域/行业偶有发生。(2级)'
        },
        {
          score: 1,
          checked: false,
          title:
            '全国范围内未发生过，类似区域/行业也极少发生。(1级)'
        }
      ],
      thirdPossibility: [
        {
          score: 10,
          checked: true,
          title:
            '完全可以预料。'
        },
        {
          score: 6,
          checked: false,
          title:
            '相当可能，危害的发生不能被发现；在现场没有采取防范、监测、保护、控制措施；在正常情况下经常发生此类事故、事件。'
        },
        {
          score: 3,
          checked: false,
          title:
            '可能，但不经常；或危害的发生不容易被发现；现场有检测系统或保护措施，在现场有控制措施，但未有效执行或控制措施不当。'
        },
        {
          score: 1,
          checked: false,
          title:
            '可能性小，完全意外；或危害的发生容易被发现；现场有监测系统或曾经作过监测；或过去曾经发生类似事故、事件；或在异常情况下发生过类似事故、事件。'
        }
      ],
      fourthPossibility: [
        {
          score: 10,
          checked: true,
          title:
            '完全可能预料'
        },
        {
          score: 6,
          checked: false,
          title:
            '相当可能'
        },
        {
          score: 3,
          checked: false,
          title:
            '可能，但不经常'
        },
        {
          score: 1,
          checked: false,
          title:
            '可能性小，完全意外'
        },
        {
          score: 0.5,
          checked: false,
          title:
            '很不可能，可能设想'
        },
        {
          score: 0.2,
          checked: false,
          title:
            '极不可能'
        },
        {
          score: 0.1,
          checked: false,
          title:
            '实际不可能'
        }
      ],
      firstSerious: [
        {
          score: 4,
          checked: true,
          title:
            '能造成人员伤亡或造成50万元以上经济损失。(4级)'
        },
        {
          score: 3,
          checked: false,
          title:
            '能造成人员骨折、慢性病等严重伤害或造成10万元以上、50万元以下经济损失。(3级)'
        },
        {
          score: 2,
          checked: false,
          title:
            '能造成人员轻度受伤或造成1万元以上、10万元以下经济损失。(2级)'
        },
        {
          score: 1,
          checked: false,
          title:
            '不符合安全管理要求，能造成设备损坏或造成1万元以下经济损失。(1级)'
        }
      ],
      secondSerious: [
        {
          score: 5,
          checked: true,
          title:
            '造成3人以上死亡或10人以上重伤，造成巨大财产损失，造成极其恶劣的社会舆论和政治影响(5级)'
        },
        {
          score: 4,
          checked: false,
          title:
            '造成严重财产损失，造成恶劣的社会舆论，产生较大的政治影响。(4级)'
        },
        {
          score: 3,
          checked: false,
          title:
            '较大财产损失或赔偿支付，在一定范围内造成不良的舆论影响，产生一定的政治影响。(3级)'
        },
        {
          score: 2,
          checked: false,
          title:
            '造成中度财产损失，有较小的社会舆论，一般不会产生政治影响。(2级)'
        },
        {
          score: 1,
          checked: false,
          title:
            '无伤亡、财产损失轻微，不会造成不良的社会舆论和政治影响。(1级)'
        }
      ],
      thirdSerious: [
        {
          score: 50,
          checked: true,
          title:
            '能造成人员伤亡或造成50万元以上经济损失。'
        },
        {
          score: 30,
          checked: false,
          title:
            '能造成人员骨折、慢性病等严重伤害或造成10万元以上、50万元以下经济损失。'
        },
        {
          score: 20,
          checked: false,
          title:
            '能造成人员伤能造成人员轻度受伤或造成1万元以上、10万元以下经济损失。'
        },
        {
          score: 10,
          checked: false,
          title:
            '不符合安全管理要求，能造成设备损坏或造成1万元以下经济损失。'
        }
      ],
      fourthSerious: [
        {
          score: 100,
          checked: true,
          title:
            '大灾难，许多人死亡'
        },
        {
          score: 40,
          checked: false,
          title:
            '灾难，数人死亡'
        },
        {
          score: 15,
          checked: false,
          title:
            '非常严重，一人死亡'
        },
        {
          score: 7,
          checked: false,
          title:
            '重伤'
        },
        {
          score: 3,
          checked: false,
          title:
            '轻伤'
        },
        {
          score: 1,
          checked: false,
          title:
            '引人关注，不利于基本的安全卫生要求'
        }
      ],
      frequency: [
        {
          score: 10,
          checked: true,
          title:
            '连续暴露'
        },
        {
          score: 6,
          checked: false,
          title:
            '每天工作时间内暴露'
        },
        {
          score: 3,
          checked: false,
          title:
            '每周一次或偶然暴露'
        },
        {
          score: 2,
          checked: false,
          title:
            '每月一次暴露'
        },
        {
          score: 1,
          checked: false,
          title:
            '每年几次暴露'
        },
        {
          score: 0.5,
          checked: false,
          title:
            '非常罕见地暴露'
        }
      ]
    }
  },
  methods: {
    // 父组件点击下一步
    nextTodo() {
      let level = ''
      let score = 0
      let xaxis = 0
      let yaxis = 0
      let estmate_result = {}
      switch (this.type) {
        case 5:
          xaxis = JSON.parse(JSON.stringify(this.processData(this.firstPossibility)))
          yaxis = JSON.parse(JSON.stringify(this.processData(this.firstSerious)))
          estmate_result = {
            L: xaxis,
            S: yaxis
          }
          score = this.processData(this.firstPossibility) * this.processData(this.firstSerious)
          if (score === 16) {
            level = '重大风险'
          } else if (score <= 12 && score >= 9) {
            level = '较大风险'
          } else if (score <= 8 && score >= 4) {
            level = '一般风险'
          } else {
            level = '低风险'
          }
          break
        case 6:
          xaxis = JSON.parse(JSON.stringify(this.processData(this.secondSerious)))
          yaxis = JSON.parse(JSON.stringify(this.processData(this.secondPossibility)))
          score = this.processData(this.secondPossibility) * this.processData(this.secondSerious)
          estmate_result = {
            L: xaxis,
            S: yaxis
          }
          if (score <= 25 && score >= 20) {
            level = '极高风险等级'
          } else if (score < 20 && score >= 12) {
            level = '高风险等级'
          } else if (score < 12 && score >= 8) {
            level = '中风险等级'
          } else {
            level = '低风险等级'
          }
          break
        case 7:
          xaxis = this.processData(this.thirdPossibility) * this.processData(this.thirdSerious)
          yaxis = JSON.parse(JSON.stringify(this.processData(this.frequency)))
          score = this.processData(this.thirdPossibility) * this.processData(this.thirdSerious) * this.processData(this.frequency)
          estmate_result = {
            L: this.processData(this.thirdPossibility),
            E: this.processData(this.frequency),
            C: this.processData(this.thirdSerious)
          }
          if (score > 320) {
            level = '重大风险'
          } else if (score <= 320 && score >= 160) {
            level = '较大风险'
          } else if (score < 160 && score >= 70) {
            level = '一般风险'
          } else {
            level = '低风险'
          }
          break
        case 8:
          xaxis = this.processData(this.fourthPossibility) * this.processData(this.fourthSerious)
          yaxis = JSON.parse(JSON.stringify(this.processData(this.frequency)))
          score = this.processData(this.fourthPossibility) * this.processData(this.fourthSerious) * this.processData(this.frequency)
          estmate_result = {
            L: this.processData(this.fourthPossibility),
            E: this.processData(this.frequency),
            C: this.processData(this.fourthSerious)
          }
          if (score > 160) {
            level = '重大风险'
          } else if (score <= 160 && score >= 70) {
            level = '较大风险'
          } else if (score < 70 && score >= 20) {
            level = '一般风险'
          } else {
            level = '低风险'
          }
          break
      }
      this.$emit('getRiskLevel', {
        level: level,
        xaxis: xaxis,
        yaxis: yaxis,
        estmate_result: estmate_result
      })
    },

    // 处理数据
    processData(array) {
      let score = 0
      array.forEach(item => {
        if (item.checked) {
          score = item.score
        }
      })
      return score
    },

    // 选择某一项
    checkedOpt(opt, list) {
      list.forEach(item => {
        item.checked = false
      })
      opt.checked = true
    }
  }
}
</script>
<style scoped lang='scss'>
.matrix-table {
  width: 100%;
  color: #303133;
  border-collapse: collapse; /*关键代码*/
  border: 1px solid #dfe6ec;
  text-align: center;
  tr,
  th,
  td {
    border: 1px solid #dfe6ec;
  }
  .content {
    height: 40px;
  }
  .red {
    background: #ef5350;
    color: #000000;
    border: 1px solid #ef5350;
  }
  .orange {
    background: #ff8a43;
    color: #000000;
    border: 1px solid #ff8a43;
  }
  .yellow {
    background: #ffd635;
    color: #000000;
    border: 1px solid #ffd635;
  }
  .blue {
    background: #33bcff;
    color: #000000;
    border: 1px solid #33bcff;
  }
}
.assessment-details {
  .title {
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    color: #313233;
    font-size: 14px;
  }
  .details-common {
    padding: 5px 10px;
    line-height: 20px;
    border: 1px solid #dfe6ec;
    background:rgba(245,247,250,1);
    color: #939699;
    margin-top: 10px;
    cursor: pointer;
    &:first-of-type {
      margin-top: 0;
    }
  }
  .checkopt {
    border: 1px solid #3399ff;
    color: #3399ff;
  }
}
.levelyellow {
  background: #ffd635!important;
  color: #000000!important;
  border: 1px solid #ffd635!important;
}
.levelred {
  background: #ef5350!important;
  color: #000000!important;
  border: 1px solid #ef5350!important;
}
.levelblue {
  background: #33bcff!important;
  color: #000000!important;
  border: 1px solid #33bcff!important;
}
.levelorange {
  background: #ff8a43!important;
  color: #000000!important;
  border: 1px solid #ff8a43!important;
}
.estimate-child-detail {
  .title {
    font-weight: bold;
    color: #313233;
  }
}
</style>
