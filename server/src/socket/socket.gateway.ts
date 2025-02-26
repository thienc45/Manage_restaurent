import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ManagerRoom, Role } from "src/common/constants/typecontants";
import { AuthError } from "src/utils/errors";
import { verifyAccessToken } from "src/utils/jwt";
import { SocketService } from "./socket.service";

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: SocketService) {}

  async handleConnection(socket: Socket) {
    console.log("🔌 Socket connected:", socket.id);

    const { Authorization } = socket.handshake.auth;
    if (!Authorization) {
      throw new AuthError("Authorization không hợp lệ");
    }

    const accessToken = Authorization.split(" ")[1];

    try {
      const decodedAccessToken = verifyAccessToken(accessToken);
      const { userId, role } = decodedAccessToken;

      if (role === Role.Guest) {
        // Xử lý Guest
        await this.prisma.socket.upsert({
          where: { guestId: userId },
          update: { socketId: socket.id },
          create: { guestId: userId, socketId: socket.id },
        });
      } else {
        // Xử lý User (Admin, User, etc.)
        await this.prisma.socket.upsert({
          where: { accountId: userId },
          update: { socketId: socket.id },
          create: { accountId: userId, socketId: socket.id },
        });
        socket.join(ManagerRoom); // Admin vào phòng quản lý
      }

      socket.handshake.auth.decodedAccessToken = decodedAccessToken;
    } catch (error) {
      throw new AuthError("Token không hợp lệ");
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log("🔌 Socket disconnected:", socket.id);
    await this.prisma.socket.deleteMany({ where: { socketId: socket.id } });
  }

  @SubscribeMessage("message")
  handleMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log("Message received:", data);
    socket.emit("message", { msg: "Tin nhắn đã nhận" });
  }
}
