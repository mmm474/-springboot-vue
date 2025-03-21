export const setToken = async (value: string) => {
  await uni.setStorageSync("token", value)
}

export const getToken = () => {
  return uni.getStorageSync("token") ? uni.getStorageSync("token") : ""
}

export const removeToken = () => {
  uni.removeStorageSync("token")
}