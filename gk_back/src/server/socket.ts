import express from "express";
import http from "http"; // 引入 http 模块
// socket
import { DefaultEventsMap, Server, Socket } from "socket.io"; // 引入 socket.io
import { socketPort } from "../config/serve";
let SocketIns: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
const app = express();
const server = http.createServer(app); // 创建服务器
const io = new Server(server, {
  cors: {
    origin: "*", // 允许所有来源
  },
}); // 创建 socket.io 服务

// 监听连接事件
io.on("connection", (socket) => {
  SocketIns = socket
  console.log("A user connected:", socket.id);


  // 监听断开连接事件
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



export const getSocketIns = () => SocketIns

server.listen(socketPort, () => {
  console.log('socket服务启动成功',)
})