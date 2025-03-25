<template>
  <view class="container">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }"
      >商品详情</view
    >
    <!-- 商品标题 -->
    <view class="title-section">
      <text class="title">{{ data.info.title }}</text>
    </view>
    <!-- 发布者信息 -->
    <view class="publisher-section">
      <view class="publisher-info">
        <image
          class="avatar"
          :src="data.info.user?.avatar ? data.info.user?.avatar : ''"
          mode="aspectFill"
        ></image>
        <text class="publisher-name">{{ data.info.user?.nickname }}</text>
      </view>
      <view class="add-friend-btn">
        <up-button
          v-if="data.info.user?.id !== userStore.UInfo?.id && !data.isFriend"
          class="btn"
          type="primary"
          text="关注"
          @click="addFriend"
        ></up-button>
        <up-button
          v-if="data.info.user?.id !== userStore.UInfo?.id && data.isFriend"
          class="btn"
          type="error"
          text="取消关注"
          @click="delFriend"
        ></up-button>
      </view>
    </view>
    <!-- 商品详情 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="detail-section">
        <text class="detail-text">{{ data.info.descr }}</text>
        <view class="image-list">
          <image
            v-for="(img, index) in data.info.images"
            :key="index"
            :src="img"
            mode="widthFix"
            class="product-image"
            @click="preview($event, data.info.images, index)"
          ></image>
        </view>
      </view>
      <!-- 价格区域 -->
      <view class="price-section">
        <view class="left-section">
          <text class="price">¥ {{ data.info.price }}</text>
          <!-- <view class="like-btn">
            <text style="font-size: 48rpx;" v-if="data.isLike" class="iconfont icon-aixin" @click="downLike"></text>
            <text style="color: #ccc;font-size: 48rpx;" v-else class="iconfont icon--like-in" @click="onLike"></text>
          </view> -->
        </view>
        <view
          class="order-btn"
          v-if="data.info.user?.id !== userStore.UInfo?.id"
        >
          <up-button type="primary" @click="handleOrder">立即下单</up-button>
        </view>
        <view class="order-btn" v-else>
          <up-button type="error" @click="handleOrder">取消发布</up-button>
        </view>
      </view>
      <!-- 留言区域 -->
      <view class="comment-section">
        <text class="comment-title">留言区</text>
        <view class="comment-input-area">
          <!-- <input type="text" v-model="data.contnet" placeholder="说点什么..." class="comment-input" />
          <up-button type="primary">发送</up-button> -->
        </view>
        <view class="comment-list">
          <view
            v-for="(comment, index) in data.info.remarks"
            :key="index"
            class="comment-item"
          >
            <image
              :src="comment?.avatar"
              class="comment-avatar"
              mode="aspectFill"
            ></image>
            <view class="comment-content">
              <text class="comment-username">{{ comment?.nickname }}</text>
              <text class="comment-text">{{ comment?.content }}</text>
              <text class="comment-time">{{
                differTime(comment?.created_at)
              }}</text>
            </view>
          </view>
        </view>
      </view>

      <up-popup
        :show="options.pop_flag"
        mode="bottom"
        @close="closePop"
        class="pop_box"
      >
        <view
          style="
            width: 100vw;
            height: 400rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding-top: 24rpx;
          "
        >
          <textarea
            v-model="data.contnet"
            name=""
            id=""
            cols="30"
            rows="10"
            style="background-color: #eee; width: 90%; padding: 20rpx"
          ></textarea>
          <view style="width: 90%; margin-top: 20rpx">
            <up-button @click="sendMark" type="primary" text="发送"></up-button>
          </view>
        </view>
      </up-popup>

      <u-toast ref="uToastRef"></u-toast>

      <view class="input_box">
        <view @click="options.pop_flag = true"></view>
        <text
          style="font-size: 56rpx"
          v-if="data.isLike"
          class="iconfont icon-love"
          @click="downLike"
        ></text>
        <text
          style="color: #ccc; font-size: 56rpx"
          v-else
          class="iconfont icon-love"
          @click="onLike"
        ></text>
      </view>
    </scroll-view>
  </view>
</template>
<script setup lang='ts'>
import { differTime } from "@/utils/times"
import type { goodsDetail } from "../../types/square"
import { onLoad } from "@dcloudio/uni-app"
import {
  reqGetDetail,
  reqPublishComment,
  reqLike,
  reqGetUserLikes,
  reqDelLike,
  reqGoodsStep,
} from "../../api/square"
import { reqAddFriend, reqFriendDel, reqFriendList } from "../../api/user"
import { ref, onMounted, reactive } from "vue"
import useUserStore from "../../store/module/user"
const userStore = useUserStore()
const options = reactive({
  pop_flag: false,
})
let uToastRef = ref()
const data = reactive<{
  articl_id: number
  info: goodsDetail
  contnet: string
  isLike: boolean
  isFriend: boolean
}>({
  articl_id: -1,
  // @ts-ignore
  info: {},
  contnet: "",
  isLike: false,
  isFriend: false,
})

// onMounted(() => {
// getInfo()
// addStep()
// getUserLikes()
// getFriends()
// })

const test = () => {
  console.log(data.info)
}

const addFriend = async () => {
  data.isFriend = true
  const res = await reqAddFriend({
    friendId: data.info!.user!.id!.toString(),
  })
  if (res.code == 200) {
    uToastRef.value.show({
      message: "关注成功",
      type: "success",
      duration: 2000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
    })
  }
}

