# 校园二手交易平台

一个基于 **Vue 3 + uni-app + Node.js + TypeORM** 的全栈二手交易平台，支持 H5 / 小程序 / App 多端，覆盖商品发布、实时聊天、关注互动全流程。

---

## 🛠️ 技术栈

| 层 | 技术选型 |
|---|---|
| **前端** | Vue 3 (Composition API) · uni-app · Pinia · TypeScript · uview-plus · UnoCSS · Vite |
| **后端** | Node.js 18 · Express · TypeORM · MySQL · Socket.io · tsx |
| **鉴权** | JWT（24h access token）· express-session（图形验证码） |
| **文件** | Multer 多图上传 + MIME/扩展名双重白名单校验 |
| **构建** | Vite（前端）· nodemon + tsx（后端 TS 直跑）|

---

## 📂 项目结构

```
second-hand-trading-platform/
├── gk_back/                      # 后端
│   └── src/
│       ├── config/                # 配置（端口/密钥/DB）
│       └── server/
│           ├── entity/            # TypeORM 实体（6 个）
│           ├── router/            # 路由层（user/goods/tools/friend）
│           ├── service/           # 业务逻辑层
│           ├── utils/             # 工具（auth/uploads/data/socket）
│           ├── main.ts            # 入口
│           └── seed.ts            # 测试数据填充脚本
│
└── gk_font/                      # 前端
    └── src/
        ├── api/                   # 接口封装
        ├── pages/                 # 页面（index/detail/publish/friend/chat...）
        ├── store/                 # Pinia 状态
        ├── types/                 # TS 类型定义
        └── utils/                 # 工具（http/token/info）
```

---

## 🎯 核心功能模块

### 后端 4 大路由

- **用户模块** [`gk_back/src/server/router/user.ts`](gk_back/src/server/router/user.ts)：注册、登录（svg-captcha 验证码 + JWT 签发）、修改信息、修改密码、搜索用户
- **商品模块** [`gk_back/src/server/router/goods.ts`](gk_back/src/server/router/goods.ts)：发布（九宫格多图）、列表分页、分类筛选、详情、点赞/取消、评论、浏览历史、搜索、删除
- **工具模块** [`gk_back/src/server/router/tools.ts`](gk_back/src/server/router/tools.ts)：单图上传 `/upload`、多图上传 `/uploadMulti`，统一错误处理
- **好友模块** [`gk_back/src/server/router/friend.ts`](gk_back/src/server/router/friend.ts)：关注、取关、好友列表

### 实时通信

- Socket.io 独立跑 9082 端口，支持私聊消息推送

### 数据建模（6 个实体）

User · Goods · Likes · Remark · Friend · Step，覆盖 OneToMany / ManyToOne 两种 TypeORM 关系

---

## ✨ 三个技术亮点

### 1. Multer 多图上传 + 服务端双重校验

[`gk_back/src/server/utils/uploads.ts`](gk_back/src/server/utils/uploads.ts)

- MIME 类型 + 扩展名双重白名单防绕过
- 文件名正则替换防路径遍历
- 错误统一翻译为中文 JSON（`LIMIT_FILE_SIZE` / `LIMIT_FILE_COUNT` / `INVALID_FILE_TYPE`）
- 目录递归创建避免首部署报错

### 2. JWT 鉴权全链路

[`gk_back/src/server/utils/auth.ts`](gk_back/src/server/utils/auth.ts) + [`gk_font/src/utils/http.ts`](gk_font/src/utils/http.ts)

- 后端 `AuthToken` 中间件 `jwt.verify` → 挂载 `req.uInfo`
- 前端 `addInterceptor` 自动注入 `header.token`
- 401 响应自动清登录态 + 跳转登录页

### 3. TypeORM 实体关系建模

[`gk_back/src/server/entity/`](gk_back/src/server/entity/)

- 双向 OneToMany（User ↔ Goods）+ ManyToOne 拥有方（Likes/Friend）
- 踩坑：数字字段 `likes` 与关系字段 `likes` 重名导致 `Duplicate member`，重命名为 `likeList` 解决

