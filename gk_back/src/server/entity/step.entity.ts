import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from "typeorm"
import { User } from "./user.entity";


@Entity()
export class Step {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  goodid!: number

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ type: 'varchar', default: '' })
  publicer?: string

  @Column({ type: 'int', default: 0 })
  publicerId?: number

  @Column({ type: "longtext" })
  cover?: string

  // 日期
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  @ManyToOne(() => User, user => user.steps)
  user!: User
}