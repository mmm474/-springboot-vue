<template>
  <div class="container">
    <div v-if="!data.friendId" class="title">我的作品</div>
    <div v-else class="title">用户{{ data.friendname }}作品</div>
    <div class="list">
      <div class="item" v-for="(item, index) in data.list" :key="index" @click="goDetail(item.id)">
        <image class="cover" :src="item.cover" mode="scaleToFill" />
        <div class="footer">
          <text>{{ item.title }}</text>
          <text style='color: #8c8c8c;'>{{ differTime(item.created_at) }}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { onLoad } from '@dcloudio/uni-app';
import { reqGetUserGoods } from '../../api/square';
import { reactive, onMounted } from 'vue';
import useUserStore from '../../store/module/user';
const userStore = useUserStore()

let data = reactive<{
  list: any[]
  friendId: string
  friendname: string
}>({
  list: [],
  friendId: '',
  friendname: ''
})
onMounted(() => {
  getData()
})

onLoad((options) => {
  console.log(options)
  data.friendId = options?.friendId || ''
  data.friendname = options?.friendname || ''
})

const getData = async () => {
  const query = {
    id: data.friendId ? parseInt(data.friendId) : userStore.UInfo.id
  }
  const res = await reqGetUserGoods(query)
  if (res.code == 200) {
    data.list = res.data.map((i) => ({
      ...i,
      cover: i.images ? i.images.split(',')[0] : ''
    }))
    console.log(data)
  }
}

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`
  })
}

const differTime = (time: string) => {
  const currentTime = new Date();
  const targetTime = new Date(time);

  console.log(currentTime, targetTime);

  // @ts-ignore
  const differenceInMilliseconds = currentTime - targetTime;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 1) {
    return `${differenceInMinutes}分钟前`;
  } else {
    return `${differenceInHours}小时前`;
  }
};



</script>
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .title {
    width: 100%;
    height: 60rpx;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .list {
    width: 100%;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    padding: 12px 20px;
    flex-direction: column;
    box-sizing: border-box;

    .item {
      width: 100%;
      height: 400rpx;
      display: flex;
      flex-direction: column;
      align-content: center;
      border-radius: 4px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

      border: 1px solid #8c8c8c;

      .cover {
        width: 100%;
        height: 320px;
        object-fit: cover;
      }

      .footer {
        padding: 0 8px;
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

}
</style>