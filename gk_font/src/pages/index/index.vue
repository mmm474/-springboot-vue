
<template>
  <view class="container">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }">首页</view>
    <!-- 搜索区域 -->
    <view class="search-container" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="search-box">
        <text class="iconfont icon-sousuo" style="font-size: 32rpx; color: #999"></text>
        <input type="text" v-model="searchText" placeholder="搜索商品名称" placeholder-class="placeholder"
          @change="handleSearch" />
      </view>
    </view>

    <!-- 分类Tab -->
    <view class="tab-container">
      <view v-for="(item, index) in categorieOptions" :key="index" class="tab-item"
        :class="{ active: currentTab === item.value }" @tap="switchTab(item.value)">
        <view class="tab-icon">
          <text :style="{ color: currentTab === item.value ? '#1976D2' : '#666' }" style="font-size: 24px"
            :class="item.icon"></text>
        </view>
        <text class="tab-text">{{ item.label }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y @scrolltolower="loadMore" @refresherrefresh="refresh" refresher-enabled
      :refresher-triggered="isRefreshing">
      <view v-if="data.list.length > 0" v-for="(item, index) in data.list" :key="index" class="goods-item"
        @tap="goToDetail(item.id)">
        <image class="goods-image" :src="item.cover" mode="aspectFill"></image>
        <view class="goods-info">
          <text class="goods-title">{{ item.title }}</text>
          <text class="goods-author">{{ item.user.nickname }}</text>
          <text class="goods-date">{{ differTime(item.created_at) }}</text>
          <text class="goods-price">￥{{ item.price }}</text>
        </view>
      </view>
      <view v-else class="no-data">暂无数据</view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { getSquareListByCategorie, reqSearchGood } from "@/api/square"
import { ref, computed, reactive, onMounted } from "vue"
const { safeAreaInsets } = uni.getSystemInfoSync()
const searchText = ref("")
const currentTab = ref("")
const isRefreshing = ref(false)
let timer: any = null

const data = reactive<{ list: any[] }>({
  list: [],
})
const page = ref(1)

const categorieOptions = reactive([
  { label: "全部", value: "", icon: "iconfont icon-Home" },
  { label: "数码", value: "数码", icon: "iconfont icon-fenlei" },
  { label: "图书", value: "图书", icon: "iconfont icon-shoucang" },
  { label: "家居", value: "家居", icon: "iconfont icon-igw-l-more" },
  { label: "服饰", value: "服饰", icon: "iconfont icon-Home" },
  { label: "运动", value: "运动", icon: "iconfont icon-fenlei" },
])

onMounted(() => {
  getList()
})

const getList = async () => {
  const res = await getSquareListByCategorie({
    page: page.value,
    pageSize: 10,
    // @ts-ignore value 是字符串分类名（"数码"/"图书"/...），空字符串表示全部
    categorie: currentTab.value,
  })
  data.list = res.data.map((i) => ({
    ...i,
    cover: i.images ? i.images.split(",")[0] : "",
  }))
}

const differTime = (time: string) => {
  const currentTime = new Date()
  const targetTime = new Date(time)

  console.log(currentTime, targetTime)

  // @ts-ignore
  const differenceInMilliseconds = currentTime - targetTime
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60))
  const differenceInHours = Math.floor(differenceInMinutes / 60)

  if (differenceInHours < 1) {
    return `${differenceInMinutes}分钟前`
  } else {
    return `${differenceInHours}小时前`
  }
}

const switchTab = (val: string) => {
  currentTab.value = val
  getList()
}

const handleSearch = () => {
  // 做一个防抖
  // @ts-ignore
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(async () => {
    // 搜索逻辑
    const res = await reqSearchGood({
      title: searchText.value,
    })
    data.list = res.data.map((i) => ({
      ...i,
      cover: i.images ? i.images.split(",")[0] : "",
    }))
  }, 500)
}

const loadMore = () => {
  // 加载更多逻辑
  // page.value++
  // getList()
}

const refresh = () => {
  page.value = 1
  isRefreshing.value = true
  getList().then(() => {
    isRefreshing.value = false
  })

  return
}

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`,
  })
}
</script>

<style scoped lang="scss">
page {
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;

  .title_box {
    z-index: 999;
    background-color: #fff;
    top: 0;
    height: 80rpx;
    width: 100%;
    font-weight: bold;
    text-align: center;
    line-height: 80rpx;
  }
}

.search-container {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  position: relative;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0 20rpx;
  height: 72rpx;
}

.search-box input {
  flex: 1;
  margin-left: 16rpx;
  font-size: 14px;
}

.placeholder {
  color: #999999;
}

.tab-container {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}

.tab-icon {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 14px;
  color: #666666;
}

.active .tab-text {
  color: #1976d2;
}

.goods-list {
  flex: 1;
  overflow: auto;
  padding: 20rpx;
}

.goods-item {
  display: flex;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.goods-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-author {
  font-size: 14px;
  color: #666666;
  margin: 8rpx 0;
}

.goods-date {
  font-size: 12px;
  color: #999999;
}

.no-data {
  text-align: center;
  padding: 20rpx;
  font-size: 14px;
  color: #999999;
}

.goods-price {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: bold;
  margin-top: 8rpx;
}
</style>

