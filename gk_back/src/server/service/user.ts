import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY, TOKEN_EXPIRES_TIME } from "../../config/tokenConfig"
import { AppDataSource } from "../utils/data"
import { User } from "../entity/user.entity";
class UserService {
  // 用户注册
  userRegister = async (username: string, password: string) => {
    const isExist = await AppDataSource.getRepository(User).findOneBy({ username })
    if (isExist) {
      return { code: 201, success: false, msg: "用户名已存在" }
    }
    const user = new User()
    user.username = username
    user.password = password
    await AppDataSource.getRepository(User).save(user)
    return { success: true, msg: "注册成功", code: 200 }
  }
  // 用户登录
  userLogin = async (username: string, password: string, user_code: string) => {
    const isExist = await AppDataSource.getRepository(User).findOneBy({ username, password })
    if (!isExist) {
      return { code: 201, success: false, msg: "用户名或密码错误" }
    }
    isExist.user_code = user_code
    await AppDataSource.getRepository(User).update({ id: isExist.id }, { user_code })

    const token = jwt.sign({ ...isExist, username: '', password: '', id: isExist.id }, TOKEN_SECRET_KEY, { expiresIn: TOKEN_EXPIRES_TIME })

    return { success: true, data: { token }, msg: "登录成功", code: 200 }
  }
  // 查询用户信息
  searchUser = async (userId: number) => {

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      relations: ['goods', 'categories']
    })

    if (!user) {
      return { code: 201, success: false, msg: "用户不存在" }
    }
    return { success: true, data: user, msg: "查询成功", code: 200 }
  }

  // 更新用户信息
  async updateUserInfo(userId: number, nickname: string, avatar: string, phone: string, sex: number, describes: string) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId })
    if (!user) {
      return { code: 201, success: false, msg: "用户不存在" }
    }
    await AppDataSource.getRepository(User).update({ id: userId }, { nickname, avatar, phone, sex, describes })
    const userInfo = { ...user, username: '', password: '', id: user.id, nickname, avatar, phone, sex, describes }
    // 更新token
    const token = jwt.sign(userInfo, TOKEN_SECRET_KEY, { expiresIn: TOKEN_EXPIRES_TIME })

    return { success: true, msg: "更新成功", code: 200, data: { token, userInfo } }
  }

  // 修改密码
  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId })
    if (!user) {
      return { code: 201, success: false, msg: "用户不存在" }
    }
    if (user.password !== oldPassword) {
      return { code: 201, success: false, msg: "旧密码错误" }
    }
    await AppDataSource.getRepository(User).update({ id: userId }, { password: newPassword })
    return { success: true, msg: "修改成功", code: 200 }
  }
}

export default new UserService()