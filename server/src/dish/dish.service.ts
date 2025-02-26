import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDishBodyType } from "./dish.dto/dish.create";
import { UpdateDishBodyType } from "./dish.dto/dish.update";
import { Dish } from "./dish.entity/dish.entity";

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>
  ) {}

  // Lấy danh sách dish, sắp xếp theo createdAt giảm dần
  async getDishList(): Promise<Dish[]> {
    return await this.dishRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  // Lấy danh sách dish với phân trang
  async getDishListWithPagination(
    page: number,
    limit: number
  ): Promise<{
    items: Dish[];
    totalItem: number;
    page: number;
    limit: number;
    totalPage: number;
  }> {
    // Sử dụng findAndCount để lấy dữ liệu và đếm tổng số bản ghi
    const [data, totalItem] = await this.dishRepository.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPage = Math.ceil(totalItem / limit);

    return {
      items: data,
      totalItem,
      page,
      limit,
      totalPage,
    };
  }

  // Lấy chi tiết 1 dish theo id
  async getDishDetail(id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });
    if (!dish) {
      throw new NotFoundException("Dish không tồn tại");
    }
    return dish;
  }

  // Tạo mới 1 dish
  async createDish(data: CreateDishBodyType): Promise<Dish> {
    const newDish = this.dishRepository.create(data);
    return await this.dishRepository.save(newDish);
  }

  // Cập nhật dish theo id
  async updateDish(id: number, data: UpdateDishBodyType): Promise<Dish> {
    // Kiểm tra xem dish có tồn tại hay không
    const dish = await this.getDishDetail(id);
    const updatedDish = this.dishRepository.merge(dish, data);
    return await this.dishRepository.save(updatedDish);
  }

  // Xóa dish theo id và trả về dish đã bị xóa
  async deleteDish(id: number): Promise<Dish> {
    const dish = await this.getDishDetail(id);
    await this.dishRepository.remove(dish);
    return dish;
  }
}
