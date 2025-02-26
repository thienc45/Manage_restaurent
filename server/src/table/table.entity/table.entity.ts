import { Guest } from "src/guest/guest.entity/guest.entity";
import { Order } from "src/order/order.entity/order.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Table {
  @PrimaryColumn()
  number: number;

  @Column()
  capacity: number;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @OneToMany(() => Guest, (guest) => guest.table)
  guests: Guest[];

  @Column({ default: "Available" })
  status: string;

  @Column()
  token: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
