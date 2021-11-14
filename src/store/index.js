import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

// 状态仓库
const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
}

// 创建Store对象
const store = new Vuex.Store({
  state,
  mutations
})

// 导出Store对象
export default store
