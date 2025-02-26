import { Dish } from "src/dish/dish.entity/dish.entity";
import { Order } from "src/order/order.entity/order.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class DishSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({ default: "Available" })
  status: string;

  @Column({ nullable: true })
  dishId: number;

  @ManyToOne(() => Dish, (dish) => dish.dishSnapshots)
  @JoinColumn({ name: "dishId" })
  dish: Dish;

  @OneToOne(() => Order, (order) => order.dishSnapshot)
  order: Order;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
