import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { User } from "./user.entity"
import { Goods } from "./goods.entity"
@Entity()
export class Remark {
  @PrimaryGeneratedColumn()
  id!: number

  @Column(
    {
      type: 'varchar',
      length: 100,
    }
  )
  content!: string

  // 评论人
  @Column(
    {
      type: 'varchar',
      length: 100,
    }
  )
  nickname!: string

  // 评论人头像
  @Column({
    type: 'varchar',
  })
  avatar!: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  @ManyToOne(() => User, user => user.remarks)
  user!: User

  @ManyToOne(() => Goods, goods => goods.remarks)
  goods!: Goods

}