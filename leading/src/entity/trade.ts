import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User, Pick } from ".";

@Entity()
export class Trade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @Column()
  userPrice: string;

  @Column()
  type: string;

  @Column()
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.trades)
  user!: User;

  @ManyToOne((type) => Pick, (pick) => pick.trades)
  pick!: Pick;
}
