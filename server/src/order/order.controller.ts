import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async getOrders() {
    return this.orderService.findAll();
  }

  @Get(":id")
  async getOrder(@Param("id") id: number) {
    return this.orderService.findOne(id);
  }

  @Put(":id")
  async updateOrder(
    @Param("id") id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(":id")
  async deleteOrder(@Param("id") id: number) {
    return this.orderService.remove(id);
  }
}
