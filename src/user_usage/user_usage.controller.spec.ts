import { Test, TestingModule } from '@nestjs/testing';
import { UserUsageController } from './user_usage.controller';
import { UserUsageService } from './user_usage.service';

describe('UserUsageController', () => {
  let controller: UserUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserUsageController],
      providers: [UserUsageService],
    }).compile();

    controller = module.get<UserUsageController>(UserUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
