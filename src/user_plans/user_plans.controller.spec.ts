import { Test, TestingModule } from '@nestjs/testing';
import { UserPlansController } from './user_plans.controller';
import { UserPlansService } from './user_plans.service';

describe('UserPlansController', () => {
  let controller: UserPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPlansController],
      providers: [UserPlansService],
    }).compile();

    controller = module.get<UserPlansController>(UserPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
