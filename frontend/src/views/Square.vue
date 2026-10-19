<template>
  <div class="page">
    <div class="title-box">社区广场</div>

    <div class="content">
      <div class="list-container">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="top-box">
            <img :src="item.user?.avatar || defaultAvatar" class="avatar" alt="头像" />
            <div class="des">
              <span>{{ item.user?.nickname }}</span>
              <span>{{ differTime(item.created_at) }}</span>
            </div>
          </div>

          <div class="mid-box" @click="goDetail(item.id)">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-des">{{ item.descr }}</div>
            <div class="img-box">
              <img
                v-for="(img, idx) in toImages(item.images)"
                :key="idx"
                :src="img"
                @click.stop="preview(toImages(item.images), idx)"
              />
            </div>
          </div>

          <div class="bot-box">
            <span class="action">🔗 分享</span>
            <span class="action" @click="goDetail(item.id)">
              💬 评论{{ item.remarks && item.remarks.length ? ' ' + item.remarks.length : '' }}
            </span>
            <span class="action">⭐ 收藏{{ item.likes ? ' ' + item.likes : '' }}</span>
          </div>
        </div>
        <div v-if="list.length === 0" class="empty-tip">还没有发布内容，快去发布吧~</div>
      </div>
    </div>

    <!-- 发布按钮 -->
    <button class="fab" @click="$router.push('/publish')">＋</button>

    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { reactive, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview } from 'vant'
import { getGoodsList } from '@/api/goods'
import { differTime } from '@/utils/format'
import type { Goods } from '@/types'
import TabBar from '@/components/TabBar.vue'
import defaultAvatar from '@/assets/default-avatar.svg'

defineOptions({ name: 'Square' })

const router = useRouter()
const list = reactive<Goods[]>([])

const getList = async () => {
  const res = await getGoodsList({ page: 1, pageSize: 50 })
  list.splice(0, list.length, ...res.data)
}

const toImages = (images: string | string[]): string[] => {
  if (!images) return []
  return Array.isArray(images) ? images : images.split(',').filter(Boolean)
}

const preview = (urls: string[], idx: number) => {
  showImagePreview({ images: urls, startPosition: idx })
}

const goDetail = (id: number) => router.push(`/detail/${id}`)

onActivated(getList)
getList()
</script>

<style scoped>
.title-box {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  background-color: #fff;
  flex-shrink: 0;
}

.list-container {
  padding: 8px 10px 80px;
}

.item {
  background-color: #fff;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}

.top-box {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
}

.des {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.des span:first-child {
  font-size: 15px;
  font-weight: bold;
}

.des span:last-child {
  font-size: 12px;
  color: #999;
}

.mid-box {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.item-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
}

.item-des {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.img-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.img-box img {
  width: calc(33.33% - 4px);
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  background: #f5f5f5;
}

.bot-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 10px;
}

.action {
  font-size: 13px;
  color: #999;
}

.fab {
  position: absolute;
  right: 18px;
  bottom: 76px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a3c, #f29d2d);
  color: #fff;
  font-size: 30px;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(242, 157, 45, 0.4);
  z-index: 10;
}
</style>
