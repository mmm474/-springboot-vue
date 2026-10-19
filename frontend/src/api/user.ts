import { request, uploadWithFields } from './request'
import type { Friend } from '@/types'

enum API {
  REGISTER = '/user/register',
  LOGIN = '/user/login',
  INFO = '/user/info',
  UPDATE_INFO = '/user/updateInfo',
  UPDATE_PASSWORD = '/user/updatePassword',
  GET_CODE = '/user/getcode',
  CHECK_CODE = '/user/checkcode',
  ADD_FRIEND = '/friend/add',
  FRIEND_LIST = '/friend/list',
  FRIEND_DEL = '/friend/delete',
}

// 注册
export const reqRegister = (data: { username: string; password: string }) =>
  request({ method: 'POST', url: API.REGISTER, data })

// 登录
export const reqLogin = (data: { username: string; password: string; user_code?: string }) =>
  request({ method: 'POST', url: API.LOGIN, data })

// 当前用户信息
export const reqUserInfo = () => request({ method: 'GET', url: API.INFO })

// 修改用户信息（可带头像）
export const reqUpdateInfo = (
  data: { nickname?: string; phone?: string; sex?: number; describes?: string },
  file?: File
) => {
  if (file) {
    return uploadWithFields(API.UPDATE_INFO, file, {
      nickname: data.nickname ?? '',
      phone: data.phone ?? '',
      sex: data.sex ?? 0,
      describes: data.describes ?? '',
    })
  }
  return request({ method: 'POST', url: API.UPDATE_INFO, data })
}

// 修改密码
export const reqUpdatePassword = (data: { oldPassword: string; newPassword: string }) =>
  request({ method: 'POST', url: API.UPDATE_PASSWORD, data })

// 获取验证码 URL
export const reqGetCode = () => request<string>({ method: 'GET', url: API.GET_CODE })

// 校验验证码
export const reqCheckCode = (code: string) =>
  request({ method: 'POST', url: API.CHECK_CODE, data: { code } })

// 添加关注
export const reqAddFriend = (friendId: number) =>
  request({ method: 'POST', url: API.ADD_FRIEND, data: { friendId } })

// 关注列表
export const reqFriendList = () =>
  request<Friend[]>({ method: 'GET', url: API.FRIEND_LIST })

// 取消关注
export const reqFriendDel = (friendId: number) =>
  request({ method: 'POST', url: API.FRIEND_DEL, data: { friendId } })
