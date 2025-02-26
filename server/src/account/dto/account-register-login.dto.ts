import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { lowerCaseTransformer } from "src/common/transormer/lower-case.transformer";

export class AcountRegisterLoginDto {
  // @ApiProperty({ example: "test1@example.com", type: String })
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;

  @IsNotEmpty()
  @MinLength(6) // Mật khẩu ít nhất 6 ký tự
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
