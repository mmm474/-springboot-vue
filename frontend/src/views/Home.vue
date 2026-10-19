<template>
  <div class="page">
    <div class="header">
      <div class="title-box">首页</div>
      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索商品名称"
            @input="handleSearch"
          />
        </div>
      </div>
      <div class="tab-container">
        <div
          v-for="(item, index) in categories"
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === item.value }"
          @click="switchTab(item.value)"
        >
          <span class="tab-emoji">{{ item.icon }}</span>
          <span class="tab-text">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div class="content goods-list">
      <div
        v-for="item in list"
        :key="item.id"
        class="goods-item"
        @click="goDetail(item.id)"
      >
        <img class="goods-image" :src="firstImage(item.images)" alt="商品图" />
        <div class="goods-info">
          <div class="goods-title">{{ item.title }}</div>
          <div class="goods-author">{{ item.user?.nickname }}</div>
          <div class="goods-date">{{ differTime(item.created_at) }}</div>
          <div class="goods-price">￥{{ item.price }}</div>
        </div>
      </div>
      <div v-if="list.length === 0" class="empty-tip">暂无数据</div>
    </div>

    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGoodsByCategory, searchGoods } from '@/api/goods'
import { differTime, firstImage } from '@/utils/format'
import type { Goods } from '@/types'
import TabBar from '@/components/TabBar.vue'

defineOptions({ name: 'Home' })

const router = useRouter()
const searchText = ref('')
const currentTab = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

const list = reactive<Goods[]>([])

const categories = [
  { label: '全部', value: '', icon: '🏠' },
  { label: '数码', value: '数码', icon: '📱' },
  { label: '图书', value: '图书', icon: '📚' },
  { label: '家居', value: '家居', icon: '🛋️' },
  { label: '服饰', value: '服饰', icon: '👕' },
  { label: '运动', value: '运动', icon: '⚽' },
]

const getList = async () => {
  const res = await getGoodsByCategory({
    page: 1,
    pageSize: 50,
    categorie: currentTab.value,
  })
  list.splice(0, list.length, ...res.data)
}

const switchTab = (val: string) => {
  currentTab.value = val
  searchText.value = ''
  getList()
}

const handleSearch = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    const keyword = searchText.value.trim()
    if (!keyword) {
      getList()
      return
    }
    const res = await searchGoods({ title: keyword })
    list.splice(0, list.length, ...res.data)
  }, 500)
}

const goDetail = (id: number) => router.push(`/detail/${id}`)

onMounted(getList)
</script>

<style scoped>
.header {
  flex-shrink: 0;
  background-color: #fff;
}

.title-box {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
  font-size: 17px;
}

.search-container {
  padding: 8px 15px;
  background-color: #fff;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0 12px;
  height: 36px;
}

.search-icon {
  font-size: 14px;
}

.search-box input {
  flex: 1;
  margin-left: 8px;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
}

.tab-container {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tab-emoji {
  font-size: 20px;
}

.tab-text {
  font-size: 13px;
  color: #666;
}

.tab-item.active .tab-text {
  color: #1976d2;
  font-weight: bold;
}

.goods-list {
  padding: 10px;
}

.goods-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.goods-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #eee;
}

.goods-info {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.goods-title {
  font-size: 15px;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-author {
  font-size: 13px;
  color: #666;
}

.goods-date {
  font-size: 12px;
  color: #999;
}

.goods-price {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: bold;
}
</style>
