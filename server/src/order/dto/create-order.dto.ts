import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  guestId: number;

  @IsNumber()
  @IsNotEmpty()
  dishId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  orderHandlerId: number;
}
