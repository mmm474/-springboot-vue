export const setInfo = (value: Object) => {
  uni.setStorageSync("Uinfo", JSON.stringify(value))
}

export const getInfo = () => {
  return uni.getStorageSync("Uinfo") ? JSON.parse(uni.getStorageSync("Uinfo")) : {}
}

export const removeInfo = () => {
  uni.removeStorageSync("Uinfo")
}