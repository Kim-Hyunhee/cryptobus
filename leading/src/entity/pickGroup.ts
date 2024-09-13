import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Bot, Coin, Pick } from ".";

@Entity()
export class PickGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serialNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Bot, (bot) => bot.pickGroups)
  bot!: Bot;

  @ManyToOne((type) => Coin, (coin) => coin.pickGroups)
  coin!: Coin;

  @OneToMany((type) => Pick, (picks) => picks.pickGroup)
  picks: Pick[];
}
