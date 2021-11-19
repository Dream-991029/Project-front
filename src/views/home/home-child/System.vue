<template>
  <transition name="el-zoom-in-top">
    <div v-show="viewShow">
      系统管理
    </div>
  </transition>
</template>

<script>
export default {
  name: 'System',
  data () {
    return {
      viewShow: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.viewShow = true
    }, 300)
  }
}
</script>

<style scoped>

</style>
