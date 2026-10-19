<template>
  <div class="page">
    <div class="title-box">个人中心</div>

    <div class="content">
      <div class="info-box">
        <div class="avatar-box">
          <img :src="userStore.UInfo?.avatar || defaultAvatar" alt="头像" />
          <div class="brief">
            <span class="nickname">{{ userStore.UInfo?.nickname || '未登录' }}</span>
            <span class="desc">{{ userStore.UInfo?.describes || '此人还没有简介~~~' }}</span>
          </div>
        </div>
        <span class="edit" @click="goEdit">编辑资料 ›</span>
      </div>

      <div class="case-box">
        <div class="case-item" @click="$router.push('/likes')">
          <span class="case-icon">⭐</span>
          <span>我的收藏</span>
        </div>
        <div class="case-item" @click="$router.push('/works')">
          <span class="case-icon">📦</span>
          <span>我的商品</span>
        </div>
        <div class="case-item" @click="$router.push('/friends')">
          <span class="case-icon">👥</span>
          <span>我的关注</span>
        </div>
      </div>

      <div v-if="history.length" class="section-title">足迹</div>
      <div class="history-wrap">
        <div
          v-for="item in history"
          :key="item.id"
          class="history-card"
          @click="$router.push(`/detail/${item.goodid}`)"
        >
          <img class="card-image" :src="item.cover || ''" alt="封面" />
          <div class="card-content">
            <span class="card-title">{{ item.title }}</span>
            <div class="card-footer">
              <span class="card-author">{{ item.publicer }}</span>
              <span class="card-time">{{ differTime(item.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="set-box">
        <div class="set-item logout" @click="handleLogout">
          <span>⏻</span><span>退出登录</span>
        </div>
      </div>
    </div>

    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import useUserStore from '@/stores/user'
import { getMyHistory } from '@/api/goods'
import { differTime } from '@/utils/format'
import type { Step } from '@/types'
import TabBar from '@/components/TabBar.vue'
import defaultAvatar from '@/assets/default-avatar.svg'

defineOptions({ name: 'Profile' })

const router = useRouter()
const userStore = useUserStore()
const history = ref<Step[]>([])

const loadData = async () => {
  if (userStore.token) {
    await userStore.fetchUserInfo()
    const res = await getMyHistory()
    history.value = res.data
  }
}

const goEdit = () => router.push('/edit')

const handleLogout = async () => {
  try {
    await showConfirmDialog({ title: '提示', message: '确定退出登录吗？' })
    userStore.logout()
    router.replace('/login')
  } catch {
    // 取消
  }
}

onActivated(loadData)
loadData()
</script>

<style scoped>
.title-box {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  background: #fff;
  flex-shrink: 0;
}

.content {
  padding: 10px;
}

.info-box {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-box {
  display: flex;
  align-items: center;
}

.avatar-box img {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid #eee;
  object-fit: cover;
  background: #eee;
}

.brief {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nickname {
  font-size: 17px;
  font-weight: bold;
}

.desc {
  font-size: 13px;
  color: #999;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit {
  font-size: 13px;
  color: #999;
}

.case-box {
  margin-top: 10px;
  background: #fff;
  border-radius: 12px;
  height: 90px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 4px 12px rgba(149, 157, 165, 0.12);
}

.case-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.case-icon {
  font-size: 28px;
}

.section-title {
  margin-top: 14px;
  font-size: 16px;
  font-weight: bold;
  padding: 0 4px 8px;
}

.history-wrap {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.history-card {
  flex-shrink: 0;
  width: 160px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-image {
  width: 160px;
  height: 100px;
  object-fit: cover;
  background: #eee;
}

.card-content {
  padding: 8px 10px;
}

.card-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
}

.set-box {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(149, 157, 165, 0.12);
}

.set-item {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  font-size: 15px;
}

.logout {
  color: #1976d2;
  justify-content: center;
}
</style>
