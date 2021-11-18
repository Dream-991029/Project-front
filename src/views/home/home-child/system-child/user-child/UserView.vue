<template>
  <div class="user-view">
    <el-card class="box-card" :body-style="{height: '600px'}">
      <!-- 标题 -->
      <div slot="header" class="clearfix">
        <h2>用户详细信息</h2>
      </div>
      <!-- 搜索框 -->
      <div class="search">
        <el-input
          v-model="user_name"
          placeholder="请输入内容"
          clearable
          @keyup.enter.native="getUserInfoFunc"
        >
          <template slot="prepend">账号</template>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserInfoFunc"
          ></el-button>
        </el-input>
      </div>
      <!-- 用户信息展示区 -->
      <div class="descriptions-view">
        <el-descriptions title="用户信息" :column="3" border>
          <el-descriptions-item label="用户名" :labelStyle="{'text-align': 'center'}" :contentStyle="{'text-align': 'center'}">{{userInfo.user_name}}</el-descriptions-item>
          <el-descriptions-item label="手机号" :labelStyle="{'text-align': 'center'}" :contentStyle="{'text-align': 'center'}">18100000000</el-descriptions-item>
          <el-descriptions-item label="居住地" :labelStyle="{'text-align': 'center'}" :contentStyle="{'text-align': 'center'}">苏州市</el-descriptions-item>
          <el-descriptions-item label="备注" :labelStyle="{'text-align': 'center'}" :contentStyle="{'text-align': 'center'}">学校</el-descriptions-item>
          <el-descriptions-item label="联系地址" :labelStyle="{'text-align': 'center'}" :contentStyle="{'text-align': 'center'}">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo } from 'network/userinfo'

export default {
  name: 'UserView',
  data () {
    return {
      user_name: '',
      userInfo: {}
    }
  },
  methods: {
    getUserInfoFunc () {
      getUserInfo(this.user_name).then(res => {
        if (res.status === 0) {
          this.userInfo = res.data
        } else {
          this.$message.error({
            message: res.msg,
            center: true,
            duration: 1000
          })
        }
      }).catch(err => {
        this.$message.error({
          message: err,
          center: true,
          duration: 1000
        })
      })
    }
  }
}
</script>

<style scoped>
.user-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search {
  width: 700px;
}
.clearfix {
  display: flex;
  justify-content: center;
  align-items: center;
}
.descriptions-view {
  margin-top: 20px;
}
</style>
