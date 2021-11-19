<template>
  <div class="user-view">
    <transition name="el-zoom-in-bottom">
      <el-card v-show="viewShow" class="box-card" :body-style="{width: '45vw'}">
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
            ref="userNameInput"
            @clear="clearUserInfo"
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
          <el-descriptions :column="1" border v-show="!isEmpty">
            <el-descriptions-item label="帐号" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.user_name}}</el-descriptions-item>
            <el-descriptions-item label="手机号码" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.phone_number}}</el-descriptions-item>
            <el-descriptions-item label="类型" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.user_type}}</el-descriptions-item>
            <el-descriptions-item label="性别" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.sex}}</el-descriptions-item>
            <el-descriptions-item label="状态" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.status | formatStatus}}</el-descriptions-item>
            <el-descriptions-item label="创建者" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.create_by}}</el-descriptions-item>
            <el-descriptions-item label="创建时间" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.create_time | formatDateTime}}</el-descriptions-item>
            <el-descriptions-item label="最后修改者" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.update_by | formatNull}}</el-descriptions-item>
            <el-descriptions-item label="最后修改时间" :labelStyle="labelStyle" :contentStyle="contentStyle">{{userInfo.update_time | formatDateTime}}</el-descriptions-item>
            <el-descriptions-item label="备注" :labelStyle="labelStyle" :contentStyle="{'text-align': 'left'}">{{userInfo.remark | formatNull}}</el-descriptions-item>
          </el-descriptions>
          <!-- 空状态 -->
          <el-empty description="暂无数据" v-show="isEmpty"></el-empty>
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { getUserInfo } from 'network/userinfo'
import moment from 'moment'

export default {
  name: 'UserView',
  data () {
    return {
      user_name: '',
      userInfo: {},
      labelStyle: {
        'text-align': 'center',
        width: '7vw'
      },
      contentStyle: {
        'text-align': 'center'
      },
      viewShow: false
    }
  },
  filters: {
    formatDateTime (val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD hh:mm:ss')
      }
      return '暂无'
    },
    formatStatus (val) {
      if (val === '0') {
        return '正常'
      } else if (val === '1') {
        return '停用'
      } else {
        return '暂无'
      }
    },
    formatNull (val) {
      if (val) {
        return val
      } else {
        return '暂无'
      }
    }
  },
  computed: {
    isEmpty () {
      return Object.keys(this.userInfo).length === 0
    }
  },
  methods: {
    getUserInfoFunc () {
      if (this.user_name !== '') {
        getUserInfo(this.user_name).then(res => {
          if (res.status === 0) {
            this.userInfo = res.data
            this.$refs.userNameInput.blur()
          } else if (res.msg === '查询失败, 此帐号不存在!') {
            this.userInfo = {}
            this.$message.error({
              message: res.msg,
              center: true,
              duration: 1000
            })
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
      } else {
        this.$message.error({
          message: '账号不能为空!',
          center: true,
          duration: 1000
        })
      }
    },
    clearUserInfo () {
      this.userInfo = {}
      this.$refs.userNameInput.focus()
    }
  },
  mounted () {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        this.viewShow = true
        resolve()
      }, 300)
    }).then(res => {
      this.$refs.userNameInput.focus()
    })
  },
  watch: {
    // 监听输入的用户名
    user_name (val) {
      if (val === '') {
        this.userInfo = {}
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    const obj = to.query
    if (Object.keys(obj).length !== 0 && 'user_name' in obj) {
      next(vm => {
        // 将输入框中添加帐号
        vm.user_name = obj.user_name
        // 重新请求数据
        vm.getUserInfoFunc()
        // 输入框失去焦点
        vm.$refs.userNameInput.blur()
      })
    }
    next()
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
  width: 45vw;
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
