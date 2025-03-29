<template>
  <view class="page">
    <view class="title_box" :style="{ marginTop: safeAreaInsets?.top + 'px' }">个人信息</view>
    <view class="nav" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="nav-content">
        <uni-icons @click="goBack" type="back" size="18" color="#374151" />
        <text></text>
        <view>
          <up-button type="primary" size="small" class="save-btn" :disabled="loading" @click="handleSave"
            :loading="loading" loadingText="正在上传">保存</up-button>
        </view>
      </view>
    </view>

    <view class="main">
      <view class="avatar-section">
        <view class="avatar-container">
          <image class="avatar-image" :src="avatar" />
          <button class="camera-btn" @tap="changeAvatar">
            <uni-icons type="camera-filled" size="16" color="#FFFFFF" />
          </button>
        </view>
        <text class="avatar-tip">点击更换头像</text>
      </view>

      <view class="form-section">
        <view class="form-item">
          <text class="form-label">昵称</text>
          <view class="input-container">
            <input type="text" class="input" placeholder="请输入昵称" v-model="nickname" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <view class="input-container">
            <input type="text" class="input" placeholder="请输入手机号" v-model="phone" />
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">性别</text>
          <view class="sex-group">
            <up-radio-group v-model="sex" placement="row">
              <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in genderOptions" :key="index"
                :label="item.label" :name="item.value">
              </up-radio>
            </up-radio-group>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">个人简介</text>
          <view class="textarea-container">
            <up-textarea class="textarea" v-model="describes" placeholder="介绍一下自己吧" count />
            <!-- <text class="word-count">{{ describes.length }}/140</text> -->
          </view>
        </view>
        <!-- <view class="form-item">
          <text class="form-label">所在地</text>
          <view class="select-container" @click="handleSelectLocation">
            <text class="select-text">{{ location }}</text>
            <uni-icons type="right" size="16" color="#9CA3AF" />
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">生日</text>
          <view class="select-container" @click="handleSelectBirthday">
            <text class="select-text">{{ birthday }}</text>
            <uni-icons type="right" size="16" color="#9CA3AF" />
          </view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const { safeAreaInsets } = uni.getSystemInfoSync()
import { onShow } from "@dcloudio/uni-app"
import useUserStore from "@/store/module/user"
const userStore = useUserStore()
import { ref } from "vue"
const avatar = ref("")
const nickname = ref("")
const sex = ref("0")
const describes = ref("")
const phone = ref("444")
const files = ref<File>()
const upVal = ref("")
const loading = ref(false)
const genderOptions = [
  { label: "男", value: "0" },
  { label: "女", value: "1" },
  { label: "保密", value: "-1" },
]

onShow(() => {
  avatar.value = userStore.UInfo?.avatar as string
  nickname.value = userStore.UInfo?.nickname || ""
  sex.value = (userStore.UInfo?.sex as number).toString()
  describes.value = userStore.UInfo?.describes || ""
  phone.value = userStore.UInfo?.phone || ""
})

const goBack = () => {
  uni.navigateBack()
}

const handleSave = async () => {
  loading.value = true
  if (nickname.value === "") {
    uni.showToast({
      title: "请输入昵称",
      icon: "error",
    })
    return
  }
  const query = {
    nickname: nickname.value,
    sex: parseInt(sex.value),
    describes: describes.value,
    phone: phone.value,
  }
  try {
    await userStore.userUpInfo(query, upVal.value)
    uni.showToast({
      title: "保存成功",
      icon: "success",
    })
  } catch (error) {
    uni.showToast({
      title: "保存失败",
      icon: "error",
    })
  }
  loading.value = false
}

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      if (Array.isArray(res.tempFiles)) {
        files.value = res.tempFiles[0] as File
      }
      avatar.value = res.tempFilePaths[0]
      upVal.value = res.tempFilePaths[0]
    },
    fail: (fail) => {
      console.log(fail)
    },
  })
}

const handleGenderChange = (value: string) => {
  sex.value = value
}

const handleSelectLocation = () => {
  // 处理选择地址逻辑
}

const handleSelectBirthday = () => {
  // 处理选择生日逻辑
}
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f9fafb;
}

.title_box {
  z-index: 999;
  background-color: #f9fafb;
  position: fixed;
  top: 0;
  height: 80rpx;
  width: 100%;
  font-weight: bold;
  text-align: center;
  line-height: 80rpx;
}

.nav {
  background-color: #ffffff;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
  z-index: 100;
}

.nav-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
}

.nav-title {
  font-size: 24px;
  font-weight: 500;
  color: #1f2937;
}

.save-btn {
  /* font-size: 40rpx;
  color: #4f46e5; */
  /* background: none; */
  /* padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  height: 60rpx;
  border: none;

  margin: 0; */
}

.main {
  padding: 120rpx 32rpx 40rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64rpx;
}

.avatar-container {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 4rpx solid #4f46e5;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 64rpx;
  height: 64rpx;
  border-radius: 100%;
  background-color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.avatar-tip {
  font-size: 24px;
  color: #6b7280;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 48rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.form-label {
  font-size: 36rpx;
  color: #374151;
}

.input-container {
  position: relative;
  font-size: 28rpx;
}

.input {
  height: 70rpx;
  padding: 0 32rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.sex-group {
  display: flex;
  gap: 48rpx;
}

.sex-label {
  display: flex;
  align-items: center;
}

.sex-text {
  margin-left: 16rpx;
  font-size: 32rpx;
  color: #374151;
}

.textarea-container {
  position: relative;
  width: auto;
}

.textarea {
  /* width: 100%; */
  /* height: 180rpx; */
  padding: 32rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.word-count {
  position: absolute;
  bottom: 16rpx;
  right: 58rpx;
  font-size: 24rpx;
  color: #9ca3af;
}

.select-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 32rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
}

.select-text {
  font-size: 28px;
  color: #374151;
}
</style>
