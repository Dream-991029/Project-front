<template>
  <div class="upload-view">
    <transition name="el-zoom-in-bottom">
      <el-card v-show="viewShow" :body-style="{width: '20vw'}">
        <div slot="header" class="clearfix">
          <h2>题目上传</h2>
        </div>
        <el-form ref="fileForm" :model="fileFormData" :rules="fileFormRules" label-width="100px"
          status-icon
          hide-required-asterisk>
          <el-form-item label="题库名称：" prop="name">
            <el-input
              placeholder="请输入题库名称"
              v-model="fileFormData.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="导入类型：" prop="type">
            <el-radio-group v-model="fileFormData.type">
              <el-radio label="0">Word</el-radio>
              <el-radio label="1">Excel</el-radio>
              <el-radio label="2">批量复制</el-radio>
              <el-radio label="3">单体录入</el-radio>
              <el-radio label="4">客服导题</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件：">
            <el-upload class="upload" action="" :auto-upload="false" ref="upload" :http-request="uploadFileFunc">
              <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button class="btn" size="small" type="primary" @click="uploadFileFunc">上传</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { uploadFileRequest } from 'network/file'
import jwtDecode from 'jwt-decode'

export default {
  name: 'UserExport',
  data () {
    return {
      viewShow: false,
      fileFormData: {
        name: '',
        type: ''
      },
      fileFormRules: {
        name: [
          {
            required: true,
            message: '请输入题库名称',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '题库名称过长',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择导入类型',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    setTimeout(() => {
      this.viewShow = true
    }, 300)
  },
  methods: {
    uploadFileFunc () {
      this.$refs.fileForm.validate(valid => {
        if (valid) {
          const formData = new FormData()
          const file = this.$refs.upload.uploadFiles[0]
          // 若未选择文件
          if (!file) {
            this.$message.error({
              message: '请选择文件',
              center: true,
              duration: 1000
            })
            return false
          }
          // 有文件则将文件添加到formData中
          formData.append('topicFile', file.raw)
          // 获取token
          const token = this.$store.state.token
          // 解析token
          const obj = jwtDecode(token)
          // 追加添加题库人
          formData.append('create_by', obj.user_id)
          // 添加题库名称
          formData.append('name', this.fileFormData.name)
          // 添加题库类型
          formData.append('import_type', this.fileFormData.type)
          uploadFileRequest(formData).then(res => {
            if (res.status === 0) {
              this.$message.success({
                message: res.msg,
                center: true,
                duration: 750
              })
            } else {
              this.$message.error({
                message: res.msg,
                center: true,
                duration: 750
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.upload-view {
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
</style>
