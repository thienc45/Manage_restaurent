import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { CreateTableBodyType } from "./dto/create-table.dto";
import { UpdateTableBodyType } from "./dto/update-table.dto";
import { TablesService } from "./table.service";

@Controller("tables")
export class TableController {
  constructor(private readonly tablesService: TablesService) {}

  // Lấy danh sách bàn
  @Get()
  async getTableList() {
    return this.tablesService.getTableList();
  }

  // Lấy thông tin chi tiết của bàn theo số bàn
  @Get(":number")
  async getTableDetail(@Param("number", ParseIntPipe) number: number) {
    return this.tablesService.getTableDetail(number);
  }

  // Tạo bàn mới
  @Post()
  async createTable(@Body() data: CreateTableBodyType) {
    return this.tablesService.createTable(data);
  }

  // Cập nhật thông tin bàn
  @Put(":number")
  async updateTable(
    @Param("number", ParseIntPipe) number: number,
    @Body() data: UpdateTableBodyType
  ) {
    return this.tablesService.updateTable(number, data);
  }

  // Xóa bàn
  @Delete(":number")
  async deleteTable(@Param("number", ParseIntPipe) number: number) {
    return this.tablesService.deleteTable(number);
  }
}
