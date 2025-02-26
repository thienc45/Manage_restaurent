import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "src/refresh-token/refresh-token.entity/refreshtoken.dto";
import { RefreshTokenService } from "src/refresh-token/refresh-token.service";
import { Socket } from "src/socket/socket.entity/socket.type";
import { SocketService } from "src/socket/socket.service";
import { AccountController } from "./account.controller";
import { Account } from "./account.entity/account.entity";
import { AccountService } from "./account.service";

@Module({
  imports: [TypeOrmModule.forFeature([Account, RefreshToken, Socket])],
  controllers: [AccountController],
  providers: [AccountService, RefreshTokenService, SocketService],
  exports: [AccountService, RefreshTokenService],
})
export class AccountModule {}