---

## 🔧 开发中排查并解决的典型问题

| 问题 | 根因 | 解决方案 |
|------|------|----------|
| Multer 错误被吞 | 中间件模式抛异常被 Express 默认处理器吃掉 | 改手动调用 cb 接管错误 |
| 前端搜索结果递减 | 在已过滤的 `data.list` 上继续过滤 | 引入 `originList` 备份原始数据 |
| 401 死循环 | 只清 UInfo 没清 token，store 又加载回来 | 同时清 token + Pinia state |
| TypeORM `Duplicate member` | 数字字段与关系字段重名 | 关系字段改名 `likeList` |
| Node 18 + tsx 不兼容 | tsx 3.14 用了 Node 20+ API | 降级到 tsx 3.12.0 |
| 首页商品查不到 | 前端 tab 值 0/1/2/3 与数据库中文分类不匹配 | 改为字符串分类 + 后端空字符串查全部 |
| 登录 Crash | `user_code=undefined` 触发 `UpdateValuesMissingError` | 加判空保护 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- MySQL >= 5.7
- npm 或 pnpm

### 1. 启动后端

```bash
cd gk_back
npm install
# 修改 src/server/utils/data.ts 里的 MySQL 账号密码
npm run dev
```

后端默认运行在 http://127.0.0.1:8080，Socket 服务在 9082 端口。

### 2. 启动前端

```bash
cd gk_font
npm install
npm run dev:h5
```

前端默认运行在 http://localhost:5173。

### 3. 填充测试数据

```bash
cd gk_back
npx tsx src/server/seed.ts
```

执行后会清空并填充测试数据：5 用户 / 12 商品 / 36 点赞 / 18 评论 / 9 关注 / 8 浏览历史。

### 4. 测试账号

密码统一为 `123456`：

| 账号 | 角色 | 昵称 |
|---|---|---|
| `admin` | 管理员 | 管理员老王 |
| `xiaoming` | 用户 | 小明同学 |
| `xiaohong` | 用户 | 小红 |
| `zhangsan` | 用户 | 张三 |
| `lisi` | 用户 | 李四 |

---

## 📊 数据库 ER 图

```
┌──────────────┐         ┌──────────────┐
│    User      │  1:N    │    Goods     │
│──────────────│◄───────│──────────────│
│ id (PK)      │         │ id (PK)      │
│ username     │         │ title        │
│ password     │         │ price        │
│ nickname     │         │ descr        │
│ avatar       │         │ images       │
│ phone        │         │ categorie    │
│ sex          │         │ likes (int)  │
│ describes    │         │ created_at   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1:N                    │ 1:N
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│    Likes     │         │   Remark     │
│──────────────│         │──────────────│
│ id (PK)      │         │ id (PK)      │
│ created_at   │         │ content      │
│ user_id (FK) │         │ goods_id(FK) │
│ goods_id(FK) │         │ user_id (FK) │
└──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐
│   Friend     │         │    Step      │  (浏览历史)
│──────────────│         │──────────────│
│ id (PK)      │         │ id (PK)      │
│ friendId     │         │ goodid (int) │
│ user_id (FK) │         │ user_id (FK) │
│ created_at   │         │ created_at   │
└──────────────┘         └──────────────┘
```

---

## 🌐 服务端口

| 服务 | 地址 |
|------|------|
| 后端 API | http://127.0.0.1:8080 |
| Socket | 端口 9082 |
| 前端 H5 | http://localhost:5173 |

---

## ⚠️ 已知不足 & 优化方向

1. **JWT 单 token** → 升级为 access + refresh 双 token
2. **验证码用全局变量** → 改用 session/Redis 按 sessionId 隔离
3. **`synchronize: true`** → 生产关闭，改用 migration
4. **Socket.io 单例** → 改为 `Map<userId, Socket[]>` 支持点对点
5. **图片本地落盘** → 接 OSS/COS 对象存储
