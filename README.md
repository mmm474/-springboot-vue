# 校园二手交易平台

基于 **Spring Boot 3 + Vue 3** 的前后端分离二手交易平台，移动端 H5 风格，覆盖商品发布、分类搜索、点赞收藏、评论、关注互动、浏览足迹等全流程。

---

## 🛠️ 技术栈

| 层 | 技术选型 |
|---|---|
| **前端** | Vue 3 (Composition API) · TypeScript · Vite · Vue Router · Pinia · Vant 4 · Axios |
| **后端** | Java 17 · Spring Boot 3 · Spring Web · Spring Data JPA (Hibernate) |
| **数据库** | MySQL 8 |
| **鉴权** | JWT（24h，请求头 `token` 字段）· Session 图形验证码 |
| **文件** | MultipartFile 本地上传 + MIME/扩展名双重白名单校验 |

---

## 📂 项目结构

```
second-hand-trading-platform/
├── backend/                         # Spring Boot 后端
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/secondhand/
│       │   ├── SecondhandApplication.java   # 启动类
│       │   ├── common/             # 通用工具（JwtUtil / CaptchaUtil / Result）
│       │   ├── config/             # 配置（WebConfig 跨域与拦截器 / 全局异常）
│       │   ├── interceptor/        # JWT 登录拦截器
│       │   ├── controller/         # 控制层（user/goods/friend/tools）
│       │   ├── service/            # 业务层
│       │   ├── repository/         # JPA Repository
│       │   ├── entity/             # 实体（User/Goods/Likes/Remark/Friend/Step）
│       │   └── vo/                 # 视图对象
│       └── resources/application.yml
│
└── frontend/                        # Vue 3 前端
    ├── vite.config.ts              # /api 代理到 8080
    ├── index.html
    └── src/
        ├── api/                    # axios 封装与接口模块（request/user/goods）
        ├── router/                 # 路由表 + 登录守卫
        ├── stores/                 # Pinia（user 登录态）
        ├── views/                  # 页面（11 个）
        ├── components/             # 公共组件（TabBar）
        ├── types/                  # TS 类型定义
        ├── utils/                  # 工具（本地缓存 / 时间格式化）
        ├── styles/                 # 全局样式
        └── assets/
```

---

## 🎯 核心功能

- **用户模块**：注册（图形验证码）、登录（JWT）、修改资料（含头像上传）、修改密码、用户搜索
- **商品模块**：发布（多图上传）、分页列表、分类筛选、关键字搜索、详情、删除
- **互动模块**：点赞/取消点赞、评论、关注/取消关注、浏览足迹
- **个人中心**：我的收藏、我的发布、我的关注、编辑资料

### 页面一览

| 路由 | 页面 |
|---|---|
| `/login` `/register` | 登录 / 注册 |
| `/` | 首页（分类 + 搜索） |
| `/square` | 社区广场（信息流 + 发布入口） |
| `/profile` | 个人中心（含足迹） |
| `/detail/:id` | 商品详情（评论、点赞、关注、删除） |
| `/publish` | 发布商品 |
| `/likes` `/works` `/friends` | 收藏 / 发布 / 关注 |
| `/edit` | 编辑资料 |

---

## 🚀 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- Node.js 18+
- MySQL 8（5.7 亦可）

### 1. 数据库

创建数据库（表由 JPA `ddl-auto: update` 自动创建）：

```sql
CREATE DATABASE second_trade DEFAULT CHARACTER SET utf8mb4;
```

如账号密码不同，修改 [backend/src/main/resources/application.yml](backend/src/main/resources/application.yml) 中的 `spring.datasource`。

### 2. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端运行在 http://localhost:8080，接口统一前缀 `/api`，上传图片访问路径 `/api/static/image/**`。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173 ，开发服务器已将 `/api` 代理到后端 8080 端口。

### 4. 生产构建

```bash
cd frontend
npm run build     # 产物输出到 frontend/dist
```

---

## 🔐 鉴权说明

- 登录成功后后端签发 24h JWT，前端存入 `localStorage`
- Axios 请求拦截器自动在请求头携带 `token`
- 后端 `AuthInterceptor` 对商品、关注及用户敏感接口做登录校验
- 收到 401 时前端自动清除登录态并跳转登录页

---

## ⚠️ 已知不足 & 优化方向

1. JWT 单 token、无黑名单 → 可升级 access + refresh 双 token
2. `ddl-auto: update` → 生产环境改用 Flyway/Liquibase
3. JWT 密钥与数据库口令写在配置文件 → 改用环境变量
4. 图片本地落盘 → 可接入 OSS/COS 对象存储
