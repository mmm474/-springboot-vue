<template>
  <div class="page">
    <div class="nav-bar">
      <button class="nav-back" @click="$router.back()">‹</button>
      我的收藏
    </div>

    <div class="content">
      <div class="list">
        <div
          v-for="item in list"
          :key="item.id"
          class="card"
          @click="goDetail(item.goods.id)"
        >
          <img class="cover" :src="firstImage(item.goods.images)" alt="封面" />
          <div class="info">
            <div class="info-top">
              <span class="title">{{ item.goods.title }}</span>
              <span class="price">¥{{ item.goods.price }}</span>
            </div>
            <div class="info-bottom">
              <span class="time">{{ differTime(item.goods.created_at) }}</span>
              <span class="like-area">🤍 {{ item.goods.likes }}</span>
            </div>
          </div>
        </div>
        <div v-if="!list.length" class="empty-tip">还没有收藏商品</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyLikes } from '@/api/goods'
import { differTime, firstImage } from '@/utils/format'
import type { LikeRecord } from '@/types'

const router = useRouter()
const list = ref<LikeRecord[]>([])

const load = async () => {
  const res = await getMyLikes()
  if (res.code === 200) list.value = res.data
}

const goDetail = (id: number) => router.push(`/detail/${id}`)

onMounted(load)
</script>

<style scoped>
.list {
  padding: 10px;
}

.card {
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.cover {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  background: #eee;
}

.info {
  padding: 12px;
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.title {
  flex: 1;
  font-size: 14px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}
</style>
