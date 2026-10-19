<template>
  <div class="page">
    <div class="nav-bar">
      <button class="nav-back" @click="$router.back()">‹</button>
      商品详情
    </div>

    <div class="content">
      <!-- 标题 -->
      <div class="title-section">{{ info.title }}</div>

      <!-- 发布者 -->
      <div class="publisher-section">
        <div class="publisher-info">
          <img class="avatar" :src="info.user?.avatar || defaultAvatar" alt="头像" />
          <span class="publisher-name">{{ info.user?.nickname }}</span>
        </div>
        <button
          v-if="info.user?.id !== userStore.UInfo?.id && !isFriend"
          class="follow-btn"
          @click="addFriend"
        >关注</button>
        <button
          v-else-if="info.user?.id !== userStore.UInfo?.id && isFriend"
          class="unfollow-btn"
          @click="delFriend"
        >取消关注</button>
      </div>

      <!-- 图文详情 -->
      <div class="detail-section">
        <p class="detail-text">{{ info.descr }}</p>
        <div class="image-list">
          <img
            v-for="(img, idx) in images"
            :key="idx"
            :src="img"
            class="product-image"
            @click="preview(idx)"
          />
        </div>
      </div>

      <!-- 价格 -->
      <div class="price-section">
        <span class="price">¥ {{ info.price }}</span>
        <button v-if="info.user?.id !== userStore.UInfo?.id" class="order-btn" @click="handleOrder">
          立即下单
        </button>
        <button v-else class="delete-btn" @click="handleDelete">取消发布</button>
      </div>

      <!-- 留言区 -->
      <div class="comment-section">
        <div class="comment-title">留言区</div>
        <div class="comment-list">
          <div v-for="comment in info.remarks" :key="comment.id" class="comment-item">
            <img :src="comment.avatar || defaultAvatar" class="comment-avatar" alt="头像" />
            <div class="comment-content">
              <span class="comment-username">{{ comment.nickname }}</span>
              <span class="comment-text">{{ comment.content }}</span>
              <span class="comment-time">{{ differTime(comment.created_at) }}</span>
            </div>
          </div>
          <div v-if="!info.remarks?.length" class="empty-tip">还没有留言，快来抢沙发~</div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="input-box">
      <div class="comment-entry" @click="showPopup = true">说点什么...</div>
      <span class="heart" :class="{ liked: isLike }" @click="toggleLike">
        {{ isLike ? '❤️' : '🤍' }}
      </span>
    </div>

    <!-- 评论弹窗 -->
    <van-popup v-model:show="showPopup" position="bottom" round>
      <div class="popup-box">
        <textarea
          v-model="content"
          class="popup-textarea"
          rows="4"
          placeholder="说点什么..."
        ></textarea>
        <van-button type="primary" block round @click="sendComment">发送</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showImagePreview, type ImagePreviewOptions } from 'vant'
import {
  getGoodsDetail,
  publishComment,
  likeGoods,
  dislikeGoods,
  getMyLikes,
  addHistory,
  deleteGoods,
} from '@/api/goods'
import { reqAddFriend, reqFriendDel, reqFriendList } from '@/api/user'
import { differTime } from '@/utils/format'
import useUserStore from '@/stores/user'
import type { Goods } from '@/types'
import defaultAvatar from '@/assets/default-avatar.svg'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const goodsId = Number(route.params.id)
const showPopup = ref(false)
const content = ref('')
const isLike = ref(false)
const isFriend = ref(false)

const info = reactive<Goods>({
  id: 0,
  title: '',
  price: 0,
  descr: '',
  images: [] as string[],
  likes: 0,
  created_at: '',
  user: {},
  remarks: [],
})
const images = ref<string[]>([])

const getInfo = async () => {
  const res = await getGoodsDetail(goodsId)
  if (res.code === 200) {
    Object.assign(info, res.data)
    images.value = res.data.images ? String(res.data.images).split(',') : []
  }
}

