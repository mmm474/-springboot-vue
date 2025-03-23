import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Goods } from "./goods.entity"
import { Remark } from "./remark.entity"
import { Likes } from "./like.entity"
import { Friend } from "./friend.entity"
import { Step } from "./step.entity"
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", default: "用户", length: 255 })
  username!: string

  @Column({ type: "varchar", default: "", length: 255 })
  user_code!: string

  @Column({ type: "varchar", default: "123456", length: 255 })
  password!: string

  // 管理员和普通用户
  @Column({ type: "int", default: 0 })
  role!: number

  // 昵称
  @Column({ type: "varchar", default: `用户`, length: 255 })
  nickname!: string

  constructor() {
    this.nickname = `用户${Math.floor(Math.random() * 1000)}`; // 生成用户昵称，例如 用户123
  }

  // 头像
  @Column({ type: "varchar", default: "", length: 255 })
  avatar!: string

  // 电话
  @Column({ type: "varchar", default: "", length: 255 })
  phone?: string

  // 日期
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date

  // 性别
  @Column({ type: "int", default: 0 })
  sex?: number

  // 简介
  @Column({ type: "varchar", default: "", length: 255 })
  describes?: string

  @OneToMany(() => Goods, (goods) => goods.user)
  goods!: Goods[]

  @OneToMany(() => Remark, (remark) => remark.user)
  remarks!: Remark[]

  @OneToMany(() => Likes, (likes) => likes.user)
  likes!: Likes[]

  @OneToMany(() => Friend, (friend) => friend.user)
  friends!: Friend[]

  @OneToMany(() => Step, (step) => step.user)
  steps!: Step[]

}