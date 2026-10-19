import { defineStore } from 'pinia'
import {
  reqLogin,
  reqUserInfo,
  reqUpdateInfo,
} from '@/api/user'
import { getToken, setToken, removeToken, getInfo, setInfo, removeInfo } from '@/utils/auth'
import type { UserInfo } from '@/types'

interface UserState {
  token: string
  UInfo: UserInfo | null
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken(),
    UInfo: getInfo<UserInfo>(),
  }),
  actions: {
    // 登录
    async login(data: { username: string; password: string; user_code?: string }) {
      const res = await reqLogin(data)
      if (res.code === 200) {
        this.token = res.data.token
        setToken(res.data.token)
        await this.fetchUserInfo()
      } else {
        return Promise.reject(new Error(res.msg))
      }
    },

    // 拉取并缓存用户信息
    async fetchUserInfo() {
      const res = await reqUserInfo()
      if (res.code === 200) {
        this.UInfo = res.data
        setInfo(res.data)
      }
      return res
    },

    // 更新资料
    async updateInfo(
      data: { nickname?: string; phone?: string; sex?: number; describes?: string },
      file?: File
    ) {
      const res = await reqUpdateInfo(data, file)
      if (res.code === 200) {
        this.token = res.data.token
        setToken(res.data.token)
        this.UInfo = res.data.userInfo
        setInfo(this.UInfo)
      }
      return res
    },

    // 退出登录
    logout() {
      this.token = ''
      this.UInfo = null
      removeToken()
      removeInfo()
    },
  },
})

export default useUserStore
