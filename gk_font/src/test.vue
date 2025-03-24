<!-- <template>
  <view class="container">
    <view class="info_box">
      <view class="title">{{ data.info.title }}</view>
      <view class="user_box">
        <image :src="data.info.user?.avatar ? data.info.user?.avatar : '../../static/avatar.png'" mode="scaleToFill" />
        <text>靓仔</text>
        <view class="btn">
          <up-button v-if="data.info.user.id !== userStore.UInfo.id && !data.isFriend" class="btn" type="primary"
            text="关注" @click="addFriend"></up-button>
          <up-button v-if="data.info.user.id !== userStore.UInfo.id && data.isFriend" class="btn" type="error" text="取消关注"
            @click="delFriend"></up-button>
        </view>
      </view>
      <view class="des">{{ data.info.descr }}</view>
      <view class="img_box">
        <image v-for="(item, index) in data.info.images" :src="item" mode="scaleToFill" />
      </view>
    </view>
    <view class="marks_box">
      <view class="title">
        <text class="iconfont icon-pinglun">&nbsp;<text style="color: #000;">评论</text></text>
      </view>
      <view class="mark_list">
        <view class="item" v-for="item in data.info.remarks" :key="item.id">
          <view class="user_box">
            <image :src="item.avatar ? item.avatar : '../../static/avatar.png'" mode="scaleToFill" />
            <text>{{ item.nickname ? item.nickname : '用户' + '' }}</text>
          </view>
          <view class="mark">{{ item.content }}</view>
        </view>
      </view>
    </view>
  
    <up-popup :show="options.pop_flag" mode="bottom" @close="closePop" class="pop_box">
      <view
        style="width: 100vw;height: 400rpx;  display: flex;align-items: center;justify-content: center;flex-direction: column;padding-top: 24rpx;">
        <textarea v-model="data.contnet" name="" id="" cols="30" rows="10"
          style="background-color:#eee;width: 90%;padding: 20rpx;"></textarea>
        <view style="width: 90%;margin-top: 20rpx;">
          <up-button @click="sendMark" type="primary" text="发送"></up-button>
        </view>
      </view>
    </up-popup>

    <u-toast ref="uToastRef"></u-toast>
  </view>
  <view class="input_box">
    <view @click="options.pop_flag = true"></view>
    <text v-if="data.isLike" class="iconfont icon-aixin" @click="downLike"></text>
    <text style="color: #ccc;" v-else class="iconfont icon--like-in" @click="onLike"></text>
  </view>
</template>
<script setup lang='ts'>
import type { goodsDetail } from "../../types/square"
import { onLoad } from '@dcloudio/uni-app';
import { reqGetDetail, reqPublishComment, reqLike, reqGetUserLikes, reqDelLike, reqGoodsStep } from "../../api/square"
import { reqAddFriend, reqFriendDel, reqFriendList } from "../../api/user"
import { ref, onMounted, reactive } from 'vue';
import useUserStore from '../../store/module/user';
const userStore = useUserStore()
const options = reactive({
  pop_flag: false,
})
let uToastRef = ref()
const data = reactive<{ articl_id: number; info: goodsDetail; contnet: string, isLike: boolean, isFriend: boolean }>({
  articl_id: -1,
  // @ts-ignore
  info: {},
  contnet: '',
  isLike: false,
  isFriend: false,
})

onMounted(() => {
  getInfo()
  addStep()
  getUserLikes()
  getFriends()
})

const addFriend = async () => {
  data.isFriend = true
  const res = await reqAddFriend({
    friendId: data.info!.user!.id!.toString()
  })
  if (res.code == 200) {
    uToastRef.value.show({
      message: '关注成功',
      type: 'success',
      duration: 2000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
    })
  }
}