const getUserLikes = async () => {
  const res = await getMyLikes()
  isLike.value = res.data.some((item) => item.goods.id === goodsId)
}

const getFriends = async () => {
  const res = await reqFriendList()
  isFriend.value = res.data.some((item) => item.friendId === info.user?.id)
}

const preview = (idx: number) => {
  const options: ImagePreviewOptions = { images: images.value, startPosition: idx }
  showImagePreview(options)
}

const toggleLike = async () => {
  if (isLike.value) {
    await dislikeGoods(goodsId)
    isLike.value = false
    showToast('已取消收藏')
  } else {
    await likeGoods(goodsId)
    isLike.value = true
    showToast({ type: 'success', message: '收藏成功' })
  }
  getInfo()
}

const addFriend = async () => {
  if (!info.user?.id) return
  const res = await reqAddFriend(info.user.id)
  if (res.code === 200) {
    isFriend.value = true
    showToast({ type: 'success', message: '关注成功' })
  }
}

const delFriend = async () => {
  if (!info.user?.id) return
  const res = await reqFriendDel(info.user.id)
  if (res.code === 200) {
    isFriend.value = false
    showToast({ type: 'success', message: '取消关注成功' })
  }
}

const sendComment = async () => {
  if (!content.value.trim()) return
  const res = await publishComment({ id: goodsId, content: content.value })
  if (res.code === 200) {
    showToast({ type: 'success', message: '评论成功' })
    content.value = ''
    showPopup.value = false
    getInfo()
  }
}

const handleOrder = () => {
  showToast('功能开发中')
}

const handleDelete = async () => {
  try {
    await showConfirmDialog({ title: '提示', message: '确定删除发布吗？' })
    const res = await deleteGoods(goodsId)
    if (res.code === 200) {
      showToast({ type: 'success', message: '删除成功' })
      router.replace('/square')
    }
  } catch {
    // 用户取消
  }
}

onMounted(async () => {
  await getInfo()
  addHistory(goodsId)
  getUserLikes()
  getFriends()
})
</script>

<style scoped>
.title-section {
  padding: 15px;
  background: #fff;
  font-size: 18px;
  font-weight: bold;
}

.publisher-section {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.publisher-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  background: #eee;
}

.publisher-name {
  font-size: 14px;
}

.follow-btn,
.unfollow-btn {
  padding: 6px 16px;
  border-radius: 16px;
  color: #fff;
  font-size: 13px;
}

.follow-btn {
  background-color: #1976d2;
}

.unfollow-btn {
  background-color: #ff4d4f;
}

.detail-section {
  padding: 15px;
  background: #fff;
}

.detail-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
}

.product-image {
  width: 100%;
  margin-top: 12px;
  border-radius: 6px;
}

.price-section {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-top: 8px;
}

.price {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: bold;
}

.order-btn,
.delete-btn {
  padding: 8px 24px;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
}

.order-btn {
  background-color: #1976d2;
}

.delete-btn {
  background-color: #ff4d4f;
}

.comment-section {
  margin-top: 8px;
  padding: 15px;
  background: #fff;
}

.comment-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.comment-item {
  display: flex;
  margin-bottom: 14px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  background: #eee;
}

.comment-content {
  flex: 1;
}

.comment-username {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.comment-text {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.input-box {
  flex-shrink: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 12px;
}

.comment-entry {
  flex: 1;
  height: 36px;
  background: #f5f5f5;
  border-radius: 18px;
  line-height: 36px;
  padding: 0 16px;
  font-size: 14px;
  color: #999;
}

.heart {
  font-size: 26px;
}

.popup-box {
  padding: 20px 16px calc(20px + env(safe-area-inset-bottom));
}

.popup-textarea {
  width: 100%;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  margin-bottom: 14px;
  outline: none;
  resize: none;
  font-family: inherit;
}
</style>
