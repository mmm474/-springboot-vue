//用户相关小仓库
import { defineStore } from "pinia"
import type { UserState } from "@/types/user"
import { setToken, getToken, removeToken } from "@/utils/token"
import { setInfo, removeInfo, getInfo, } from "@/utils/info"
import type { loginRequestForm, upInfoRequestForm } from "@/types/user"
import { reqUserLogin, reqLogout, reqUserInfo, reqUpInfo } from "@/api/user"
let useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      token: getToken(),
      UInfo: getInfo()
    }
  },
  actions: {
    // 登录
    async getLogin(data: loginRequestForm) {
      let res = await reqUserLogin(data)
      if (res.code == 200) {
        this.token = res.data.token
        setToken(res.data.token)
        return
      }
      return Promise.reject(new Error(res.msg))
    },
    // 获取用户信息接口
    async userInfo() {
      let result = await reqUserInfo()
      if (result.code == 200) {
        this.UInfo = result.data
        setInfo(result.data)
        return result.msg
      }
      return Promise.reject(new Error(result.msg))
    },

    // 退出
    async userLogout() {
      removeToken()
      removeInfo()
      this.token = ""
      this.UInfo = null
    },
    // 更新用户信息接口
    async userUpInfo(data: upInfoRequestForm, filePath?: string) {
      let result = await reqUpInfo(data, filePath)
      console.log(result)
      if (result?.code === 200) {
        this.UInfo = result.data.userInfo
        this.token = result.data.token
        setToken(this.token as string)
        setInfo(this.UInfo)
        console.log(this.UInfo.avatar)
      }
    },
  },
  getters: {

  }
})

export default useUserStore