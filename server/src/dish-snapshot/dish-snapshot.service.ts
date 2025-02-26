import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DishSnapshot } from "./dish-snapshot.entity/dishnnapshot.entity";
import { CreateDishSnapshotDto } from "./dto/create-dish-snapshot.dto";
import { UpdateDishSnapshotDto } from "./dto/update-dish-snapshot.dto";

@Injectable()
export class DishSnapshotService {
  constructor(
    @InjectRepository(DishSnapshot)
    private dishSnapshotRepository: Repository<DishSnapshot>
  ) {}

  async findAll(): Promise<DishSnapshot[]> {
    return await this.dishSnapshotRepository.find();
  }

  async findOne(id: number): Promise<DishSnapshot> {
    const dishSnapshot = await this.dishSnapshotRepository.findOne({
      where: { id },
    });
    if (!dishSnapshot) {
      throw new NotFoundException(`DishSnapshot với ID ${id} không tồn tại`);
    }
    return dishSnapshot;
  }

  async create(
    createDishSnapshotDto: CreateDishSnapshotDto
  ): Promise<DishSnapshot> {
    const newDishSnapshot = this.dishSnapshotRepository.create(
      createDishSnapshotDto
    );
    return await this.dishSnapshotRepository.save(newDishSnapshot);
  }

  async update(
    id: number,
    updateDishSnapshotDto: UpdateDishSnapshotDto
  ): Promise<DishSnapshot> {
    const dishSnapshot = await this.findOne(id);
    Object.assign(dishSnapshot, updateDishSnapshotDto);
    return await this.dishSnapshotRepository.save(dishSnapshot);
  }

  async remove(id: number): Promise<void> {
    const result = await this.dishSnapshotRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`DishSnapshot với ID ${id} không tồn tại`);
    }
  }
}
