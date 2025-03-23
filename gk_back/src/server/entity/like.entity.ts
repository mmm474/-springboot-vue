import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { User } from "./user.entity"
import { Goods } from "./goods.entity"

// interface GoodsInfo {
//   goodsId: number
//   goodsTitle: string
//   goodsImg: string

//   publisher: User
//   [key: string]: any
// }

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  @ManyToOne(() => User, user => user.likes)
  user!: User

  @ManyToOne(() => Goods, goods => goods.likes)
  goods!: Goods

}