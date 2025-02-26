import { Test, TestingModule } from '@nestjs/testing';
import { DishSnapshotController } from './dish-snapshot.controller';

describe('DishSnapshotController', () => {
  let controller: DishSnapshotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishSnapshotController],
    }).compile();

    controller = module.get<DishSnapshotController>(DishSnapshotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
