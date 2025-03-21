import useUserStore from "@/store/module/user"
import { removeToken } from "./token"
import { removeInfo } from "./info"

// const baseUrl = "http://81.71.18.107:9094/api"

const baseUrl = "http://127.0.0.1:8080/api"

// 拦截器
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    console.log(options)
    // 如果已经是完整路径
    if (!options.url.startsWith("httP")) {
      options.url = baseUrl + options.url
    }
    // 请求超时时间
    options.timeout = 10000
    // 添加请求表示
    options.header = {
      ...options.header,
      "source-client": "miniapp",
    }
    const userStore = useUserStore()
    const token = userStore.token
    // 添加token请求标识
    if (token) {
      options.header.token = token
    }
    // 携带cookie
    options.withCredentials = true
  }
}

// 请求和上传公用一个拦截器
uni.addInterceptor("request", httpInterceptor)
uni.addInterceptor("uploadFile", httpInterceptor)

interface Data<T> {
  code: number,
  msg: string,
  success: boolean,
  data: T
}

export const request = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        console.log('22222', res)
        if (res.statusCode >= 200 && res.statusCode <= 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode == 401) {
          // 清理用户信息,token，跳转登录页面
          reject(res)
        }
        // 其他错误
        else {
          uni.showToast({
            icon: "none",
            title: (res.data as Data<T>).msg || "请求错误",
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(err)
      }
    })
  })
}

export const upload = <T>(options: UniApp.UploadFileOption) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.uploadFile({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode <= 300) {
          let data = JSON.parse(res.data)
          resolve(data as Data<T>)
          // console.log(res.data);
        } else if (res.statusCode == 401) {
          // 清理用户信息,token，跳转登录页面
          reject(res)
        }
        // 其他错误
        else {
          uni.showToast({
            icon: "none",
            // @ts-ignore
            title: (res.data as Data<T>).msg || "请求错误",
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(err)
      }
    })
  })
}