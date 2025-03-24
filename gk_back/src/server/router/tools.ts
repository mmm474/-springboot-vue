// 工具路由

// 上传文件

import express from "express";
import { port, host } from "../../config/serve";
import { uploads } from "../utils/uploads";
import { AuthToken } from "../utils/auth"


export const toolsRouter = express.Router()
toolsRouter.use(AuthToken)

// 上传文件
toolsRouter.post('/upload', uploads.single('file'), (req, res) => {
  // console.log(req.file)
  const url = req.file.path.replace(process.cwd() + '/src', `${host}:${port}`)
  res.send({
    code: 200,
    msg: '上传成功',
    data: {
      url
    }
  })
})


export default toolsRouter
