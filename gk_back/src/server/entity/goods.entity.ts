import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { User } from "./user.entity"
import { Remark } from "./remark.entity"
import { Likes } from "./like.entity"
@Entity()
export class Goods {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ type: "int" })
  price!: number

  @Column({ type: "longtext" })
  descr!: string

  @Column({ type: "longtext" })
  images?: string

  // 分类
  @Column({ type: "varchar", length: 255 })
  categorie?: string

  // 点赞数
  @Column({ type: "int", default: 0 })
  likes!: number

  // 日期
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  // 评论
  @OneToMany(() => Remark, remark => remark.goods)
  remarks!: Remark[]

  @ManyToOne(() => User, user => user.goods)
  user!: User

  @OneToMany(() => Likes, likes => likes.goods)
  Likes!: Likes

}