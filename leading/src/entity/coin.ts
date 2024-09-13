import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { PickGroup } from ".";

@Entity()
export class Coin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  image: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => PickGroup, (pickGroups) => pickGroups.coin)
  pickGroups: PickGroup[];
}
