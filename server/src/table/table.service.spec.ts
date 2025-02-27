import { Test, TestingModule } from "@nestjs/testing";
import { TablesService } from "./table.service";

describe("TableService", () => {
  let service: TablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TablesService],
    }).compile();

    service = module.get<TablesService>(TablesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
