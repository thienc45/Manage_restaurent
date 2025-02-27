import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { TableController } from "./table.controller";
import { Table } from "./table.entity/table.entity";
import { TablesService } from "./table.service";

@Module({
  imports: [TypeOrmModule.forFeature([Table, Guest])],
  controllers: [TableController],
  providers:  [TablesService],
  exports: [TypeOrmModule], // Export TypeOrmModule để các module khác có thể sử dụng TableRepository
})
export class TableModule {}
