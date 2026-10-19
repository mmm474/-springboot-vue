<template>
  <nav class="tab-bar">
    <router-link
      v-for="item in tabs"
      :key="item.path"
      :to="item.path"
      class="tab-item"
      :class="{ active: active === item.path }"
    >
      <span class="tab-icon" v-html="active === item.path ? item.iconActive : item.icon"></span>
      <span class="tab-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 简单的内联 SVG 图标
const ICON_HOME =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>'
const ICON_SQUARE =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
const ICON_USER =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>'

const tabs = [
  { path: '/', label: '首页', iconActive: ICON_HOME, icon: ICON_HOME },
  { path: '/square', label: '广场', iconActive: ICON_SQUARE, icon: ICON_SQUARE },
  { path: '/profile', label: '我的', iconActive: ICON_USER, icon: ICON_USER },
]

const route = useRoute()
const active = computed(() => {
  if (route.path === '/') return '/'
  if (route.path.startsWith('/square')) return '/square'
  if (route.path.startsWith('/profile')) return '/profile'
  return ''
})
</script>

<style scoped>
.tab-bar {
  height: 56px;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  flex-shrink: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #999;
}

.tab-item.active {
  color: #1976d2;
}

.tab-icon {
  display: flex;
  line-height: 1;
}

.tab-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.tab-label {
  font-size: 12px;
}
</style>
