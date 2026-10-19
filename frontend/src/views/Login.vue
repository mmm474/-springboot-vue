<template>
  <div class="container">
    <div class="title">欢迎登录!</div>
    <form @submit.prevent="goLogin">
      <div class="sub-title">账号密码登录</div>
      <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
      <input v-model.trim="form.password" type="password" placeholder="请输入你的密码" />
      <button type="submit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      <div class="txt">
        <span>没有账号？</span>
        <span class="link" @click="$router.push('/register')">立马注册</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import useUserStore from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({ username: '', password: '' })

const goLogin = async () => {
  if (!form.username || !form.password) {
    showToast('请输入账号和密码')
    return
  }
  loading.value = true
  try {
    // H5 端 user_code 固定传 '1'，与原实现保持一致
    await userStore.login({ ...form, user_code: '1' })
    showToast({ type: 'success', message: '登录成功' })
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    showToast(e?.message || '登录失败')
    form.password = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, rgb(244, 157, 4), #facf94, white);
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.title {
  margin-top: 120px;
  height: 60px;
  font-size: 30px;
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
}

.sub-title {
  height: 44px;
  line-height: 44px;
  font-size: 16px;
}

input {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background-color: #fff;
  margin-bottom: 20px;
  font-size: 15px;
  padding: 0 20px;
  border: none;
  outline: none;
}

button {
  width: 200px;
  height: 50px;
  border-radius: 25px;
  background-color: rgb(242, 157, 45);
  color: #fff;
  font-size: 19px;
  font-weight: bold;
  align-self: center;
}

button:disabled {
  opacity: 0.6;
}

.txt {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #999;
}

.link {
  color: rgb(13, 77, 214);
}
</style>
