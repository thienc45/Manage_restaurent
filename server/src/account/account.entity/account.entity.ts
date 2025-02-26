import { Order } from "src/order/order.entity/order.entity";
import { RefreshToken } from "src/refresh-token/refresh-token.entity/refreshtoken.dto";
import { Socket } from "src/socket/socket.entity/socket.type";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: "Employee" })
  role: string;

  @OneToMany(() => Order, (order) => order.orderHandler)
  orders: Order[];

  @OneToMany(() => Account, (account) => account.owner)
  employees: Account[];

  @ManyToOne(() => Account, (account) => account.employees)
  @JoinColumn({ name: "ownerId" })
  owner: Account;

  @Column({ nullable: true })
  ownerId: number;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.account)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Socket, (socket) => socket.account)
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
