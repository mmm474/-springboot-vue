import { request, upload } from './request'
import type { Goods, LikeRecord, Step } from '@/types'

enum API {
  LIST = '/goods/list',
  LIST_BY_CATEGORY = '/goods/getListByCategorie',
  PUBLISH = '/goods/publish',
  DELETE = '/goods/delete',
  DETAIL = '/goods/detail',
  REMARK = '/goods/upremark',
  LIKE = '/goods/uplike',
  DISLIKE = '/goods/downlike',
  GET_LIKES = '/goods/getlikes',
  USER_GOODS = '/goods/userlist',
  ADD_HISTORY = '/goods/addhistory',
  GET_HISTORY = '/goods/gethistory',
  SEARCH = '/goods/search',
  UPLOAD = '/tools/upload',
}

// 商品列表
export const getGoodsList = (params: { page?: number; pageSize?: number }) =>
  request<Goods[]>({ method: 'GET', url: API.LIST, params })

// 按分类获取
export const getGoodsByCategory = (params: {
  page?: number
  pageSize?: number
  categorie?: string
}) => request<Goods[]>({ method: 'GET', url: API.LIST_BY_CATEGORY, params })

// 搜索
export const searchGoods = (data: { title: string; page?: number; pageSize?: number }) =>
  request<Goods[]>({ method: 'POST', url: API.SEARCH, data })

// 发布
export const publishGoods = (data: {
  title: string
  price: number
  descr?: string
  categorie: string
  images?: string
}) => request({ method: 'POST', url: API.PUBLISH, data })

// 删除
export const deleteGoods = (id: number) =>
  request({ method: 'POST', url: API.DELETE, data: { id } })

// 详情
export const getGoodsDetail = (id: number) =>
  request<Goods>({ method: 'GET', url: API.DETAIL, params: { id } })

// 用户发布的商品
export const getUserGoods = (id?: number) =>
  request<Goods[]>({ method: 'GET', url: API.USER_GOODS, params: { id } })

// 评论
export const publishComment = (data: { id: number; content: string }) =>
  request({ method: 'POST', url: API.REMARK, data })

// 点赞 / 取消
export const likeGoods = (id: number) =>
  request({ method: 'POST', url: API.LIKE, data: { id } })

export const dislikeGoods = (id: number) =>
  request({ method: 'POST', url: API.DISLIKE, data: { id } })

// 我的点赞
export const getMyLikes = () =>
  request<LikeRecord[]>({ method: 'GET', url: API.GET_LIKES })

// 浏览历史
export const addHistory = (id: number) =>
  request({ method: 'POST', url: API.ADD_HISTORY, data: { id } })

export const getMyHistory = () => request<Step[]>({ method: 'GET', url: API.GET_HISTORY })

// 上传单张图片（字段名 file）
export const uploadImage = (file: File) =>
  upload<{ url: string }>(API.UPLOAD, file, 'file')