const delFriend = async () => {
  data.isFriend = false
  const res = await reqFriendDel({
    friendId: data.info!.user!.id!.toString()
  })
  if (res.code == 200) {
    uToastRef.value.show({
      message: '取消关注成功',
      type: 'success',
      duration: 2000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
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
    id: data.articl_id
  }
  let res = await reqGetDetail(query)
  if (res.code == 200) {
    data.info = res.data
    data.info.images = res.data.images.split(',')
  }
}

const getUserLikes = async () => {
  const res = await reqGetUserLikes()
  if (res.data.length === 0) data.isLike = false
  if (res.code == 200) {
    const isLike = res.data.find((item: any) => item.goods.id == data.articl_id)
    console.log('555145', isLike)
    if (isLike) {
      data.isLike = true
    } else {
      data.isLike = false
    }
  }
}

onLoad((options) => {
  data.articl_id = options!.id
})

const addStep = async () => {
  await reqGoodsStep({ id: data.articl_id })
}

// 发布评论
const sendMark = async () => {
  if (!data.contnet) return
  const query = {
    id: data.articl_id,
    content: data.contnet
  }
  console.log(query)
  let res = await reqPublishComment(query)
  if (res.code == 200) {
    getInfo()
    data.contnet = ''
  } else {
    uToastRef.value.show({
      type: 'error',
      message: res.message,
      position: 'top',
      duration: 1000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
    })
  }
  options.pop_flag = false
}

// 点赞
const onLike = async () => {
  data.isLike = true
  const query = {
    id: data.info.id,
  }
  const res = await reqLike(query)
  if (res.code == 200) {
    // getInfo()
    // getUserLikes()
    uToastRef.value.show({
      message: '收藏成功',
      type: 'success',
      duration: 2000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
    })
  } else {
    uToastRef.value.show({
      type: 'error',
      message: res.message,
      position: 'top',
      duration: 1000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
    })
  }
}

// 取消点赞
const downLike = async () => {
  data.isLike = false
  const query = {
    id: data.info.id,
  }
  const res = await reqDelLike(query)
  console.log(res)
  if (res.code == 200) {
    getInfo()
    getUserLikes()
    uToastRef.value.show({
      message: '已取消收藏',
      type: 'success',
      duration: 2000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
    })
  } else {
    uToastRef.value.show({
      type: 'error',
      message: res.message,
      position: 'top',
      duration: 1000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
    })
  }
}

const closePop = () => {
  options.pop_flag = false
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
  padding-bottom: 50rpx;

  .info_box {
    width: 100%;
    height: auto;

    .title {
      width: 100%;
      height: 120rpx;
      font-size: 40rpx;
      font-weight: bold;
      line-height: 120rpx;
    }

    .user_box {
      width: 100%;
      height: 120rpx;
      display: flex;
      align-items: center;
      position: relative;

      image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }

      text {
        font-size: 32rpx;
        margin-left: 20rpx;
      }

      .btn {
        width: 120rpx;
        position: absolute;
        right: 0;
      }
    }

    .des {
      padding: 10rpx 0;
      width: 100%;
      font-size: 33rpx;
    }

    .img_box {
      width: 100%;
    }
  }

  .marks_box {
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    margin-bottom: 200rpx;

    .title {
      width: 100%;
      height: 80rpx;
      display: flex;
      align-items: center;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;

      text {
        color: red;
        font-size: 40rpx;
      }
    }

    .mark_list {
      width: 100%;
      height: auto;


      .item {
        margin-top: 20rpx;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;

        .user_box {
          width: 100%;
          height: 80rpx;
          display: flex;
          align-items: center;
          position: relative;


          image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }

          text {
            font-size: 32rpx;
            margin-left: 20rpx;
          }

          .btn {
            width: 120rpx;
            position: absolute;
            right: 0;
          }
        }

        .mark {
          margin-top: 10rpx;
          font-size: 33rpx;
          font-weight: bolder;
          width: 100%;
          padding-bottom: 10rpx;
          padding-left: 80rpx;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
        }


      }
    }
  }

  .pop_box {
    width: 100%;
    height: 500rpx;
    padding: 20rpx;
    box-sizing: border-box;

    view {
      width: 100vw;
      height: 300rpx;

    }
  }
}

.input_box {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 150rpx;
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
</style> -->