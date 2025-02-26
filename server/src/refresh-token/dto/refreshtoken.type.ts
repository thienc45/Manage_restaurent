import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRefreshTokenDto {
  @ApiProperty({ example: "some-refresh-token", type: String })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiProperty({ example: "2025-12-31T23:59:59Z", type: Date })
  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
