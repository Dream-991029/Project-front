<template>
  <div class="login-view" @keyup.enter="login('loginForm')">
    <el-collapse-transition>
      <el-card v-show="viewShow" shadow="hover" class="login-card" :body-style="{ 'padding-bottom': '0px' }">
        <div slot="header" class="card-header">
          <span>登录</span>
        </div>
        <el-form
          ref="loginForm"
          :model="loginFormData"
          :rules="loginFormRules"
          label-width="100px"
          status-icon
          hide-required-asterisk
        >
          <el-form-item label="帐号：" prop="user_name">
            <el-input
              placeholder="请输入帐号"
              v-model="loginFormData.user_name"
              ref="userNameInput"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              placeholder="请输入密码"
              show-password
              v-model="loginFormData.password"
              ref="pwdInput"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login('loginForm')">登录</el-button>
            <el-link type="primary" :underline="false" @click.prevent="linkRegister()" style="margin-left: 80px;">注册</el-link>
          </el-form-item>
        </el-form>
      </el-card>
    </el-collapse-transition>
  </div>
</template>

<script>
import { getToken } from 'network/user'
import { SAVETOKEN } from 'store/mutations.type'

export default {
  name: 'Login',
  data () {
    return {
      viewShow: false,
      loginFormData: {
        user_name: '',
        password: ''
      },
      loginFormRules: {
        user_name: [
          {
            required: true,
            message: '帐号不能为空',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '帐号最多30位',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '密码最多100位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    new Promise(resolve => {
      setTimeout(() => {
        this.viewShow = true
        resolve()
      }, 300)
    }).then(res => {
      this.$refs.userNameInput.focus()
    })
  },
  methods: {
    login (formName) {
      // 点击按钮判断表单是否全部验证完成
      this.$refs[formName].validate((validate) => {
        if (validate) {
          const loginData = this.loginFormData
          // 验证成功, 则请求登录接口
          getToken(loginData)
            .then((res) => {
              if (res.status === 0) {
                // 登录成功, 将token保存到vuex中
                const token = res.token
                this.$store.commit(SAVETOKEN, token)
                this.$message.success({
                  message: '登陆成功',
                  center: true,
                  duration: 550
                })
                setTimeout(() => {
                  // 跳转至首页
                  this.$router.push('/home')
                }, 500)
              } else {
                if (res.msg === '登录失败, 此帐户不存在!') {
                  this.$message.error({
                    message: '帐号不存在,请先注册',
                    center: true,
                    duration: 750
                  })
                  this.$router.push('/register')
                } else if (res.msg === '登陆失败, 密码错误!') {
                  this.$message.error({
                    message: '密码错误',
                    center: true,
                    duration: 1500
                  })
                  // 清空密码框
                  this.loginFormData.password = ''
                  // 密码框获取焦点
                  this.$refs.pwdInput.focus()
                } else {
                  this.$message.error({
                    message: res.msg,
                    center: true,
                    duration: 1500
                  })
                }
              }
            })
            .catch(error => {
              this.$message.error({
                message: error,
                center: true,
                duration: 1500
              })
            })
        } else {
          return false
        }
      })
    },
    linkRegister () {
      this.$message.success({
        message: '正在跳转,请稍后',
        center: true,
        duration: 750
      })
      // 跳转至注册路由
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-view, .card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-view {
  height: 100%;
  background-color: red;
  background-image: linear-gradient(#e66465, #9198e5);
}
.card-header {
  font: normal normal 20px '微软雅黑';
}
.login-card {
  width: 450px;
}
</style>
