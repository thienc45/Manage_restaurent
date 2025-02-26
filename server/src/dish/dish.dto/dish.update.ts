import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';


export class UpdateDishBodyType {
  @IsOptional()
  @IsString({ message: "Tên món ăn phải là chuỗi ký tự" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Mô tả món ăn phải là chuỗi ký tự" })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "Giá món ăn phải là số" })
  @IsPositive({ message: "Giá món ăn phải lớn hơn 0" })
  price?: number;

  @IsOptional()
  @IsString({ message: "URL hình ảnh phải là chuỗi ký tự" })
  imageUrl?: string;
}
