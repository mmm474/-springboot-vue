<template>
  <div class="container">
    <div class="title">我的收藏</div>
    <div class="list">
      <div class="item" v-for="(item, index) in data.List" :key="index" @click="goDetail(item.goods.id)">
        <image class="cover" :src="item.cover" mode="scaleToFill" />
        <div class="footer">
          <text>{{ item.goods.title }}</text>
          <text style='color: #8c8c8c;'>{{ differTime(item.goods.created_at) }}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { reqGetUserLikes } from '../../api/square';
import { ref, reactive, onMounted } from 'vue';

let data = reactive<{
  List: any[]
}>({
  List: []
})
onMounted(() => {
  getData()
})

const getData = async () => {
  const res = await reqGetUserLikes()
  if (res.code == 200) {
    data.List = res.data.map((i) => ({
      ...i,
      cover: i.goods.images ? i.goods.images.split(',')[0] : ""
    }))
    console.log(data.List)
  }
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

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`
  })
}

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