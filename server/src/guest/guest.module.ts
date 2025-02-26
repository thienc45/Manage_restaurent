import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Table } from "src/table/table.entity/table.entity";
import { GuestController } from "./guest.controller";
import { Guest } from "./guest.entity/guest.entity";
import { GuestService } from "./guest.service";

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Table])],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
