import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.entity/user.entity";

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;
}
