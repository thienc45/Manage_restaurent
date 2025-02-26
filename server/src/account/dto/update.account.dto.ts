import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { Role, RoleType } from "src/common/constants/typecontants";

export class UpdateEmployeeAccountDto {
  @ApiProperty({
    description: "Tên nhân viên",
    example: "Nguyễn Văn A",
    minLength: 2,
    maxLength: 256,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  name: string;

  @ApiProperty({
    description: "Email nhân viên",
    example: "example@email.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Ảnh đại diện (URL)",
    example: "https://example.com/avatar.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: "Có thay đổi mật khẩu không?",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  changePassword?: boolean;

  @ApiProperty({
    description: "Mật khẩu mới (nếu có thay đổi)",
    example: "newPassword123",
    minLength: 6,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ValidateIf((dto) => dto.changePassword === true)
  password?: string;

  @ApiProperty({
    description: "Xác nhận mật khẩu mới",
    example: "newPassword123",
    minLength: 6,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ValidateIf((dto) => dto.changePassword === true)
  confirmPassword?: string;

  @ApiProperty({
    description: "Vai trò của nhân viên",
    example: Role.Employee,
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role: RoleType = Role.Employee;
}
