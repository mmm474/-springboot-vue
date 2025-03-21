// 验证token，请求头中携带token，验证token是否有效
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../../config/tokenConfig"
import { UInfo } from "../../types/express";
export const AuthToken = (req: Request, res: Response, next: NextFunction): void => {
  // 获取请求头中的token字段
  const token = req.headers.token
  if (!token) {
    res.status(401).json({ message: "请先登录" })
  } else {
    try {
      // 验证token是否有效  code 433通知前端清楚token和用户缓存
      const decoded: UInfo = jwt.verify(token as string, TOKEN_SECRET_KEY) as UInfo
      if (!decoded) {
        res.status(401).json({ message: "token无效，请重新登录", code: 433 })
      } else {
        req.uInfo = decoded
        next()
      }
    } catch (error) {
      res.status(401).json({ message: "token已过期，请重新登录", code: 433 })
    }
  }
}




