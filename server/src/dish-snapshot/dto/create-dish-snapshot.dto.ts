export class CreateDishSnapshotDto {
  name: string;
  price: number;
  description: string;
  image: string;
  // Nếu không truyền status, sẽ dùng mặc định "Available"
  status?: string;
  // ID của Dish liên quan (nếu có)
  dishId?: number;
}
