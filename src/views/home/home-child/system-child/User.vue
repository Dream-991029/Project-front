<template>
  <transition name="el-zoom-in-center">
    <div class="user-info-view" v-show="viewShow">
      <!-- 列表查询和添加用户 -->
      <el-row style="margin-bottom: 30px">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.user_name"
            placeholder="请输入帐号"
            clearable
            ref="userNameInput"
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="4">
          <el-button type="primary" round @click="linkAddUser">添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userInfoList" @row-click="viewUserInfo">
        <el-table-column type="index" label="编号" align="center" width="50" :index="indexMethod"></el-table-column>
        <el-table-column label="帐号" prop="user_name" align="center"></el-table-column>
        <el-table-column label="性别" prop="sex" align="center" width="50"></el-table-column>
        <el-table-column label="手机号码" prop="phone_number" align="center"></el-table-column>
        <el-table-column label="类型" prop="user_type" align="center" width="80"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="70" :formatter="formatStatus"></el-table-column>
        <el-table-column label="创建者" prop="create_by" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" width="160" :formatter="formatCreateTime"></el-table-column>
        <el-table-column label="最后修改者" prop="update_by" align="center" :formatter="formatUpdateBy"></el-table-column>
        <el-table-column label="最后修改时间" prop="update_time" align="center" width="160" :formatter="formatUpdateTime"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" :formatter="formatRemark"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
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
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[4, 5, 6, 7, 8]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
        style="margin-top: 30px">
      </el-pagination>
    </div>
  </transition>
</template>

<script>
import { getUserInfoList } from 'network/userinfo.js'
// 引入格式化时间模块
import moment from 'moment'

export default {
  name: 'User',
  data () {
    return {
      userInfoList: [],
      queryInfo: {
        user_name: '',
        page_num: 1,
        page_size: 8
      },
      total: 0,
      viewShow: false
    }
  },
  computed: {
    formatUpdateTime () {
      return (row, column) => {
        if (row.update_time) {
          return moment(row.update_time).format('YYYY-MM-DD hh:mm:ss')
        }
        return '暂无'
      }
    },
    formatCreateTime () {
      return (row, column) => {
        if (row.create_time) {
          return moment(row.create_time).format('YYYY-MM-DD hh:mm:ss')
        }
        return '暂无'
      }
    },
    formatUpdateBy () {
      return (row, column) => {
        if (row.update_by) {
          return row.update_by
        }
        return '暂无'
      }
    },
    formatStatus () {
      return (row, column) => {
        if (row.status) {
          if (row.status === '0') {
            return '正常'
          } else if (row.status === '1') {
            return '停用'
          }
        }
        return '暂无'
      }
    },
    formatRemark () {
      return (row, column) => {
        if (!row.remark) return '暂无'
        if (row.remark.length > 8) {
          return row.remark.slice(0, 5) + '...'
        }
        return row.remark
      }
    }
  },
  methods: {
    getUserList () {
      getUserInfoList(this.queryInfo)
        .then((res) => {
          if (res.status === 0) {
            // 获取用户列表
            this.userInfoList = res.data.data
            // 获取用户总数
            this.total = res.data.total
            this.$refs.userNameInput.blur()
          } else {
            this.$message.error({
              message: res.msg,
              center: true,
              duration: 1000
            })
          }
        })
        .catch((err) => {
          this.$message.error({
            message: err,
            center: true,
            duration: 1000
          })
        })
    },
    // 监听page_size变化
    handleSizeChange (newPageSize) {
      // 将请求参数中的每页显示条数改变为最新值
      this.queryInfo.page_size = newPageSize
      // 请求后台
      this.getUserList()
    },
    // 监听页码变化
    handleCurrentChange (newPageNum) {
      // 将请求参数中的页码改变为最新值
      this.queryInfo.page_num = newPageNum
      // 请求后台
      this.getUserList()
    },
    // 序号连续
    indexMethod (index) {
      return (this.queryInfo.page_num - 1) * this.queryInfo.page_size + 1 + index
    },
    // 查看用户详细信息
    viewUserInfo (row, column, event) {
      // 跳转至用户查看路由
      this.$router.push({
        path: '/home/userview',
        query: {
          user_name: row.user_name
        }
      })
    },
    // 跳转至添加用户界面
    linkAddUser () {
      this.$router.push({
        path: '/home/useradd'
      })
    }
  },
  created () {
    // 请求数据
    this.getUserList()
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
    'queryInfo.user_name' (val) {
      if (val === '') {
        this.getUserList()
      }
    }
  }
}
</script>

<style scoped>

</style>
