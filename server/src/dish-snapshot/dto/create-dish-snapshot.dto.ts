export class CreateDishSnapshotDto {
  name: string;
  price: number;
  description: string;
  image: string;
  status?: string;
  dishId?: number;
}
