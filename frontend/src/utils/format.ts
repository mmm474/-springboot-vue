// 相对时间格式化
export const differTime = (time: string): string => {
  if (!time) return ''
  const diff = Date.now() - new Date(time).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return '刚刚'
  if (hours < 1) return `${minutes}分钟前`
  if (days < 1) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return time.slice(0, 10)
}

// 取商品首图
export const firstImage = (images?: string | string[]): string => {
  if (!images) return ''
  if (Array.isArray(images)) return images[0] || ''
  return images.split(',')[0] || ''
}
