<template>
  <div class="register-view" @keyup.enter="submitRegister('registerForm')">
    <el-card shadow="hover" class="register-card" :body-style="{ 'padding-bottom': '0px' }">
      <div slot="header" class="card-header">
        <span>注册</span>
      </div>
      <el-form
        ref="registerForm"
        :model="registerFormData"
        :rules="registerFormRules"
        label-width="100px"
        status-icon
        hide-required-asterisk
        @keyup.enter.native="register('registerForm')"
      >
        <el-form-item label="帐号：" prop="user_name">
          <el-input
            placeholder="请输入帐号"
            v-model="registerFormData.user_name"
            ref="userNameInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone_number">
          <el-input
            placeholder="请输入手机号"
            v-model="registerFormData.phone_number"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            placeholder="请输入密码"
            show-password
            v-model="registerFormData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirm_password">
          <el-input
            placeholder="请再次输入密码"
            show-password
            v-model="registerFormData.confirm_password"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="user_type">
          <el-radio-group v-model="registerFormData.user_type">
            <el-radio label="00">系统用户</el-radio>
            <el-radio label="11">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="registerFormData.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            v-model="registerFormData.remark"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegister('registerForm')">注册</el-button>
          <el-button type="primary" @click="submitSetFrom('registerForm')" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { registerUser } from 'network/user'
export default {
  name: 'Register',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.checkPhoneFunc(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var checkConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerFormData.password) {
        callback(new Error('两次输入密码不一致,请重新输入'))
      } else {
        callback()
      }
    }
    return {
      registerFormData: {
        user_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        user_type: '',
        sex: '',
        remark: ''
      },
      registerFormRules: {
        user_name: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '帐号过长',
            trigger: 'blur'
          }
        ],
        phone_number: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '密码过长',
            trigger: 'blur'
          }
        ],
        confirm_password: [
          {
            required: true,
            validator: checkConfirmPassword,
            trigger: 'blur'
          }
        ],
        user_type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        sex: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 500,
            message: '备注过长',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$refs.userNameInput.focus()
  },
  methods: {
    checkPhoneFunc (tel) {
      const reg = /^1[3|4|5|6|7|8|9]\d{9}$/
      if (reg.test(tel)) {
        return true
      } else {
        return false
      }
    },
    submitRegister (formName) {
      // 点击注册判断表单是否全部验证完成
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const registerData = this.registerFormData
          registerUser(registerData).then(res => {
            if (res.status === 0) {
              this.$message.success({
                message: '注册成功, 正在跳转至首页',
                center: true,
                duration: 750
              })
              setTimeout(() => {
                // 跳转至登录页面
                this.$router.push('/login')
              }, 750)
            } else {
              if (res.msg === '该帐号已被占用!') {
                this.$message.error({
                  message: '此帐号已存在, 请重新输入帐号',
                  center: true,
                  duration: 1500
                })
                // 清空帐号框
                this.registerFormData.user_name = ''
                // 密码框获取焦点
                return this.$refs.userNameInput.focus()
              }
              this.$message.error({
                message: res.msg,
                center: true,
                duration: 1500
              })
            }
          }).catch(err => {
            this.$message.error({
              message: err,
              center: true,
              duration: 1500
            })
          })
        } else {
          return false
        }
      })
    },
    submitSetFrom (formName) {
      // 重置from
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.register-view, .card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.register-view {
  height: 100%;
  background-color: red;
  background-image: linear-gradient(#e66465, #9198e5);
}
.card-header {
  font: normal normal 20px '微软雅黑';
}
.register-card {
  width: 450px;
}
.reset-btn {
  margin-left: 100px;
}
</style>
