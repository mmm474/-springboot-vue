import express from "express";
import { AuthToken } from "../utils/auth"
import UserService from "../service/user";
import { uploads } from "../utils/uploads";
import { host, port } from "../../config/serve";
import svgCaptcha from "svg-captcha"

const userRouter = express.Router();
let codeTxt = ''
// 用户注册
userRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  res.send(await UserService.userRegister(username, password))
})
// 用户登陆
userRouter.post("/login", async (req, res) => {
  const { username, password, user_code } = req.body;
  console.log(username, password, user_code)
  res.send(await UserService.userLogin(username, password, user_code))
})
// 获取用户信息
userRouter.get("/info", AuthToken, (req, res) => {
  res.send({
    data: req.uInfo,
    code: 200,
    msg: "获取信息成功",
    success: true
  })
})
// 查询用户信息
userRouter.get("/search", AuthToken, async (req, res) => {

  const userId = req.uInfo?.id;

  res.send(await UserService.searchUser(parseInt(userId as string)))
})
// C:\Users\MECHREVO\Desktop\second-hand-trading-platform\gk_back\src\static\image\1742631559532_iLPHjp4qaCzWd9de3f4c2cc7e9717e59810e8717ab26.jpg
// 修改用户信息
userRouter.post("/updateInfo", AuthToken, uploads.array('files', 10), async (req, res) => {
  console.log(req.files)
  console.log('路径--', process.cwd())
  const avatar = Array.from(req.files as Express.Multer.File[]).map(i => i.path)[0]
  console.log(avatar)
  const userId = req.uInfo?.id;
  const { nickname, phone, sex, describes } = req.body;
  res.send(await UserService.updateUserInfo(parseInt(userId as string), nickname, avatar, phone, sex, describes))
})

// 修改密码
userRouter.post("/updatePassword", AuthToken, async (req, res) => {
  const userId = req.uInfo?.id;
  const { oldPassword, newPassword } = req.body;
  res.send(await UserService.updatePassword(parseInt(userId as string), oldPassword, newPassword))
})


// 创建验证码
userRouter.get("/create", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    width: 150,
    height: 80,
    fontSize: 50,
    noise: 2,
    color: true,
    background: '#cc9966'
  })
  codeTxt = captcha.text
  req.session.code = captcha.text
  // 自定义响应头
  res.type('image/svg+xml')
  res.status(200).send(captcha.data)
})

// 获取验证码
userRouter.get("/getcode", (req, res) => {
  res.send({
    code: 200,
    msg: "获取验证码成功",
    success: true,
    data: host + ':' + port + '/api/user/create'
  })
})

// 验证验证码 不区分大小写
userRouter.post("/checkcode", (req, res) => {
  console.log(codeTxt)
  const { code } = req.body
  if (codeTxt.toLowerCase() === code.toLowerCase()) {
    res.send({
      success: true,
      msg: "验证码正确",
      data: null,
      code: 200
    })
  } else {
    res.send({
      success: false,
      msg: "验证码错误",
      data: null,
      code: 400
    })
  }
})


export default userRouter;

