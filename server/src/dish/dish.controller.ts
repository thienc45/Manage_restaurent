import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import { Role } from "src/common/constants/typecontants";
import { JwtAuthGuard } from "src/role/auth.guard";
import { Roles } from "src/role/roles.decorator";
import { RolesGuard } from "src/role/roles.guard";
import {
  CreateDishBodyType,
  DishListResType,
  DishListWithPaginationQueryType,
  DishListWithPaginationResType,
  DishParamsType,
  DishResType,
  UpdateDishBodyType,
} from "src/schemaValidations/dish.schema";
import { DishService } from "./dish.service";

@Controller("dishes")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  // GET /dishes - Lấy danh sách món ăn
  @Get()
  async getDishList(): Promise<DishListResType> {
    const dishes = await this.dishService.getDishList();
    const formattedDishes = dishes.map((dish) => ({
      ...dish,
      status: dish.status as "Available" | "Unavailable" | "Hidden",
    }));
    return {
      data: formattedDishes,
      message: "Lấy danh sách món ăn thành công!",
    };
  }

  // GET /dishes/pagination - Lấy danh sách món ăn có phân trang
  @Get("pagination")
  @Roles("Owner")
  async getDishListWithPagination(
    @Query() query: DishListWithPaginationQueryType
  ): Promise<DishListWithPaginationResType> {
    const { page, limit } = query;
    const data = await this.dishService.getDishListWithPagination(page, limit);
    return {
      data: {
        items: data.items.map((dish) => ({
          ...dish,
          status: dish.status as "Available" | "Unavailable" | "Hidden",
        })),
        totalItem: data.totalItem,
        totalPage: data.totalPage,
        page,
        limit,
      },
      message: "Lấy danh sách món ăn thành công!",
    };
  }

  // GET /dishes/:id - Lấy chi tiết món ăn theo id
  @Get("abc/:id")
  async getDishDetail(@Param() params: DishParamsType): Promise<DishResType> {
    const dish = await this.dishService.getDishDetail(params.id);
    const formattedDish = {
      ...dish,
      status: dish.status as "Available" | "Unavailable" | "Hidden",
    };
    return {
      data: formattedDish,
      message: "Lấy thông tin món ăn thành công!",
    };
  }

  // POST /dishes - Tạo mới món ăn
  @Post()
  async createDish(@Body() body: CreateDishBodyType): Promise<DishResType> {
    const dish = await this.dishService.createDish(body);
    const formattedDish = {
      ...dish,
      status: dish.status as "Available" | "Unavailable" | "Hidden",
    };
    return {
      data: formattedDish,
      message: "Tạo món ăn thành công!",
    };
  }

  // PUT /dishes/:id - Cập nhật món ăn theo id
  @Put(":id")
  async updateDish(
    @Param() params: DishParamsType,
    @Body() body: UpdateDishBodyType
  ): Promise<DishResType> {
    const dish = await this.dishService.updateDish(params.id, body);
    const formattedDish = {
      ...dish,
      status: dish.status as "Available" | "Unavailable" | "Hidden",
    };
    return {
      data: formattedDish,
      message: "Cập nhật món ăn thành công!",
    };
  }

  // DELETE /dishes/:id - Xóa món ăn theo id
  @Delete(":id")
  async deleteDish(@Param() params: DishParamsType): Promise<DishResType> {
    const result = await this.dishService.deleteDish(params.id);
    const formattedResult = {
      ...result,
      status: result.status as "Available" | "Unavailable" | "Hidden",
    };
    return {
      data: formattedResult,
      message: "Xóa món ăn thành công!",
    };
  }

  @Get("owner-dashboard")
  @Roles(Role.Owner)
  getOwnerDashboard() {
    return "Owner Dashboard Data";
  }

  @Get("employee-dashboard")
  @Roles(Role.Employee)
  getEmployeeDashboard() {
    return "Employee Dashboard Data";
  }
}
