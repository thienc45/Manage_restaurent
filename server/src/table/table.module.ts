import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TableController } from "./table.controller";
import { Table } from "./table.entity/table.entity";
import { TableService } from "./table.service";

@Module({
  imports: [TypeOrmModule.forFeature([Table])],
  controllers: [TableController],
  providers: [TableService],
  exports: [TypeOrmModule], // Export TypeOrmModule để các module khác có thể sử dụng TableRepository
})
export class TableModule {}
