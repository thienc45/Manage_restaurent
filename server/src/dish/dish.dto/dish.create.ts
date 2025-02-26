// dto/dish.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateDishBodyType {
  @IsNotEmpty({ message: "Tên món ăn không được để trống" })
  @IsString({ message: "Tên món ăn phải là chuỗi ký tự" })
  name: string;

  @IsOptional()
  @IsString({ message: "Mô tả món ăn phải là chuỗi ký tự" })
  description?: string;

  @IsNotEmpty({ message: "Giá món ăn không được để trống" })
  @IsNumber({}, { message: "Giá món ăn phải là số" })
  @IsPositive({ message: "Giá món ăn phải lớn hơn 0" })
  price: number;

  @IsOptional()
  @IsString({ message: "URL hình ảnh phải là chuỗi ký tự" })
  imageUrl?: string;
}
