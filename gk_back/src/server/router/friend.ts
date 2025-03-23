import express from "express";
// import { port, host } from "../../config/serve";
// import { uploads } from "../utils/uploads";
import { AuthToken } from "../utils/auth"
import FriendService from "../service/friend"

const friendRouter = express.Router();
friendRouter.use(AuthToken);


// 添加好友
friendRouter.post("/add", async (req, res) => {
  const { friendId } = req.body;
  const userId = req.uInfo!.id
  res.send(await FriendService.addFriend(userId, friendId))
})

// 获取好友列表
friendRouter.get("/list", async (req, res) => {
  const userId = req.uInfo!.id
  res.send(await FriendService.getFriendList(userId))
})

// 删除好友
friendRouter.post("/delete", async (req, res) => {
  const { friendId } = req.body;
  res.send(await FriendService.deleteFriend(friendId))
})
export default friendRouter;