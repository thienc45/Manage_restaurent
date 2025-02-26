import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTableBodyType {
  @IsNumber()
  number: number;

  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsString()
  status?: string;
}
