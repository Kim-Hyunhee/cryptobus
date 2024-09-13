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
import { PickGroup, Trade } from ".";

@Entity()
export class Pick extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  side: string;

  @Column()
  position: string;

  @Column()
  volume: string;

  @Column()
  price: string;

  @Column()
  orderType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => PickGroup, (pickGroup) => pickGroup.picks)
  pickGroup!: PickGroup;

  @OneToMany((type) => Trade, (trade) => trade.pick)
  trades: Trade[];
}
