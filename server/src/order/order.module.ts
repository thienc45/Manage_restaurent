import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/account/account.entity/account.entity";
import { Dish } from "src/dish/dish.entity/dish.entity";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { OrderController } from "./order.controller";
import { Order } from "./order.entity/order.entity";
import { OrderService } from "./order.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Dish, Guest, Account])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
