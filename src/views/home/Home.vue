<template>
  <el-container class="container">
    <el-aside width="200px" class="aside-view">
      <tree-menu></tree-menu>
    </el-aside>
    <el-container>
      <el-header height="70px" class="header-view">欢迎{{ user_name }}</el-header>
      <el-main class="main-view">
        <router-view :key="$route.path + $route.query.plan"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import jwtDecode from 'jwt-decode'
import TreeMenu from 'components/content/TreeMenu.vue'

export default {
  name: 'Home',
  components: {
    TreeMenu
  },
  data () {
    return {
      user_name: ''
    }
  },
  created () {
    // vuex获取token
    const token = this.$store.state.token
    // 解析token
    const obj = jwtDecode(token)
    this.user_name = obj.user_name
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
.container .aside-view {
  padding-top: 20px;
  background-color: rgb(50, 65, 87);
}
.container .header-view {
  font-size: 36px;
  text-align: center;
  line-height: 70px;
  color: #fff;
  background-color: #242f42;
}
.container .main-view {
  background-image: linear-gradient(#e66465, #9198e5);
}
</style>
