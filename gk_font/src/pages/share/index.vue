<template>
  <view class="container">
    <form action="">
      <view class="item">
        <text>标题：</text>
        <input v-model="data.title" required type="text" placeholder="请输入文案标题" />
      </view>
      <view class="item">
        <text>价格（单位元）：</text>
        <input v-model="data.price" required type="text" placeholder="请输价格" />
      </view>
      <view class="item">
        <text>内容：</text>
        <textarea v-model="data.descr" required name="" id="" cols="30" rows="10"></textarea>
      </view>
      <view class="item">
        <text>分类：</text>
        <up-radio-group v-model="data.categorie" placement="row">
          <up-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in categorieOptions" :key="index"
            :label="item.label" :name="item.value">
          </up-radio>
        </up-radio-group>
      </view>
      <view class="item">
        <text>上传图片：</text>
        <view style="margin-top: 10rpx">
          <up-upload :fileList="fileList1" :maxCount="3" @afterRead="afterRead" @delete="deletePic" name="1"
            multiple></up-upload>
        </view>
      </view>
    </form>
    <view class="btn">
      <up-button type="primary" @click="addArticl" text="确定" :loading="loading" loading-text="正在上传"></up-button>
    </view>
    <u-toast ref="uToastRef"></u-toast>
  </view>
</template>
<script setup lang='ts'>
import { reqUploadImages, reqPublishArticle } from "../../api/square"
import { ref, reactive } from "vue"
// import useUserStore from '../../store/module/user';
// const userStore = useUserStore()

let uToastRef = ref()
const loading = ref(false)
const data = reactive<{
  title: string
  descr: string
  images: string[]
  price: string
  categorie: string
}>({
  title: "",
  descr: "",
  images: [],
  price: "0",
  categorie: "0",
})

const categorieOptions = reactive([
  { label: "生活", value: "0" },
  { label: "学习", value: "1" },
  { label: "娱乐", value: "2" },
  { label: "其他", value: "3" },
])

const fileList1 = reactive<any[]>([])
const files = reactive<any[]>([])
// 删除图片
const deletePic = (event: any) => {
  fileList1.splice(event.index, 1)
  files.splice(event.index, 1)
}

// 新增图片
const afterRead = async (event: any) => {
  let lists = [].concat(event.file)
  lists.map((item) => {
    fileList1.push({
      // @ts-ignore
      ...item,
      status: "success",
    })
  })
  files.push(event)
}

const addArticl = async () => {
  loading.value = true
  const eventList: Promise<string>[] = []
  files.forEach((i) => {
    const event = new Promise(async (resolve, reject) => {
      let res = await reqUploadImages(i.file[0].url)
      resolve(res.data.url)
    })
    eventList.push(event as Promise<string>)
  })
  Promise.all(eventList).then(async (res) => {
    console.log(res)
    const query = {
      price: parseInt(data.price),
      title: data.title,
      descr: data.descr,
      categorie: data.categorie,
      images: res.join(","),
    }
    if (!query.title) {
      uToastRef.value.show({
        message: "标题不能为空",
        type: "warning",
        position: "top",
        duration: 500,
      })
      return
    }

    if (query.price === 0) {
      uToastRef.value.show({
        message: "价格不能为0",
        type: "warning",
        position: "top",
        duration: 500,
      })
      return
    }

    let result = await reqPublishArticle(query)
    if (result.code == 200) {
      uToastRef.value.show({
        message: "发布成功",
        type: "success",
        position: "top",
        duration: 1000,
        iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
      })
      uni.switchTab({
        url: "/pages/square/index",
      })
    } else {
      uToastRef.value.show({
        message: "发布失败",
        type: "error",
        position: "top",
        duration: 1000,
      })
    }
    loading.value = false
  })
}
</script>
<style lang='scss' scoped>
.container {
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  align-items: center;

  form {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    .item {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 20rpx;
      box-sizing: border-box;

      text {
        font-size: 30rpx;
        font-weight: bolder;
      }

      input {
        padding-left: 20rpx;
        flex-grow: 1;
        box-sizing: border-box;
        height: 70rpx;
        border-bottom: 1px solid #ccc;
        color: #000;
      }

      textarea {
        margin-top: 10rpx;
        display: block;
        width: 100%;
        padding: 20rpx;
        background-color: #eee;
        border-radius: 15rpx;
        box-sizing: border-box;
      }
    }
  }

  .btn {
    position: absolute;
    width: 500rpx;
    left: 50%;
    bottom: 100rpx;
    transform: translateX(-50%);
  }
}
</style>