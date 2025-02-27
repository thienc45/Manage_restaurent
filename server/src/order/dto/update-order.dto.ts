import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  dishId?: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsEnum(["Pending", "Processing", "Delivered", "Paid"])
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  orderHandlerId?: number;
}
