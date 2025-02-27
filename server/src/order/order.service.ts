import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Dish } from "src/dish/dish.entity/dish.entity";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { Table } from "src/table/table.entity/table.entity";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./order.entity/order.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { guestId, dishId, quantity, orderHandlerId } = createOrderDto;

    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
    });
    if (!guest) {
      throw new NotFoundException("Guest not found");
    }

    const dish = await this.dishRepository.findOne({ where: { id: dishId } });
    if (!dish) {
      throw new NotFoundException("Dish not found");
    }
    if (dish.status === "Unavailable" || dish.status === "Hidden") {
      throw new Error(`Món ${dish.name} không thể đặt`);
    }

    const order = this.orderRepository.create({
      guest,
      dishSnapshot: dish,
      quantity,
      orderHandlerId,
      status: "Pending",
    });

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ["dishSnapshot", "guest", "orderHandler"],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ["dishSnapshot", "guest", "orderHandler"],
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }
}
