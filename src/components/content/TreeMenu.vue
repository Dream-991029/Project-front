<template>
    <el-tree
      :data="treeMenuDataList"
      :props="treeMenuProps"
      accordion
      node-key="menu_id"
      :default-expanded-keys="defaultExpandedKeys"
      @current-change="handleNodeClick"
      class="tree-menu-view">
    </el-tree>
</template>

<script>
import { getTreeMenu } from 'network/menu'

export default {
  name: 'TreeMenu',
  data () {
    return {
      treeMenuDataList: [],
      treeMenuProps: {
        label: 'menu_name',
        children: 'children'
      },
      rootMenuId: 1064,
      defaultExpandedKeys: []
    }
  },
  created () {
    getTreeMenu(this.rootMenuId).then(res => {
      if (res.status === 0) {
        this.treeMenuDataList = res.data
        if (res.data.length !== 0 && 'children' in res.data[0]) {
          this.defaultExpandedKeys = [res.data[0].children[0].menu_id]
        } else {
          this.defaultExpandedKeys = [this.rootMenuId]
        }
      } else {
        this.$message.error({
          message: res.msg,
          center: true,
          duration: 1000
        })
      }
    }).catch(err => {
      this.$message.error({
        message: 'undefind',
        center: true,
        duration: 1000
      })
      return err
    })
  },
  methods: {
    handleNodeClick (obj) {
      const routerPath = obj.path
      if (routerPath !== '' && routerPath !== 'base') {
        this.$router.push('/home/' + routerPath).catch((err) => {
          return err
        })
      } else if (obj.perms.split(':')[2] === 'query') {
        this.$router.push('/home/userview').catch((err) => {
          return err
        })
      } else if (obj.perms.split(':')[2] === 'add') {
        this.$router.push('/home/useradd').catch((err) => {
          return err
        })
      } else if (obj.perms.split(':')[2] === 'edit') {
        this.$router.push('/home/useredit').catch((err) => {
          return err
        })
      } else if (obj.perms.split(':')[2] === 'remove') {
        this.$router.push('/home/userdelete').catch((err) => {
          return err
        })
      } else if (obj.perms.split(':')[2] === 'export') {
        this.$router.push('/home/userexport').catch((err) => {
          return err
        })
      } else {
        return false
      }
    }
  }
}
</script>

<style>
  .tree-menu-view{
    font-family: PingFang SC,Helvetica Neue,Helvetica,microsoft yahei,arial,STHeiTi,sans-serif;
    color: rgb(191, 203, 217);
    background-color: transparent;
  }
  .el-tree-node:focus>.el-tree-node__content,
  .el-tree-node__content:hover {
    background-color: rgb(40, 52, 70);
    color: rgb(32, 160, 255);
  }
</style>
