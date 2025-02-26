import { Order } from "src/order/order.entity/order.entity";
import { Socket } from "src/socket/socket.entity/socket.type";
import { Table } from "src/table/table.entity/table.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  tableNumber: number;

  @ManyToOne(() => Table, (table) => table.guests)
  @JoinColumn({ name: "tableNumber" })
  table: Table;

  @OneToMany(() => Order, (order) => order.guest)
  orders: Order[];

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExpiresAt: Date;

  @OneToMany(() => Socket, (socket) => socket.guest)
  sockets: Socket[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
