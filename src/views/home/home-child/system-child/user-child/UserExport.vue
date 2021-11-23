<template>
  <div class="upload-view">
    <transition name="el-zoom-in-bottom">
      <el-card v-show="viewShow" :body-style="{width: '20vw'}">
        <div slot="header" class="clearfix">
          <h2>题目上传</h2>
        </div>
        <el-form>
          <el-form-item label="文件" label-width="120px">
            <el-upload class="upload" action="" :auto-upload="false" ref="upload" :http-request="uploadFileFunc">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-button class="btn" size="small" type="primary" @click="uploadFileFunc">确定上传2</el-button>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { updateFileRequest } from 'network/file'

export default {
  name: 'UserExport',
  data () {
    return {
      fileList: [],
      viewShow: false
    }
  },
  created () {
    setTimeout(() => {
      this.viewShow = true
    }, 300)
  },
  methods: {
    uploadFileFunc () {
      const formData = new FormData()
      const file = this.$refs.upload.uploadFiles[0]
      // 若未选择文件
      if (!file) {
        this.$message.error({
          message: '请选择文件',
          center: true,
          duration: 1000
        })
        return
      }
      // 有文件则将文件添加到formData中
      formData.append('topicFile', file.raw)
      updateFileRequest(formData).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
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
