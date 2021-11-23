<template>
  <div class="user-edit-view">
    <transition name="el-zoom-in-bottom">
      <el-card v-show="viewShow" class="box-card" :body-style="{width: '45vw'}">
        <!-- 标题 -->
        <div slot="header" class="clearfix">
          <h2>修改信息</h2>
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <el-input
            v-model="searchUserName"
            placeholder="请输入内容"
            clearable
            ref="userNameInputSearch"
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
          <el-form
            ref="editUserForm"
            :model="editUserFormData"
            :rules="editUserFormRules"
            label-width="100px"
            status-icon
            hide-required-asterisk
            v-show="!isEmpty"
            class="editform"
            @keyup.enter.native="submitAddUser('editUserForm')"
          >
            <el-form-item label="帐号：" prop="user_name">
              <el-input
                placeholder="请输入帐号"
                v-model="editUserFormData.user_name"
                ref="userNameInput"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone_number">
              <el-input
                placeholder="请输入手机号"
                v-model="editUserFormData.phone_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input
                placeholder="请输入密码"
                show-password
                v-model="editUserFormData.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirm_password">
              <el-input
                placeholder="请再次输入密码"
                show-password
                v-model="editUserFormData.confirm_password"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="user_type">
              <el-radio-group v-model="editUserFormData.user_type">
                <el-radio label="00">系统用户</el-radio>
                <el-radio label="11">普通用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="editUserFormData.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">未知</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-tooltip :content="statusText" placement="top">
                <el-switch
                  v-model="editUserFormData.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="0"
                  inactive-value="1">
                </el-switch>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入备注"
                v-model="editUserFormData.remark"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEditUser('editUserForm')">修改</el-button>
              <el-button type="primary" @click="submitSetFrom('editUserForm')" class="reset-btn">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- 空状态 -->
          <el-empty description="暂无数据" v-show="isEmpty"></el-empty>
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { getUserInfo, editUser } from 'network/userinfo'
import jwtDecode from 'jwt-decode'

export default {
  name: 'UserEdit',
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
      if (value !== this.editUserFormData.password) {
        callback(new Error('两次输入密码不一致,请重新输入'))
      } else {
        callback()
      }
    }
    return {
      viewShow: false,
      searchUserName: '',
      editUserFormData: {},
      editUserFormRules: {
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
        remark: [
          {
            max: 500,
            message: '备注过长',
            trigger: 'blur'
          }
        ]
      },
      isEmpty: true
    }
  },
  computed: {
    formatData () {
      return (data) => {
        for (const key in data) {
          if (key === 'user_type') {
            if (data[key] === '系统用户') {
              data[key] = '00'
            } else {
              data[key] = '11'
            }
          } else if (key === 'sex') {
            if (data[key] === '男') {
              data[key] = '0'
            } else if (data[key] === '女') {
              data[key] = '1'
            } else {
              data[key] = '2'
            }
          }
        }
        data.password = ''
        data.confirm_password = ''
        return data
      }
    },
    statusText () {
      if (this.editUserFormData.status === '0') {
        return '正常'
      } else if (this.editUserFormData.status === '1') {
        return '停用'
      } else {
        return '未知'
      }
    }
  },
  created () {
    new Promise(resolve => {
      setTimeout(() => {
        this.viewShow = true
        const obj = this.$route.query
        resolve(obj)
      }, 300)
    }).then(res => {
      if (Object.keys(res).length !== 0 && 'user_name' in res) {
        // 将输入框中添加帐号
        this.searchUserName = res.user_name
        // 重新请求数据
        this.getUserInfoFunc()
        // 搜索框失去焦点
        this.$refs.userNameInputSearch.blur()
      } else {
        this.isEmpty = true
        // 搜索框获取焦点
        this.$refs.userNameInputSearch.focus()
      }
    })
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
    getUserInfoFunc () {
      if (this.searchUserName !== '') {
        getUserInfo(this.searchUserName).then(res => {
          if (res.status === 0) {
            // 获取数据
            this.editUserFormData = this.formatData(res.data)
            // 搜索框失去焦点
            this.$refs.userNameInputSearch.blur()
          } else if (res.msg === '查询失败,此帐号不存在!') {
            this.isEmpty = true
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
        this.$refs.userNameInput.focus()
      }
    },
    clearUserInfo () {
      this.isEmpty = true
      this.$refs.userNameInputSearch.focus()
    },
    submitEditUser (formName) {
      // 点击注册判断表单是否全部验证完成
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const editUserData = this.editUserFormData
          // vuex获取token
          const token = this.$store.state.token
          // 解析token
          const obj = jwtDecode(token)
          // 取出id
          editUserData.update_by = obj.user_id
          delete editUserData.create_by
          delete editUserData.create_time
          delete editUserData.update_time
          editUser(editUserData).then(res => {
            if (res.status === 0) {
              this.$message.success({
                message: '修改成功, 正在跳转至用户详细页',
                center: true,
                duration: 750
              })
              this.$router.push({
                path: '/home/userview',
                query: {
                  user_name: res.data.user_name
                }
              })
            } else {
              if (res.msg === '该帐号已被占用!') {
                this.$message.error({
                  message: '此帐号已存在, 请重新输入帐号',
                  center: true,
                  duration: 1500
                })
                // 清空帐号框
                this.editUserFormData.user_name = ''
                // 账号框获取焦点
                this.$refs.userNameInput.focus()
              } else {
                this.$message.error({
                  message: res.msg,
                  center: true,
                  duration: 1500
                })
              }
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
      // 重新请求数据
      this.getUserInfoFunc()
    }
  },
  watch: {
    searchUserName (val) {
      if (val === '') {
        this.isEmpty = true
      }
    },
    editUserFormData: {
      handler (val) {
        if (Object.keys(val).length === 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.user-edit-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clearfix {
  display: flex;
  justify-content: center;
  align-items: center;
}
.search {
  width: 45vw;
}
.descriptions-view {
  margin-top: 20px;
}
.descriptions-view .editform {
  width: 25vw;
  margin: 0 auto;
}
.reset-btn {
  margin-left: 100px;
}
</style>
