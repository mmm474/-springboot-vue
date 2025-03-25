
<template>
  <view class="container">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }"
      >我的关注</view
    >
    <!-- 搜索区域 -->
    <view class="search-container">
      <view class="search-box">
        <text
          class="iconfont icon-sousuo"
          style="font-size: 32rpx; color: #999"
        ></text>
        <input
          type="text"
          v-model="searchText"
          placeholder="输入昵称搜索好友"
          placeholder-class="placeholder"
          class="search-input"
        />
      </view>
    </view>

    <!-- 好友列表区域 -->
    <scroll-view class="friend-list" scroll-y>
      <view v-for="item in data.list" :key="item.id" class="friend-item">
        <image :src="item.avatar" class="avatar" mode="aspectFill" />
        <text class="nickname">{{ item.nickname }}</text>
        <view class="actions">
          <up-button
            type="primary"
            @click="viewFriend(item)"
            class="action-btn view-btn"
          >
            查看
          </up-button>
          <up-button
            type="error"
            @click="showDeleteConfirm(item)"
            class="action-btn delete-btn"
          >
            删除
          </up-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from "vue"
import { reqFriendDel, reqFriendList } from "../../api/user"
import type { Uinfo } from "../../types/user"

interface Friend {
  id: number
  nickname: string
  avatar: string
  friendId: number
  sex: number
  phone: string
  user: Uinfo
}

const searchText = ref("")

let data = reactive<{ list: Friend[] }>({
  list: [],
})

onMounted(() => {
  getList()
})

const getList = async () => {
  const res = await reqFriendList()
  if (res.code === 200) {
    data.list = res.data
  }
}

watch(searchText, (newVal) => {
  if (newVal) {
    data.list = data.list.filter((friend) =>
      friend.nickname.toLowerCase().includes(newVal.toLowerCase())
    )
  } else {
    getList()
  }
})

const viewFriend = (friend: Friend) => {
  uni.redirectTo({
    url: `/pages/works/index?friendId=${friend.friendId}&friendname=${friend.nickname}`,
  })
}

const showDeleteConfirm = (friend: Friend) => {
  uni.showModal({
    title: "提示",
    content: `确定取消关注"${friend.nickname}"吗？`,
    success: async (res) => {
      if (res.confirm) {
        await deleteFriend(friend)
      }
    },
  })
}

const deleteFriend = async (friend: Friend) => {
  const res = await reqFriendDel({
    friendId: friend.friendId.toString(),
  })
  if (res.code === 200) {
    uni.showToast({
      title: "取消关注成功",
      icon: "success",
    })
    getList()
  } else {
    uni.showToast({
      title: "取消关注失败",
      icon: "error",
    })
  }
}
</script>

<style scoped>
page {
  height: 100%;
}

.title_box {
  z-index: 999;
  background-color: #fff;
  position: fixed;
  top: 0;
  height: 80rpx;
  width: 100%;
  font-weight: bold;
  text-align: center;
  line-height: 80rpx;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.search-container {
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #eaeaea;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 36rpx;
  padding: 16rpx 24rpx;
}

.search-input {
  flex: 1;
  margin-left: 16rpx;
  font-size: 14px;
}

.placeholder {
  color: #999999;
  font-size: 14px;
}

.friend-list {
  flex: 1;
  overflow: auto;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
}

.nickname {
  flex: 1;
  margin-left: 20rpx;
  font-size: 16px;
  color: #333333;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  margin: 0;
  height: 70rpx;
}

.view-btn {
  background-color: #007aff;
}

.delete-btn {
  background-color: #ff3b30;
}
</style>

