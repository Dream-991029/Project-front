import {
  SAVETOKEN
} from './mutations.type'

export default {
  [SAVETOKEN] (state, res) {
    // 保存token到state中
    state.token = res
    // 将token保存到localstorage中
    localStorage.setItem('token', res)
  }
}
