<template>
  <div class="container">
    <div class="title">注册!</div>
    <form @submit.prevent="finishReg">
      <div class="sub-title">用户名注册</div>
      <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
      <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
      <div class="code-box">
        <input v-model.trim="capCode" type="text" placeholder="请输入验证码" />
        <div class="img-box" @click="refreshCode">
          <img class="code" :src="codeUrl" alt="验证码" />
        </div>
      </div>
      <button type="submit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
      <div class="txt">
        <span>已有账号，</span>
        <span class="link" @click="$router.replace('/login')">返回登录</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { reqCheckCode, reqRegister } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const capCode = ref('')
const codeUrl = ref('')

const refreshCode = () => {
  // 直连后端 SVG 验证码接口（session 保持），加随机参数防缓存
  codeUrl.value = '/api/user/create?t=' + Date.now()
}

onMounted(refreshCode)

const finishReg = async () => {
  if (!form.username || !form.password) {
    showToast('请输入用户名和密码')
    return
  }
  if (!capCode.value) {
    showToast('请输入验证码')
    return
  }
  loading.value = true
  try {
    const check = await reqCheckCode(capCode.value)
    if (check.code !== 200) {
      showToast('验证码错误')
      refreshCode()
      return
    }
    const res = await reqRegister({ ...form })
    if (res.code === 200) {
      showToast({ type: 'success', message: '注册成功' })
      setTimeout(() => router.replace('/login'), 800)
    } else {
      showToast(res.msg)
      form.password = ''
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, rgb(244, 157, 4), #facf94, white);
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.title {
  margin-top: 100px;
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
  margin-top: 10px;
  width: 200px;
  height: 50px;
  border-radius: 25px;
  background-color: rgb(242, 157, 45);
  color: #fff;
  font-size: 19px;
  font-weight: bold;
  align-self: center;
}

.code-box {
  display: flex;
  height: 50px;
  gap: 16px;
}

.code-box input {
  flex: 1;
}

.img-box {
  width: 130px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.code {
  width: 100%;
  height: 100%;
  cursor: pointer;
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
