<template>
  <div class="app-container page-container right-side-dialog">
    <div style="width: 65%;margin: auto;text-align: center;">
      <div class="title">请选择您要登录的角色</div>
      <div v-for="(item, k) in roles" :key="k" class="role_content">
        <div class="roles_card" @click="choose_role(item)">
          <div class="scl_name">{{ item.login_user_type == '3' ? item.scl_name : item.login_user_type == '6' ? item.edu_name : '' }}</div>
          <div class="role_photo">
            <img src="../../assets/images/photo.png" alt>
          </div>
          <div class="role_name">{{ item.role_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { decrypt } from '@/utils/auth'
export default {
  name: 'Role',
  data() {
    return {
      roles: JSON.parse(decrypt(localStorage.getItem('school_roles')))
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    choose_role(role) {
      this.$store.dispatch('permission/deletePermission').then(res => {
        this.$store.dispatch('user/setRole', role).then(res => {
          sessionStorage.setItem('role', JSON.stringify(role))
          this.$store.dispatch('tagsView/delAllViews').then(() => {}) // 清除页面标签
          this.$router.push({ path: '/' })
        })
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
.title {
  text-align: center;
  margin-top: 10%;
  color: #656565;
  font-size: 20px;
}
.role_content {
  width: 25%;
  display: inline-block;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  .roles_card{
    background: #fff;
    padding: 20px 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .scl_name{
    color: #959599;
  }
  .role_photo{
    margin: 20px;
  }
  .role_photo .img{
    width: 100%;
  }
  .role_name{
    color: #313233;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
