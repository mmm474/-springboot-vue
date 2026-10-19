import axios, { type AxiosRequestConfig, type AxiosInstance } from 'axios'
import { showToast } from 'vant'
import { getToken, removeToken, removeInfo } from '@/utils/auth'
import router from '@/router'
import type { Result } from '@/types'

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
})

// 请求拦截：自动携带 token
service.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.token = token
  }
  return config
})

// 响应拦截：统一解包与错误处理
service.interceptors.response.use(
  (response) => {
    const res = response.data as Result
    // 文件流等非标准结构直接返回
    if (res.code === undefined) return response.data
    return res
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      showToast('登录过期，请重新登录')
      removeToken()
      removeInfo()
      router.replace('/login')
    } else {
      const msg = error.response?.data?.msg || error.response?.data?.message || '网络错误'
      showToast(msg)
    }
    return Promise.reject(error)
  }
)

// 业务请求（返回解包后的 Result）
export const request = <T = any>(config: AxiosRequestConfig): Promise<Result<T>> => {
  return service.request<any, Result<T>>(config)
}

// 文件上传
export const upload = <T = any>(
  url: string,
  file: File | Blob,
  fieldName = 'file',
  filename = 'file.jpg'
): Promise<Result<T>> => {
  const formData = new FormData()
  formData.append(fieldName, file, filename)
  return service.request<any, Result<T>>({
    url,
    method: 'POST',
    data: formData,
  })
}

// 带额外表单字段的文件上传
export const uploadWithFields = <T = any>(
  url: string,
  file: File | Blob,
  fields: Record<string, string | number>,
  fieldName = 'files'
): Promise<Result<T>> => {
  const formData = new FormData()
  Object.entries(fields).forEach(([k, v]) => formData.append(k, String(v)))
  formData.append(fieldName, file, 'avatar.jpg')
  return service.request<any, Result<T>>({
    url,
    method: 'POST',
    data: formData,
  })
}

export default service
