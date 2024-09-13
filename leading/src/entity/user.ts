import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Trade } from ".";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idealFarmUserId: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column("text")
  fcmToken: string;

  @Column()
  accessKey: string;

  @Column()
  secretKey: string;

  @Column()
  isAuto: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Trade, (trades) => trades.user)
  trades: Trade[];
}
