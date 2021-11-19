<template>
    <el-tree
      :data="treeMenuDataList"
      :props="treeMenuProps"
      accordion
      node-key="menu_id"
      :default-expanded-keys="defaultExpandedKeys"
      @node-expand="handleNodeExpand"
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
      if (!('children' in obj)) {
        const query = {
          path: '',
          query: {
            plan: Date.now().toString()
          }
        }
        if (obj.perms === 'system:user:query') {
          query.path = '/home/userview'
        } else if (obj.perms === 'system:user:add') {
          query.path = '/home/useradd'
        } else if (obj.perms === 'system:user:edit') {
          query.path = '/home/useredit'
        } else if (obj.perms === 'system:user:remove') {
          query.path = '/home/userdelete'
        } else if (obj.perms === 'system:user:export') {
          query.path = '/home/userexport'
        } else if (obj.path !== 'base') {
          query.path = `/home/${obj.path}`
        } else {
          return false
        }
        this.$router.push(query)
      } else {
        return false
      }
      // if (routerPath !== '' && routerPath !== 'base') {
      //   query.path = '/home/' + routerPath
      // } else if (obj.perms === 'system:user:query') {
      //   query.path = '/home/userview'
      // } else if (obj.perms === 'system:user:add') {
      //   query.path = '/home/useradd'
      // } else if (obj.perms === 'system:user:edit') {
      //   query.path = '/home/useredit'
      // } else if (obj.perms === 'system:user:remove') {
      //   query.path = '/home/userdelete'
      // } else if (obj.perms === 'system:user:export') {
      //   query.path = '/home/userexport'
      // } else {
      //   return true
      // }
    },
    handleNodeExpand (obj, node, vm) {
      const routerPath = obj.path
      const query = {
        path: '',
        query: {
          plan: Date.now().toString()
        }
      }
      if (routerPath !== 'base') {
        query.path = '/home/' + routerPath
        this.$router.push(query)
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
