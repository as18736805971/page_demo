<template>
  <div class="menu-auth">
    <div class="block" :style="{ height: height }">
      <div class="block-title">
        <div>{{ title }}</div>
      </div>
      <div class="tree-area">
        <el-tree
          ref="tree"
          :data="data"
          node-key="id"
          :default-checked-keys="checked"
          :default-expand-all="true"
          :props="defaultProps"
          show-checkbox
          @check="change"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span class="node-class">
              <img v-if="node.data.level === 4" :src="auth">
              <img v-if="node.data.level === 3" :src="doc">
              <img
                v-if="node.data.level === 2 && node.expanded"
                :src="folder_open"
              >
              <img
                v-if="node.data.level === 2 && !node.expanded"
                :src="folder"
              >
              <img v-if="node.data.level === 1" :src="app">
              {{
                (node.data.level === 4 ? node.data.code + "-" : "") +
                  node.data.label
              }}
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="block" :style="{ height: height }">
      <div class="block-title">
        <div>已选权限列表</div>
        <div class="auth-count">{{ authCount }}</div>
      </div>
      <div>
        <el-collapse v-model="selected_name" accordion>
          <el-collapse-item
            v-for="(item, k) in selected_comp"
            :key="k"
            :title="item.fp_code + '-' + item.fp_name"
            :name="item.fp_id"
          >
            <div>{{ item.fp_desc }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    checked: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: () => '450px'
    },
    title: {
      type: String,
      default: '菜单列表'
    }
  },
  data() {
    return {
      authCount: this.selected.length,
      selected_name: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      app: require('@/assets/icon/app.png'),
      auth: require('@/assets/icon/auth.png'),
      doc: require('@/assets/icon/doc.png'),
      folder: require('@/assets/icon/folder.png'),
      folder_open: require('@/assets/icon/folder_open.png'),
      selected_comp: this.selected
    }
  },
  watch: {
    selected_comp() {
      this.authCount = this.selected_comp.length
    }
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    change(node, data) {
      const selected_node = this.$refs.tree.getCheckedNodes()
      const checked = []
      const selected = []
      selected_node.forEach((item) => {
        if (item.level === 4) {
          checked.push(item.id)
          const tmp = {
            fp_id: item.id,
            fp_name: item.label,
            fp_desc: item.desc,
            fp_code: item.code
          }
          selected.push(tmp)
        }
      })
      this.$emit('updateChecked', checked)
      this.selected_comp = selected
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-auth {
  display: flex;
  justify-content: space-between;
  .block {
    width: 400px;
    height: 450px;
    border: 1px solid #d7f9db;
    border-radius: 4px;
    overflow: auto;
    .block-title {
      height: 38px;
      line-height: 38px;
      padding: 0 16px;
      background-color: #f5f7fa;
      border-bottom: 1px solid #d7f9db;
      color: #313233;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      .auth-count {
        color: #939699;
      }
    }
    .tree-area {
      padding: 16px 16px 0 16px;
      .node-class {
        display: flex;
        align-items: center;
        color: #313233;
        height: 24px;
        img {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
