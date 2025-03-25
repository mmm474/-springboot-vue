<template>
  <view class="container">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }"
      >社区广场</view
    >
    <view class="list" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <scroll-view
        class="list-container"
        scroll-y
        @scrolltolower="loadMore"
        @refresherrefresh="refresh"
        refresher-enabled
        :refresher-triggered="isRefreshing"
      >
        <view class="item" v-for="item in data.list" :key="item.id">
          <view class="top_box">
            <image
              mode="widthFix"
              :src="
                item.user.avatar ? item.user.avatar : '../../static/avatar.png'
              "
            />
            <view class="des">
              <text>{{
                item.user.nickname ? item.user.nickname : "用户" + item.user.id
              }}</text>
              <text>{{ differTime(item.created_at) }}</text>
            </view>
          </view>
          <view class="mid_box">
            <view class="title">{{ item.title }}</view>
            <view class="des" style="margin-bottom: 15rpx">{{
              item.descr
            }}</view>
            <view class="img_box">
              <image
                @click="preview($event, item.images ? item.images : [], index)"
                v-for="(i, index) in item.images"
                :key="index"
                :src="i"
                mode="scaleToFill"
              />
            </view>
          </view>
          <view class="bot_box">
            <text class="iconfont icon-share"
              >&nbsp;<text style="font-size: 30rpx">分享</text></text
            >
            <text @click="goDetail(item.id)" class="iconfont icon-pinglun"
              >&nbsp;<text style="font-size: 30rpx"
                >评论{{
                  item.remarks.length > 0 ? "&nbsp;" + item.remarks.length : ""
                }}</text
              ></text
            >
            <text class="iconfont icon-shoucang"
              >&nbsp;<text style="font-size: 30rpx"
                >收藏{{ item.likes > 0 ? "&nbsp;" + item.likes : "" }}</text
              ></text
            >
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 发布按钮 -->
    <view class="btn_input" @click="goShare">
      <image src="../../static/square/ipt.png" mode="scaleToFill" />
    </view>
  </view>
</template>



<script setup lang='ts'>
import { ref, reactive, onMounted } from "vue"
import { onShow } from "@dcloudio/uni-app"
import { getSquareList } from "../../api/square"
import type { goodsDetail } from "../../types/square"
import { differTime } from "@/utils/times"
const { safeAreaInsets } = uni.getSystemInfoSync()
const isRefreshing = ref(false)
const options = reactive({
  pageSize: 10,
  page: 1,
})

const data = reactive<{ list: goodsDetail[] }>({
  list: [],
})
onMounted(() => {
  getList()
})

const loadMore = () => {
  // 加载更多逻辑
  options.page++
  getList()
}

const refresh = () => {
  options.page = 1
  isRefreshing.value = true
  getList().then(() => {
    isRefreshing.value = false
  })

  return
}

const getList = async () => {
  const res = await getSquareList(options)
  if (res.code === 200) {
    let dlist
    if (res.data.length > 0) {
      dlist = res.data.map((i) => ({
        ...i,
        images: i.images ? i.images.split(",") : [],
      }))
    } else {
      if (options.page === 1) {
        return
      }
      options.page--
    }
    data.list = [...data.list, ...(dlist || [])]
  }
}

onShow(() => {
  getList()
})

// 图片预览
const preview = (e: any, list: string[], index: number) => {
  e.stopPropagation()
  uni.previewImage({
    urls: list,
    current: index,
  })
}

// 计算时差

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`,
  })
}

const goShare = () => {
  uni.navigateTo({
    url: `/pages/share/index`,
  })
}
</script>
<style lang='scss' scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
  box-sizing: border-box;
  align-items: center;
  padding-top: 70rpx;

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

  .list {
    padding-top: 12rpx;
    height: 100%;
    overflow: hidden;
    // margin-top: 70rpx;
    width: 100%;
    // height: 2000rpx;

    .list-container {
      flex: 1;
      overflow: auto;
      padding: 20rpx;

      height: 100%;
      // overflow: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .item {
      width: 100%;
      height: auto;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20rpx;

      .top_box {
        width: 100%;
        height: 120rpx;
        display: flex;
        align-items: center;

        image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }

        .des {
          margin-left: 20rpx;
          flex-grow: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          text {
            &:nth-child(1) {
              font-size: 30rpx;
              font-weight: bold;
            }

            &:nth-child(2) {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }

      .mid_box {
        width: 100%;
        border-bottom: 1px solid #eee;

        .img_box {
          width: 100%;

          image {
            width: 100%;
            object-fit: fill;
          }
        }

        .title {
          font-size: 30rpx;
          font-weight: bold;
          margin-bottom: 20rpx;
        }

        .des {
          width: 100%;
        }
      }

      .bot_box {
        width: 100%;
        // height: 120rpx;
        margin-bottom: 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;

        text {
          font-size: 40rpx;
          color: #999;
        }
      }
    }
  }

  .btn_input {
    right: 20rpx;
    bottom: 100rpx;
    position: fixed;
    width: 100rpx;
    height: 100rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>