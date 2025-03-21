import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/user.entity"

// 实体
const ENTITY = [User]

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "12345678",
  database: "second_trade",
  synchronize: true,
  entities: ENTITY,
  logging: false,
})

// 要与数据库建立初始连接，注册所有实体
// 并 "同步" 数据库模式，调用新创建的数据库的 "initialize()" 方法
// 在您的应用程序引导时只需调用一次

