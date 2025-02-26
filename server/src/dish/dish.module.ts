import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishController } from "./dish.controller";
import { Dish } from "./dish.entity/dish.entity";
import { DishService } from "./dish.service";

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [DishController],
  providers: [DishService, JwtService],
})
export class DishModule {}
