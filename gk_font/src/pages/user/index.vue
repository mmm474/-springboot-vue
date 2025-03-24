<template>
  <view class="container">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }">个人中心</view>
    <view class="info_box">
      <view class="avatar_box">
        <image :src="userStore.UInfo?.avatar" />
        <view class="brief">
          <text>{{ userStore.UInfo?.nickname }}</text>
          <text>{{ userStore.UInfo?.describes || "此人还没有简介~~~" }}</text>
        </view>
      </view>
      <text style="color: #ccc;" class="iconfont icon-bianji" @click="editInfo">编辑资料></text>
    </view>
    <view class="case_box">
      <view class="item">
        <image src="../../static/user/love.png" mode="scaleToFill" @click="goLikes" />
        <text>我的收藏</text>
      </view>

      <view class="item">
        <image src="../../static/user/work.png" mode="scaleToFill" @click="goWorks" />
        <text>我的商品</text>
      </view>

      <view class="item">
        <image src="../../static/user/friend.png" mode="scaleToFill" @click="goFriend" />
        <text>我的关注</text>
      </view>
    </view>
    <view v-if="data.list.length > 0" class="title">足迹</view>
    <view v-if="data.list.length > 0" class="history_box">
      <scroll-view scroll-x style="height: 250rpx; width: 100%;">
        <view style="width: 300%;height: 100%;">
          <view class="scoll">
            <view class="scoll_item" v-for="item in data.list" :key="item.history_id" @click="goDetail(item)">
              <image :src="item.cover" mode="scaleToFill" v-if="item.cover" />
              <div v-if="!item.cover" class="blank"></div>
              <text>{{ item.title }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="set_box">
      <view class="item">
        <text class="iconfont icon-henggang" style="color: red;"></text>
        <text>&nbsp;&nbsp;消息</text>
      </view>
      <view class="item" v-if="userStore.token" @click="Logout">
        <text class="iconfont icon-henggang" style="color: blue;"></text>
        <text>&nbsp;&nbsp;退出</text>
      </view>
      <view class="item" @click="goLogin" v-else>
        <text class="iconfont icon-henggang" style="color: blue;"></text>
        <text>&nbsp;&nbsp;登录</text>
      </view>
    </view>
  </view>
</template>
<script setup lang='ts'>
import { onMounted, ref, reactive } from 'vue';
import useUserStore from '@/store/module/user';
import { reqGetUserStep } from '@/api/square';
import { onShow } from '@dcloudio/uni-app';
const userStore = useUserStore()
const { safeAreaInsets } = uni.getSystemInfoSync()

const data = reactive<{ list: any[] }>(
  {
    list: []
  }
)


onShow(() => {
  getInfo()
  getRecords()
})

const getRecords = async () => {
  const res = await reqGetUserStep()
  data.list = res.data
}

const goDetail = (item: any) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${item.goodid}`
  })
}

const getInfo = async () => {
  await userStore.userInfo()
}

const goLikes = () => {
  console.log('22222')
  uni.redirectTo({
    url: '/pages/likes/index'
  })
}

const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

const Logout = async () => {
  // await userStore.userLogout()
  uni.redirectTo({
    url: '/pages/login/index'
  })
}

const editInfo = () => {
  uni.navigateTo({
    url: '/pages/info/index'
  })
}


const goWorks = () => {
  uni.redirectTo({
    url: '/pages/works/index'
  })
}

const goFriend = () => {
  uni.redirectTo({
    url: '/pages/friend/index'
  })
}
</script>
<style lang='scss' scoped>
.container {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
  box-sizing: border-box;

  .title_box {
    height: 80rpx;
    width: 100%;
    font-weight: bold;
    text-align: center;
    line-height: 80rpx;
  }

  .info_box {
    width: 100%;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .avatar_box {
      width: 60%;
      height: 100%;
      display: flex;
      align-items: center;

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 1px solid #eee;
      }

      .brief {
        margin-left: 20rpx;
        width: 350rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        text {
          font-size: 28rpx;

          &:first-child {
            font-size: 35rpx;
            font-weight: bold;
          }
        }
      }
    }
  }

  .case_box {
    margin-top: 20rpx;
    width: 100%;
    height: 180rpx;
    display: flex;
    justify-content: space-between;
    border-radius: 30rpx;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .item {
      width: 200rpx;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      image {
        width: 80rpx;
        height: 80rpx;
      }
    }
  }

  .title {
    margin-top: 20rpx;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 35rpx;
    font-weight: bold;
  }

  .history_box {
    margin-top: 20rpx;
    width: 100%;
    height: 280rpx;
    align-items: center;
    border-radius: 30rpx;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 15rpx 0;
    box-sizing: border-box;


    .scoll {
      display: flex;
      height: 100%;

      .scoll_item {
        height: 100%;
        width: 300rpx;
        margin-right: 30rpx;
        position: relative;

        image {
          width: 100%;
          height: 100%;
          background-color: rgba(39, 114, 188, 0.8);
        }

        .blank {
          width: 100%;
          height: 100%;
          background-color: rgba(39, 114, 188, 0.8);
        }

        text {
          font-size: 35rpx;
          font-weight: bold;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }




  }

  .set_box {
    margin-top: 30rpx;
    width: 100%;
    border-radius: 30rpx;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 0 20rpx;
    padding-bottom: 30rpx;
    box-sizing: border-box;

    .item {
      width: 100%;
      height: 100rpx;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;

      text {
        font-size: 35rpx;

        &:first-child {
          font-size: 50rpx;
        }
      }
    }
  }
}
</style>