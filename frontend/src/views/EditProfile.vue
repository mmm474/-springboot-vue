<template>
  <div class="page">
    <div class="nav-bar">
      <button class="nav-back" @click="$router.back()">‹</button>
      个人信息
      <button class="save-btn" :disabled="loading" @click="handleSave">
        {{ loading ? '保存中' : '保存' }}
      </button>
    </div>

    <div class="main">
      <div class="avatar-section">
        <div class="avatar-container">
          <img class="avatar-image" :src="avatar || defaultAvatar" alt="头像" />
          <label class="camera-btn">
            📷
            <input type="file" accept="image/*" hidden @change="onAvatarChange" />
          </label>
        </div>
        <span class="avatar-tip">点击更换头像</span>
      </div>

      <div class="form-section">
        <div class="form-item">
          <label class="form-label">昵称</label>
          <input v-model.trim="form.nickname" class="input" type="text" placeholder="请输入昵称" />
        </div>

        <div class="form-item">
          <label class="form-label">手机号</label>
          <input v-model.trim="form.phone" class="input" type="text" placeholder="请输入手机号" />
        </div>

        <div class="form-item">
          <label class="form-label">性别</label>
          <van-radio-group v-model="form.sex" direction="horizontal">
            <van-radio :name="1">男</van-radio>
            <van-radio :name="2">女</van-radio>
            <van-radio :name="0">保密</van-radio>
          </van-radio-group>
        </div>

        <div class="form-item">
          <label class="form-label">个人简介</label>
          <van-field
            v-model="form.describes"
            type="textarea"
            placeholder="介绍一下自己吧"
            rows="3"
            autosize
            class="textarea"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import useUserStore from '@/stores/user'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const avatar = ref(userStore.UInfo?.avatar || '')
const avatarFile = ref<File>()

const form = reactive({
  nickname: userStore.UInfo?.nickname || '',
  phone: userStore.UInfo?.phone || '',
  sex: userStore.UInfo?.sex ?? 0,
  describes: userStore.UInfo?.describes || '',
})

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatar.value = URL.createObjectURL(file)
}

const handleSave = async () => {
  if (!form.nickname) {
    showToast('请输入昵称')
    return
  }
  loading.value = true
  try {
    const res = await userStore.updateInfo({ ...form }, avatarFile.value)
    if (res.code === 200) {
      showToast({ type: 'success', message: '保存成功' })
      router.back()
    } else {
      showToast(res.msg || '保存失败')
    }
  } catch {
    showToast('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.save-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #1976d2;
  color: #fff;
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 14px;
}

.save-btn:disabled {
  opacity: 0.6;
}

.main {
  padding: 24px 16px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.avatar-container {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 10px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #1976d2;
  object-fit: cover;
  background: #eee;
}

.camera-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #1976d2;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
}

.avatar-tip {
  font-size: 12px;
  color: #6b7280;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
}

.input {
  height: 42px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background: #fff;
}

.textarea {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
</style>
