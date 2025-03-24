import { request, upload } from "@/utils/http";
import type { regRequestForm, loginRequestForm, loginResponseForm, getUserInfoForm, upInfoRequestForm, reponseForm, upInfoResponseForm } from "@/types/user"
enum API {
  "USER_REG" = "/user/register",
  "USER_LOGIN" = "/user/login",
  "USER_INFO" = "/user/info",
  "USER_OUT" = "/user/logout",
  "USER_UPINFO" = "/user/updateInfo",
  "GET_CODE" = "/user/getcode",
  "CHECK_CODE" = "/user/checkcode",
  "ADD_FRIEND" = "/friend/add",
  "FRIEND_LIST" = "/friend/list",
  "FRIEND_DEL" = "/friend/delete",

}
// 注册
export const reqUserReg = (data: regRequestForm) => request<reponseForm>({ method: "POST", url: API.USER_REG, data })

//登录
export const reqUserLogin = (data: loginRequestForm) => request<loginResponseForm>({ method: "POST", url: API.USER_LOGIN, data })

// 获取信息
export const reqUserInfo = () => request<getUserInfoForm>({ method: "GET", url: API.USER_INFO })

// 退出登录
export const reqLogout = () => request<reponseForm>({ method: "GET", url: API.USER_OUT })


// 更新用户信息
export const reqUpInfo = (data: upInfoRequestForm, filePath?: string,) => {
  console.log('file-----', filePath)
  if (filePath) {
    return upload<upInfoResponseForm>({
      // @ts-ignore
      method: 'POST', url: API.USER_UPINFO, filePath: filePath, formData: data, name: 'files'
    })
  }
  else if (!filePath) {
    return request<upInfoResponseForm>({ method: 'POST', url: API.USER_UPINFO, data })
  }
}

// 获取验证码
export const reqGetCode = () => request<string>({ method: "GET", url: API.GET_CODE })

// 校验验证码
export const reqCheckCode = (data: { code: string }) => request<reponseForm>({ method: "POST", url: API.CHECK_CODE, data })

// 添加好友
export const reqAddFriend = (data: { friendId: string }) => request<reponseForm>({ method: "POST", url: API.ADD_FRIEND, data })

// 获取好友列表
export const reqFriendList = () => request<any[]>({ method: "GET", url: API.FRIEND_LIST })

// 删除好友
export const reqFriendDel = (data: { friendId: string }) => request<reponseForm>({ method: "POST", url: API.FRIEND_DEL, data })

