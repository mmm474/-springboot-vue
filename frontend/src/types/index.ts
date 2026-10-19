// 统一响应结构
export interface Result<T = any> {
  code: number
  msg: string
  success: boolean
  data: T
}

// 用户信息
export interface UserInfo {
  id?: number
  user_code?: string
  nickname?: string
  avatar?: string
  phone?: string
  sex?: number
  describes?: string
  role?: number
  created_at?: string
}

// 商品
export interface Goods {
  id: number
  title: string
  price: number
  descr: string
  images: string | string[]
  categorie?: string
  likes: number
  created_at: string
  user: UserInfo
  remarks?: Remark[]
}

// 评论
export interface Remark {
  id: number
  content: string
  nickname: string
  avatar: string
  created_at: string
}

// 点赞记录
export interface LikeRecord {
  id: number
  created_at: string
  goods: Goods
}

// 好友（关注）
export interface Friend {
  id: number
  friendId: number
  nickname: string
  avatar: string
  phone?: string
  sex?: number
  describes?: string
}

// 浏览历史
export interface Step {
  id: number
  goodid: number
  title: string
  publicer?: string
  publicerId?: number
  cover?: string
  created_at: string
}
