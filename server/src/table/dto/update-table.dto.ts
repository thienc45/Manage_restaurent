import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTableBodyType {
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  changeToken?: boolean;
}
