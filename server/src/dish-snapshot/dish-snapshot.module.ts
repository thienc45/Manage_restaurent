import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishSnapshotController } from "./dish-snapshot.controller";
import { DishSnapshot } from "./dish-snapshot.entity/dishnnapshot.entity";
import { DishSnapshotService } from "./dish-snapshot.service";

@Module({
  imports: [TypeOrmModule.forFeature([DishSnapshot])],
  controllers: [DishSnapshotController],
  providers: [DishSnapshotService],
})
export class DishSnapshotModule {}
