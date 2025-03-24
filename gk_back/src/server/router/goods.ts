import express from "express";
// import { port, host } from "../../config/serve";
// import { uploads } from "../utils/uploads";
import { AuthToken } from "../utils/auth"
import GoodsService from "../service/good";

const goodsRouter = express.Router();
goodsRouter.use(AuthToken);

// 发布商品
goodsRouter.post("/publish", async (req, res) => {
  try {
    const { title, price, descr, categorie, images } = req.body;
    // const images = Array.from(req.files as Express.Multer.File[]).map(i => i.path).join(",");
    const userId = req.uInfo!.id
    res.send(await GoodsService.addGoods(parseInt(userId), title, parseInt(price), descr, categorie, images))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})


// 获取商品列表
goodsRouter.get("/list", async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    res.send(await GoodsService.getGoodsList(parseInt(page as string), parseInt(pageSize as string)))
  } catch (error) {
    res.status(500).send(error)
  }
})

// 获取不同分类的商品列表
goodsRouter.get("/getListByCategorie", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, categorie } = req.query;
    res.send(await GoodsService.getListByCategorie(parseInt(page as string), parseInt(pageSize as string), categorie as string))
  } catch (error) {
    res.status(500).send(error)
  }
})

// 获取商品详情
goodsRouter.get("/detail", async (req, res) => {
  try {
    const { id } = req.query;
    res.send(await GoodsService.getGoodsDetail(parseInt(id as string)))
  } catch (error) {
    res.status(500).send(error)
  }
})

// 获取用户发布的商品
goodsRouter.get("/userlist", async (req, res) => {
  const { id } = req.query;
  try {
    const userId = id ? id : req.uInfo!.id
    res.send(await GoodsService.getUserGoodsList(parseInt(userId as string)))
  } catch (error) {
    res.status(500).send(error)
  }
})

// 评论商品
goodsRouter.post("/upremark", async (req, res) => {
  try {
    const { id, content } = req.body;
    const userId = req.uInfo!.id
    res.send(await GoodsService.addRemark(parseInt(userId), parseInt(id as string), content))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 点赞商品
goodsRouter.post("/uplike", async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.uInfo!.id
    res.send(await GoodsService.addLike(parseInt(userId), parseInt(id as string)))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 取消点赞
goodsRouter.post("/downlike", async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.uInfo!.id
    res.send(await GoodsService.delLike(parseInt(userId), parseInt(id as string)))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 获取用户点赞列表
goodsRouter.get("/getlikes", async (req, res) => {
  try {
    const userId = req.uInfo!.id
    res.send(await GoodsService.getLikeList(parseInt(userId as string)))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 添加历史浏览
goodsRouter.post("/addhistory", async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.uInfo!.id
    res.send(await GoodsService.addHistory(parseInt(userId), parseInt(id as string)))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 获取用户历史浏览
goodsRouter.get("/gethistory", async (req, res) => {
  try {
    const userId = req.uInfo!.id
    res.send(await GoodsService.getHistory(parseInt(userId as string)))
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

// 通过商品名称搜索商品
goodsRouter.post("/search", async (req, res) => {
  console.log(req.query)
  try {
    const { page = 1, pageSize = 999, title } = req.body;
    res.send(await GoodsService.searchGoods(parseInt(page as string), parseInt(pageSize as string), title as string))
  } catch (error) {
    res.status(500).send(error)
  }
})

export default goodsRouter;