const delFriend = async () => {
  data.isFriend = false
  const res = await reqFriendDel({
    friendId: data.info!.user?.id!.toString(),
  })
  if (res.code == 200) {
    uToastRef.value.show({
      message: "取消关注成功",
      type: "success",
      duration: 2000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
    })
  }
}

const getFriends = async () => {
  const res = await reqFriendList()
  const hasAdd = res.data.find((item) => item.friendId == data.info!.user!.id)
  if (hasAdd) {
    data.isFriend = true
  } else {
    data.isFriend = false
  }
}

const getInfo = async () => {
  const query = {
    id: data.articl_id,
  }
  let res = await reqGetDetail(query)
  console.log("2312312", res)
  if (res.code == 200) {
    // @ts-ignore
    data.info = res.data
    data.info.images = res.data.images ? res.data.images.split(",") : []
  }
}

const getUserLikes = async () => {
  const res = await reqGetUserLikes()
  if (res.data.length === 0) data.isLike = false
  if (res.code == 200) {
    const isLike = res.data.find((item: any) => item.goods.id == data.articl_id)
    console.log("555145", isLike)
    if (isLike) {
      data.isLike = true
    } else {
      data.isLike = false
    }
  }
}

onLoad((options) => {
  console.log("111", options)
  data.articl_id = options?.id
  getInfo()
  addStep()
  getUserLikes()
  getFriends()
})

const addStep = async () => {
  await reqGoodsStep({ id: data.articl_id })
}

const preview = (e: any, list: string[], index: number) => {
  e.stopPropagation()
  uni.previewImage({
    urls: list,
    current: index,
  })
}

const handleOrder = () => {
  return
}

// 发布评论
const sendMark = async () => {
  if (!data.contnet) return
  const query = {
    id: data.articl_id,
    content: data.contnet,
  }
  console.log(query)
  let res = await reqPublishComment(query)
  if (res.code == 200) {
    getInfo()
    data.contnet = ""
  } else {
    uToastRef.value.show({
      type: "error",
      message: res.msg,
      position: "top",
      duration: 1000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/error.png",
    })
  }
  options.pop_flag = false
}

// 点赞
const onLike = async () => {
  data.isLike = true
  const query = {
    id: data.info?.id,
  }
  const res = await reqLike(query)
  if (res.code == 200) {
    // getInfo()
    // getUserLikes()
    uToastRef.value.show({
      message: "收藏成功",
      type: "success",
      duration: 2000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
    })
  } else {
    uToastRef.value.show({
      type: "error",
      message: res.msg,
      position: "top",
      duration: 1000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/error.png",
    })
  }
}

// 取消点赞
const downLike = async () => {
  data.isLike = false
  const query = {
    id: data.info?.id,
  }
  const res = await reqDelLike(query)
  console.log(res)
  if (res.code == 200) {
    getInfo()
    getUserLikes()
    uToastRef.value.show({
      message: "已取消收藏",
      type: "success",
      duration: 2000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
    })
  } else {
    uToastRef.value.show({
      type: "error",
      message: res.msg,
      position: "top",
      duration: 1000,
      iconUrl: "https://cdn.uviewui.com/uview/demo/toast/error.png",
    })
  }
}

const closePop = () => {
  options.pop_flag = false
}
</script>
<style scoped lang="scss">
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

.input_box {
  height: 145rpx;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: 30rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  // background-color: red;
  padding: 0 20rpx;
  box-sizing: border-box;
  justify-content: space-around;
  border-top: 1px solid #eee;

  view {
    height: 60rpx;
    background-color: #eee;
    width: 80%;
    border-radius: 10rpx;
  }

  text {
    color: red;
    font-size: 40rpx;
  }
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.title-section {
  padding: 30rpx 30rpx 20rpx;
  background-color: #ffffff;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

.publisher-section {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}

.publisher-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.publisher-name {
  font-size: 14px;
  color: #333333;
}

.add-friend-btn {
  display: flex;
  align-items: center;
  background-color: #007aff;
}

.add-friend-btn text {
  color: #ffffff;
  margin-left: 10rpx;
}

.content-scroll {
  flex: 1;
  overflow: auto;
}

.detail-section {
  padding: 30rpx;
  background-color: #ffffff;
}

.detail-text {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

.image-list {
  margin-top: 30rpx;
}

.product-image {
  width: 100%;
  margin-bottom: 20rpx;
}

.price-section {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  margin-top: 20rpx;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.like-count {
  font-size: 14px;
  color: #999;
}

.price {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: bold;
}

.order-btn {
  width: 240rpx;
}

.comment-section {
  padding-bottom: 80rpx;
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #ffffff;
}

.comment-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
}

.comment-input-area {
  display: flex;
  margin-bottom: 30rpx;
  margin-top: 20px;
}

.comment-input {
  flex: 1;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 14px;
  margin-right: 20rpx;
}

.send-btn {
  width: 140rpx;
}

.comment-list {
  margin-bottom: 150px;
  padding-top: 20rpx;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.comment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.comment-content {
  flex: 1;
}

.comment-username {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.comment-text {
  font-size: 14px;
  color: #666666;
  margin-bottom: 10rpx;
  display: block;
}

.comment-time {
  font-size: 12px;
  color: #999999;
  display: block;
}
</style>