import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { User } from "./user.entity"
import { Remark } from "./remark.entity"
import { Likes } from "./like.entity"




@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id!: number

  // friendId
  @Column({ type: "int", default: 0 })
  friendId!: number

  // 昵称
  @Column({ type: "varchar", default: `用户`, length: 255 })
  nickname!: string

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


  @ManyToOne(() => User, user => user.goods)
  user!: User



}