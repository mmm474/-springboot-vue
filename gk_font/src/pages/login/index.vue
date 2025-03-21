<template>
  <view class="container">
    <view class="title">欢迎登录!</view>
    <form>
      <view class="Spa">账号密码登录</view>
      <input type="text" placeholder="请输入你的手机号" v-model="data.username">
      <input type="text" placeholder="请输入你的密码" v-model="data.password">
      <button @tap.prevent="goLogin">登录</button>
      <view class="txt"><text>没有账号？</text><text @tap="goReg" style="color: rgb(13, 77, 214);">立马注册</text></view>
    </form>
    <u-toast ref="uToastRef"></u-toast>
  </view>
</template>
<script setup lang='ts'>
import { reqUserLogin } from "@/api/user"
import { ref, reactive } from 'vue';
import useUserStore from '@/store/module/user';
const userStore = useUserStore()

let uToastRef = ref()
const data = reactive({
  username: "",
  password: "",
})

const goLogin = () => {
  console.log('asdsadsadasd')
  uni.login({
    success: async (result) => {
      const query = {
        username: data.username,
        password: data.password,
        user_code: result.code
      }
      try {
        await userStore.getLogin(query)
        uToastRef.value.show({
          message: '登录成功',
          type: 'success',
          duration: 2000,
          iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
        })
        uni.switchTab({
          url: '/pages/index/index'
        })
      } catch (error) {
        console.log(error)
        uToastRef.value.show({
          message: error,
          type: 'error',
          duration: 2000,
          iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
        })
        resetIpt()
      }
    },
    fail: (error) => {
      uToastRef.value.show({
        message: '系统异常，稍后再试',
        type: 'error',
        duration: 2000,
        iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
      })
    }
  })
}

const goReg = () => {
  uni.redirectTo({
    url: '/pages/reg/index'
  })
}
const resetIpt = () => {
  data.password = ""
  data.username= ""
}

</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100vh;
  background: -webkit-linear-gradient(top, rgb(244, 157, 4), #FACF94, white);
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  box-sizing: border-box;

  .title {
    margin-top: 250rpx;
    height: 100rpx;
    font-size: 55rpx;
    font-weight: bold;
  }

  form {
    width: 100%;
    height: 400rpx;

    display: flex;
    flex-direction: column;


    .Spa {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
    }

    input {
      width: 100%;
      height: 100rpx;
      border-radius: 50rpx;
      background-color: #fff;
      margin-bottom: 40rpx;
      font-size: 32rpx;
      padding-left: 40rpx;
      box-sizing: border-box;
    }

    button {
      width: 400rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background-color: rgb(242, 157, 45);
      color: #fff;
      font-size: 40rpx;
      font-weight: bold;
      text-align: center;
      line-height: 100rpx;
    }

    .txt {
      margin-top: 10rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        color: #999;
        font-size: 26rpx;
      }
    }
  }
}
</style>