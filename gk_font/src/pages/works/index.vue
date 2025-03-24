
<template>
  <view class="collection-page">
    <scroll-view class="content" scroll-y refresher-enabled :refresher-triggered="isRefreshing">
      <view class="collection-list">
        <view class="collection-item" v-for="(item, index) in data.list" :key="index">
          <image class="cover-image" :src="item.cover" mode="widthFix" />
          <view class="item-info">
            <view class="info-top">
              <text class="title">{{ item.title }}</text>
              <text class="price">¥{{ item.price }}</text>
            </view>
            <view class="info-bottom">
              <text class="time">{{ differTime(item.created_at) }}</text>
              <view class="like-area">
                <text style="font-size: 56rpx;color: #ccc;" class="iconfont icon-love"></text>
                <text class="like-count">{{ item.likes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>

import { onLoad } from '@dcloudio/uni-app';
import { reqGetUserGoods } from '../../api/square';
import { ref, reactive, onMounted } from 'vue';
import { differTime } from '@/utils/times';
import useUserStore from '../../store/module/user';

const userStore = useUserStore()

const isRefreshing = ref(false);



let data = reactive<{
  list: any[]
  friendId: string
  friendname: string
}>({
  list: [],
  friendId: '',
  friendname: ''
})
onMounted(() => {
  getData()
})

onLoad((options) => {
  console.log(options)
  data.friendId = options?.friendId || ''
  data.friendname = options?.friendname || ''
})

const getData = async () => {
  const query = {
    id: data.friendId ? parseInt(data.friendId) : userStore?.UInfo!.id
  }
  const res = await reqGetUserGoods(query)
  if (res.code == 200) {
    data.list = res.data.map((i: any) => ({
      ...i,
      cover: i.images ? i.images.split(',')[0] : ''
    }))
    console.log(data)
  }
}

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`
  })
}



</script>

<style scoped>
.collection-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  overflow: auto;
}

.collection-list {
  padding: 20rpx;
}

.collection-item {
  margin-bottom: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  display: block;
}

.item-info {
  padding: 24rpx;
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.title {
  flex: 1;
  font-size: 14px;
  color: #333333;
  margin-right: 20rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #999999;
}

.like-area {
  display: flex;
  align-items: center;
}

.like-count {
  font-size: 14px;
  color: #999999;
  margin-right: 8rpx;
}
</style>

