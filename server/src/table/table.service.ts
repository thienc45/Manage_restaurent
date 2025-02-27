import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Guest } from "src/guest/guest.entity/guest.entity";
import { DataSource, Repository } from "typeorm";
import { EntityError } from "../utils/errors";
import { CreateTableBodyType } from "./dto/create-table.dto";
import { UpdateTableBodyType } from "./dto/update-table.dto";
import { Table } from "./table.entity/table.entity";

@Injectable()
@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    private dataSource: DataSource
  ) {}

  async getTableList() {
    return this.tableRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getTableDetail(number: number) {
    const table = await this.tableRepository.findOne({
      where: { number },
    });

    if (!table) {
      throw new NotFoundException("Table not found");
    }
    return table;
  }

  async createTable(data: CreateTableBodyType) {
    const token = randomUUID();
    const newTable = this.tableRepository.create({
      ...data,
      token,
    });

    try {
      return await this.tableRepository.save(newTable);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new EntityError([
          {
            message: "Số bàn này đã tồn tại",
            field: "number",
          },
        ]);
      }
      throw error;
    }
  }

  async updateTable(number: number, data: UpdateTableBodyType) {
    if (data.changeToken) {
      const token = randomUUID();
      return this.dataSource.transaction(async (transactionManager) => {
        await transactionManager.update(
          Table,
          { number },
          {
            status: data.status,
            capacity: data.capacity,
            token,
          }
        );

        await transactionManager
          .createQueryBuilder()
          .update(Guest)
          .set({
            refreshToken: null,
            refreshTokenExpiresAt: null,
          })
          .where("tableNumber = :number", { number })
          .execute();

        return this.tableRepository.findOneBy({ number });
      });
    }

    await this.tableRepository.update(
      { number },
      {
        status: data.status,
        capacity: data.capacity,
      }
    );
    return this.tableRepository.findOneBy({ number });
  }

  async deleteTable(number: number) {
    await this.tableRepository.delete({ number });
    return { message: "Xóa bàn thành công" };
  }
}
