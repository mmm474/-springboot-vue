<template>
  <div class="page">
    <div class="nav-bar">
      <button class="nav-back" @click="$router.back()">‹</button>
      发布商品
    </div>

    <div class="content">
      <form class="form" @submit.prevent="submit">
        <div class="item">
          <label>标题：</label>
          <input v-model.trim="form.title" type="text" placeholder="请输入商品标题" />
        </div>

        <div class="item">
          <label>价格（单位：元）：</label>
          <input v-model.number="form.price" type="number" min="0" placeholder="请输入价格" />
        </div>

        <div class="item">
          <label>分类：</label>
          <van-radio-group v-model="form.categorie" direction="horizontal">
            <van-radio v-for="c in categories" :key="c" :name="c">{{ c }}</van-radio>
          </van-radio-group>
        </div>

        <div class="item">
          <label>内容：</label>
          <van-field
            v-model="form.descr"
            type="textarea"
            rows="4"
            autosize
            placeholder="描述一下你的商品吧"
            class="textarea"
          />
        </div>

        <div class="item">
          <label>上传图片（最多 9 张）：</label>
          <van-uploader
            v-model="fileList"
            multiple
            :max-count="9"
            :after-read="afterRead"
            @delete="onDelete"
          />
        </div>

        <div class="btn-wrap">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            确定发布
          </van-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, type UploaderFileListItem } from 'vant'
import { uploadImage, publishGoods } from '@/api/goods'

const router = useRouter()
const loading = ref(false)
const categories = ['数码', '图书', '家居', '服饰', '运动', '其他']

const form = reactive({
  title: '',
  price: '' as number | string,
  categorie: '数码',
  descr: '',
})

interface UploadItem extends UploaderFileListItem {
  url?: string
}

const fileList = ref<UploadItem[]>([])
const uploadedUrls = ref<string[]>([])

const afterRead = async (item: UploadItem | UploadItem[]) => {
  const items = Array.isArray(item) ? item : [item]
  for (const file of items) {
    file.status = 'uploading'
    file.message = '上传中...'
    try {
      const raw = file.file
      if (!raw) continue
      const res = await uploadImage(raw)
      if (res.code === 200) {
        file.status = 'done'
        file.url = res.data.url
        file.message = ''
      } else {
        file.status = 'failed'
        file.message = '上传失败'
      }
    } catch {
      file.status = 'failed'
      file.message = '上传失败'
    }
  }
}

const onDelete = (_file: UploadItem, detail: { index: number }) => {
  fileList.value.splice(detail.index, 1)
}

const submit = async () => {
  if (!form.title) {
    showToast('标题不能为空')
    return
  }
  const price = Number(form.price)
  if (!price || price <= 0) {
    showToast('请输入正确的价格')
    return
  }
  loading.value = true
  try {
    const urls = fileList.value.map((f) => f.url).filter(Boolean) as string[]
    const res = await publishGoods({
      title: form.title,
      price,
      descr: form.descr,
      categorie: form.categorie,
      images: urls.join(','),
    })
    if (res.code === 200) {
      showToast({ type: 'success', message: '发布成功' })
      router.replace('/square')
    } else {
      showToast(res.msg || '发布失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form {
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.item label {
  font-size: 15px;
  font-weight: bold;
}

.item input {
  height: 42px;
  padding: 0 14px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  outline: none;
  background: transparent;
}

.textarea {
  background: #f5f5f5;
  border-radius: 10px;
}

.btn-wrap {
  margin-top: 24px;
  padding: 0 6px;
}
</style>
