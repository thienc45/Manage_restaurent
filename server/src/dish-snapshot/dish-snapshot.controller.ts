import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { DishSnapshotService } from "./dish-snapshot.service";
import { CreateDishSnapshotDto } from "./dto/create-dish-snapshot.dto";
import { UpdateDishSnapshotDto } from "./dto/update-dish-snapshot.dto";

@Controller("dish-snapshots")
export class DishSnapshotController {
  constructor(private readonly dishSnapshotService: DishSnapshotService) {}

  @Get()
  async findAll() {
    return await this.dishSnapshotService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.dishSnapshotService.findOne(id);
  }

  @Post()
  async create(@Body() createDishSnapshotDto: CreateDishSnapshotDto) {
    return await this.dishSnapshotService.create(createDishSnapshotDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateDishSnapshotDto: UpdateDishSnapshotDto
  ) {
    return await this.dishSnapshotService.update(id, updateDishSnapshotDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    await this.dishSnapshotService.remove(id);
    return { message: `DishSnapshot với ID ${id} đã được xóa` };
  }
}
