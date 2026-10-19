<template>
  <div class="page">
    <div class="nav-bar">
      <button class="nav-back" @click="$router.back()">‹</button>
      我的关注
    </div>

    <div class="search-container">
      <div class="search-box">
        <span>🔍</span>
        <input v-model="searchText" type="text" placeholder="输入昵称搜索好友" />
      </div>
    </div>

    <div class="content">
      <div v-for="item in filteredList" :key="item.id" class="friend-item">
        <img :src="item.avatar || defaultAvatar" class="avatar" alt="头像" />
        <span class="nickname">{{ item.nickname }}</span>
        <div class="actions">
          <button class="view-btn" @click="viewFriend(item)">查看</button>
          <button class="delete-btn" @click="confirmDelete(item)">删除</button>
        </div>
      </div>
      <div v-if="!filteredList.length" class="empty-tip">暂无关注的用户</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { reqFriendList, reqFriendDel } from '@/api/user'
import type { Friend } from '@/types'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()
const searchText = ref('')
const originList = ref<Friend[]>([])

const filteredList = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) return originList.value
  return originList.value.filter((f) => f.nickname?.toLowerCase().includes(keyword))
})

const getList = async () => {
  const res = await reqFriendList()
  if (res.code === 200) originList.value = res.data
}

const viewFriend = (friend: Friend) => {
  router.push({
    path: '/works',
    query: { friendId: String(friend.friendId), friendname: friend.nickname },
  })
}

const confirmDelete = async (friend: Friend) => {
  try {
    await showConfirmDialog({ title: '提示', message: `确定取消关注"${friend.nickname}"吗？` })
    const res = await reqFriendDel(friend.friendId)
    if (res.code === 200) {
      showToast({ type: 'success', message: '取消关注成功' })
      getList()
    }
  } catch {
    // 取消
  }
}

onMounted(getList)
</script>

<style scoped>
.search-container {
  background: #fff;
  padding: 10px 15px;
  border-bottom: 1px solid #eaeaea;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 18px;
  padding: 0 14px;
  height: 36px;
  gap: 8px;
}

.search-box input {
  flex: 1;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
}

.nickname {
  flex: 1;
  margin-left: 12px;
  font-size: 15px;
}

.actions {
  display: flex;
  gap: 8px;
}

.view-btn,
.delete-btn {
  padding: 6px 14px;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
}

.view-btn {
  background: #1976d2;
}

.delete-btn {
  background: #ff3b30;
}
</style>
