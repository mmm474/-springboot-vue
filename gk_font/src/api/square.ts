import type { SquareList, goodsDetail, reqAddGoodsItem, resRemarkData, upImgResponse } from "@/types/square";
import { request, upload } from "@/utils/http";
enum API {
  "GET_LIST" = '/goods/list',
  "GET_LIST_BY_CAS" = "/goods/getListByCategorie",
  "UP_IMG" = '/tools/upload',
  "ADD_GOODS" = '/goods/publish',
  "GET_DETAIL" = "/goods/detail",
  "UP_REMARK" = "/goods/upremark",
  "UP_LIKE" = "/goods/uplike",
  "DEL_LIKE" = "/goods/downlike",
  "GET_USER_LIKES" = "/goods/getlikes",
  "GET_USER_GOODS" = "/goods/userlist",
  "GOODS_STEP" = "/goods/addhistory",
  "GET_USER_STEP" = "/goods/gethistory",
  "SEARCH_GOOD" = "/goods/search",
  "DEL_GOODS" = "/goods/delete"
}



// 获取广场列表
export const getSquareList = ({ page, pageSize }: { page: number, pageSize: number }) => request<SquareList[]>({ method: "GET", url: API.GET_LIST, data: { page, pageSize } })


// 获取分类列表
export const getSquareListByCategorie = ({ page, pageSize, categorie }: { page: number, pageSize: number, categorie: number }) => request<SquareList[]>({ method: "GET", url: API.GET_LIST_BY_CAS, data: { page, pageSize, categorie } })

// 上传图片
export const reqUploadImages = (filePath?: string) => upload<upImgResponse>({
  // @ts-ignore
  method: 'POST', url: API.UP_IMG, filePath: filePath, name: 'file'
})


// 搜索商品
export const reqSearchGood = (data: { title: string }) => request<SquareList[]>({ method: "POST", url: API.SEARCH_GOOD, data })
// 发布商品
export const reqPublishArticle = (data: reqAddGoodsItem) => request<any>({ method: "POST", url: API.ADD_GOODS, data })

// 获取详情
export const reqGetDetail = (data: { id: number }) => request<SquareList>({ method: "GET", url: API.GET_DETAIL, data })

export const reqLike = (data: { id: number }) => request<any>({ method: "POST", url: API.UP_LIKE, data })

export const reqDelLike = (data: { id: number }) => request<any>({ method: "POST", url: API.DEL_LIKE, data })

export const reqGetUserLikes = () => request<any>({ method: "GET", url: API.GET_USER_LIKES })

export const reqPublishComment = (data: resRemarkData) => request<any>({ method: "POST", url: API.UP_REMARK, data })

export const reqGetUserGoods = (data: { id?: number | null | undefined }) => request<any>({ method: "GET", url: API.GET_USER_GOODS, data })

export const reqGoodsStep = (data: { id: number }) => request<any>({ method: "POST", url: API.GOODS_STEP, data })

export const reqGetUserStep = () => request<any>({ method: "GET", url: API.GET_USER_STEP })

export const reqDelGoods = (data: { id: number }) => request<any>({ method: "POST", url: API.DEL_GOODS, data })