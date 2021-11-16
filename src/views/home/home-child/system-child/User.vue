<template>
  <div class="user-info-view">
    <!-- 列表查询和添加用户 -->
    <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.user_name"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="4">
          <el-button type="primary" round>添加用户
          </el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="userInfoList" size="small">
      <el-table-column type="index" label="编号" align="center" width="50"></el-table-column>
      <el-table-column label="帐号" prop="user_name" align="center"></el-table-column>
      <el-table-column label="性别" prop="sex" align="center" width="50"></el-table-column>
      <el-table-column label="手机号码" prop="phone_number" align="center"></el-table-column>
      <el-table-column label="类型" prop="user_type" align="center" width="80"></el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="70"></el-table-column>
      <el-table-column label="创建者" prop="create_by" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="150"></el-table-column>
      <el-table-column label="最后修改者" prop="update_by" align="center">admin</el-table-column>
      <el-table-column label="最后修改时间" prop="update_time" align="center" width="150"></el-table-column>
      <el-table-column label="备注" prop="remark" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <!-- 操作按钮 -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserInfo } from 'network/userinfo.js'

export default {
  name: 'User',
  data () {
    return {
      userInfoList: [],
      queryInfo: {
        user_name: '',
        page_num: 1,
        page_size: 5
      },
      total: 0
    }
  },
  filters: {
    formatDateTime (value) {
      return new Date(value.create_time)
    }
  },
  created () {
    getUserInfo(this.queryInfo)
      .then((res) => {
        if (res.status === 0) {
          this.userInfoList = res.data.data
          this.total = res.data.total
        } else {
          this.$message.error({
            message: res.msg,
            center: true,
            duration: 1000
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<style scoped>

</style>
