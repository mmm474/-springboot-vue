<template>
  <view class="page">
    <view class="nav">
      <view class="nav-content">
        <uni-icons @click="goBack" type="back" size="18" color="#374151" />
        <text></text>
        <text class="nav-title">个人信息</text>
        <button class="save-btn" @click="handleSave">保存</button>
      </view>
    </view>

    <view class="main">
      <view class="avatar-section">
        <view class="avatar-container">
          <image class="avatar-image" :src="avatarUrl" />
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
          <text class="form-label">性别</text>
          <view class="gender-group">
            <label class="gender-label" v-for="(item, index) in genderOptions" :key="index">
              <radio :value="item.value" :checked="gender === item.value" @click="handleGenderChange(item.value)"
                color="#4F46E5" />
              <text class="gender-text">{{ item.label }}</text>
            </label>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">个人简介</text>
          <view class="textarea-container">
            <textarea class="textarea" v-model="introduction" placeholder="介绍一下自己吧" />
            <text class="word-count">{{ introduction.length }}/200</text>
          </view>
        </view>
        <up-button>测试</up-button>
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
import { ref } from 'vue';
const avatarUrl = ref('https://ai-public.mastergo.com/ai/img_res/6d6bd98203a897ea5d6dab4a79182bbd.jpg');
const nickname = ref('陈小萌');
const gender = ref('female');
const introduction = ref('热爱生活，喜欢旅行和摄影。希望能在这里认识更多志同道合的朋友。目前在上海工作，从事互联网行业，对新技术充满热情。闲暇时喜欢研究美食，偶尔写写博客分享生活感悟。');
const location = ref('上海市');
const birthday = ref('1995-03-15');

const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '保密', value: 'secret' }
];

const goBack = () => {
  uni.navigateBack();
};

const handleSave = () => {
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  });
};

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      avatarUrl.value = res.tempFilePaths[0];
    }
  });
};

const handleGenderChange = (value: string) => {
  gender.value = value;
};

const handleSelectLocation = () => {
  // 处理选择地址逻辑
};

const handleSelectBirthday = () => {
  // 处理选择生日逻辑
};
</script>

<style>
.page {
  height: 100%;
  background-color: #f9fafb;
}

.page {
  min-height: 100%;
  background-color: #ffffff;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  font-size: 40rpx;
  color: #4F46E5;
  background: none;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  height: 60rpx;
  border: none;

  margin: 0;
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
  border: 4rpx solid #4F46E5;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 64rpx;
  height: 64rpx;
  border-radius: 100%;
  background-color: #4F46E5;
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
  font-size: 24px;
  color: #374151;
}

.input-container {
  position: relative;
}

.input {
  width: 100%;
  height: 96rpx;
  padding: 0 32rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 22px;
}

.gender-group {
  display: flex;
  gap: 48rpx;
}

.gender-label {
  display: flex;
  align-items: center;
}

.gender-text {
  margin-left: 16rpx;
  font-size: 28px;
  color: #374151;
}

.textarea-container {
  position: relative;
}

.textarea {
  width: 100%;
  height: 256rpx;
  padding: 32rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 20px;
}

.word-count {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  font-size: 24px;
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
