export const setToken = (value: string) => {
  uni.setStorageSync("token", value)
}

export const getToken = () => {
  return uni.getStorageSync("token") ? uni.getStorageSync("token") : ""
}

export const removeToken = () => {
  uni.removeStorageSync("token")
}