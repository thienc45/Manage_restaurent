import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./account/account.entity/account.entity";
import { AccountModule } from "./account/account.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import envConfig from "./config";
import databaseConfig from "./database/database.config";
import { DishSnapshot } from "./dish-snapshot/dish-snapshot.entity/dishnnapshot.entity";
import { DishSnapshotModule } from "./dish-snapshot/dish-snapshot.module";
import { Dish } from "./dish/dish.entity/dish.entity";
import { DishModule } from "./dish/dish.module";
import { Guest } from "./guest/guest.entity/guest.entity";
import { GuestModule } from "./guest/guest.module";
import { MailerModuleSend } from "./mailer/mailer.module";
import { Order } from "./order/order.entity/order.entity";
import { OrderModule } from "./order/order.module";
import { RefreshToken } from "./refresh-token/refresh-token.entity/refreshtoken.dto";
import { RefreshTokenModule } from "./refresh-token/refresh-token.module";
import { JwtStrategy } from "./role/jwt.strategy";
import { Socket } from "./socket/socket.entity/socket.type";
import { SocketModule } from "./socket/socket.module";
import { Table } from "./table/table.entity/table.entity";
import { TableModule } from "./table/table.module";
import { User } from "./user/user.entity/user.entity";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: [".env"],
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: envConfig.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT as any, 10) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "restaurant_management",
      entities: [
        User,
        Account,
        Order,
        RefreshToken,
        Socket,
        Guest,
        Table,
        DishSnapshot,
        Dish,
      ],
      synchronize: process.env.DB_SYNC === "true",
      logging: process.env.DB_LOGGING === "true",
    }),
    UserModule,
    AccountModule,
    DishModule,
    DishSnapshotModule,
    TableModule,
    OrderModule,
    RefreshTokenModule,
    GuestModule,
    SocketModule,
    MailerModuleSend,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AppModule {}
function join(__dirname: string, arg1: string) {
  throw new Error("Function not implemented.");
}
