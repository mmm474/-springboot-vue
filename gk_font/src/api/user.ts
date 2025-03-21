import { request, upload } from "@/utils/http";
import type { regRequestForm, loginRequestForm, loginResponseForm, getUserInfoForm, upInfoRequestForm, reponseForm, upInfoResponseForm } from "@/types/user_type"
enum API {
  "USER_REG" = "/user/register",
  "USER_LOGIN" = "/user/login",
  "USER_INFO" = "/user/getinfo",
  "USER_OUT" = "/user/logout",
  "USER_UPINFO" = "/user/uinfo",
  "GET_CODE" = "/user/getcode",
  "CHECK_CODE" = "/user/checkcode"
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
  if (filePath) {
    return upload<upInfoResponseForm>({
      method: 'POST', url: API.USER_UPINFO, filePath: filePath, formData: data, name: 'file'
    })
  }
  else if (!filePath) {
    return request<upInfoResponseForm>({ method: 'POST', url: API.USER_UPINFO, data })
  }
}

// 获取验证码
export const reqGetCode = () => request<reponseForm>({ method: "GET", url: API.GET_CODE })

// 校验验证码
export const reqCheckCode = (data: { code: string }) => request<reponseForm>({ method: "POST", url: API.CHECK_CODE, data })