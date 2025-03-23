// 仓库数据类型
export type Uinfo = {
  user_code?: string,
  id?: number,
  // birth?: string | null
  sex?: number | null,
  nickname?: string | null,
  describes?: string | null,
  avatar?: string,
  role?: string,
  created_at?: string,
  iat?: number,
  exp?: number
}

export interface UserState {
  token: string | null
  UInfo: Uinfo | null
}


// 注册接口参数类型
export interface regRequestForm {
  username: string,
  password: string
}

// 登录接口参数类型
export interface loginRequestForm extends regRequestForm {
  user_code: string
}

// 登录接口返回参数类型
export type loginResponseForm = {
  token: string
}

// 获取用户信息接口返回参数类型
export type getUserInfoForm = {
  user_code: string,
  id?: number,
  // birth?: string | null
  sex?: number | null,
  nickname?: string | null,
  describes?: string | null,
  avatar?: string,
  role?: string,
  created_at?: string,
  iat?: number,
  exp?: number
}

// 更新用户信息接口参数类型
export interface upInfoRequestForm {
  sex?: number,
  nickname?: string,
  describes?: string,
  files?: string,
  phone?: string
}


// 更新用户信息接口返回参数类型
export type userInfo = {
  info_id: number,
  id: number,
  birth: string | null
  sex: number | 3,
  uname: string | "",
  describes: string | "",
  avatar: string,
  role: string,
  createdTime: string,
  iat: number,
  exp: number
}

export interface upInfoResponseForm extends reponseForm {
  newtoken: string
  userInfo: userInfo,
  message: string,
  succes: boolean,
  code: number
}
// 一般返回类
export interface reponseForm {
  msg: string,
  data: {},
  succes: boolean,
  code: number
}

