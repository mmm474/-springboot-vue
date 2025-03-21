<template>
  <view class="container">
    <view class="title">注册!</view>
    <form>
      <view class="Spa">手机号注册</view>
      <input type="text" placeholder="请输入手机号" v-model="data.form.username" />
      <input type="text" placeholder="请输入密码" v-model="data.form.password" />
      <view class="yzmBox">
        <input type="text" placeholder="请输入验证码" v-model="data.CapCode">
        <view class="imgBox" @tap="reCreate">
          <img class="code" :src="data.codeUrl" alt="网络缓慢" @click="getCode">
        </view>
      </view>
      <button @tap="finshReg">注册</button>
      <view class="txt">
        <text>注册成功，</text>
        <text @tap="goLogin" style="color: rgb(13, 77, 214);">返回登录</text>
      </view>
    </form>
    <up-toast ref="uToastRef"></up-toast>
  </view>
</template>

<script lang="ts" setup>
import { reqCheckCode, reqGetCode, reqUserReg } from "@/api/user"
// import { reqCaptcha, reqValidateCode } from '@/api/tools'
import { ref, reactive, onMounted } from 'vue';

const form = ref()
const data = reactive({
  CapCode: '',
  codeUrl: '',
  form:{
    username:'',
    password:'',
  }
})

const uToastRef = ref()

onMounted(() => {
  getCode()
})

// 获取验证码
const getCode = async () => {
  let res = await reqGetCode()
  data.codeUrl = res.data
}
// 验证验证码
const checkForm = async () => {
  // console.log(uToastRef)
  const cookie = uni.getStorageSync('codeText');
  console.log(cookie);
  const query = {
    code: data.CapCode,
  }
  if(data.form.password==='' || data.form.password==''){
    uToastRef.value && uToastRef.value.show({
      type: 'error',
      message: "请输入密码",
      position: 'top',
      duration: 1000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
    })
    return false
  }
  let res = await reqCheckCode(query)
  if (res.code == 200) {
    return true
  } else {
    uToastRef.value && uToastRef.value.show({
      type: 'error',
      message: "验证码错误",
      position: 'top',
      duration: 1000,
      iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
    })
    reCreate()
    return false
  }
}
// 重新获取验证码
const reCreate = async () => {
  let res = await reqGetCode()
  data.codeUrl = res.data + "?" + Math.random()
}

// 提交
const finshReg = async () => {
  let submit = await checkForm()
  if (submit) {
    const query = {
      username: data.form.username,
      password: data.form.password
    }
    let res = await reqUserReg(query)
    if (res.code == 200) {
      uToastRef.value && uToastRef.value.show({
        message: '注册成功',
        type: 'success',
        position: 'top',
        duration: 1000,
        iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
      })
      setTimeout(() => {
        goLogin()
      }, 1000)
    } else {
      uToastRef.value&&uToastRef.value.show({
        message: res.msg,
        type: 'error',
        position: 'top',
        duration: 1000,
        iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
      })
      resetIpt()
    }
  } else {
    return
  }
}

const goLogin = () => {
  uni.redirectTo({
    url: '/pages/login/index'
  })
}

const resetIpt = () => {
  data.form.password = ""
  data.form.username = ""
  form.value && form.value.resetFields()
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  background: -webkit-linear-gradient(top, rgb(244, 157, 4), #FACF94, white);
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  box-sizing: border-box;
  position: relative;

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
      margin-top: 40rpx;
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

    .yzmBox {
      width: 100%;
      height: 100rpx;
      display: flex;

      input {
        flex-grow: 1;
        height: 100%;
        margin-right: 40rpx;
      }

      .imgBox {
        width: 340rpx;
        height: 100%;
        

        .code {
          width: 100%;
          height: 100%;
        }
      }
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