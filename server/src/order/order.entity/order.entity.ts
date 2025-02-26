import { Account } from "src/account/account.entity/account.entity";
import { DishSnapshot } from "src/dish-snapshot/dish-snapshot.entity/dishnnapshot.entity";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { Table } from "src/table/table.entity/table.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  guestId: number;

  @ManyToOne(() => Guest, (guest) => guest.orders)
  @JoinColumn({ name: "guestId" })
  guest: Guest;

  @Column({ nullable: true })
  tableNumber: number;

  @ManyToOne(() => Table, (table) => table.orders)
  @JoinColumn({ name: "tableNumber" })
  table: Table;

  @OneToOne(() => DishSnapshot, (dishSnapshot) => dishSnapshot.order)
  @JoinColumn({ name: "dishSnapshotId" })
  dishSnapshot: DishSnapshot;

  @Column()
  dishSnapshotId: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  orderHandlerId: number;

  @ManyToOne(() => Account, (account) => account.orders)
  @JoinColumn({ name: "orderHandlerId" })
  orderHandler: Account;

  @Column({ default: "Pending" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
