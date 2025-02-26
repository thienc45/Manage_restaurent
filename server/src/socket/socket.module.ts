import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocketController } from "./socket.controller";
import { Socket } from "./socket.entity/socket.type";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";

@Module({
  imports: [TypeOrmModule.forFeature([Socket])],
  controllers: [SocketController],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
