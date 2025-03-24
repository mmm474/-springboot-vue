import express from "express";
import ViteExpress from "vite-express";
import session from 'express-session';
import cors from "cors";
import path from "path";
import './socket'

// 路由
import userRouter from "./router/user";
import goodsRouter from "./router/goods";
import toolsRouter from "./router/tools";
import friendRouter from "./router/friend";
import { AppDataSource } from "./utils/data";
// 服务器
import { port, host } from "../config/serve";

const app = express();
// 允许跨域
app.use(cors({
  origin: '*',
  credentials: true,
}));



app.use('/static', express.static(path.resolve(process.cwd(), 'src/static')))
// 允许接受formdata
app.use(express.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    name: 'codeText',
    saveUninitialized: false,
    rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
  }),
);

// 解析json
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/goods', goodsRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/friend', friendRouter)

ViteExpress.listen(app, parseInt(port + ''), () => {
  AppDataSource.initialize()
    .then(() => {
      // 在这里您可以开始使用数据库
      console.log(`Server on ${host}:${port}`)
    })
    .catch((error) => console.log(error))
});


declare module "express-session" {
  interface SessionData {
    code?: string;
  }
}