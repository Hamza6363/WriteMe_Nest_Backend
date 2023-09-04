import { Test, TestingModule } from '@nestjs/testing';
import { UserPlansService } from './user_plans.service';

describe('UserPlansService', () => {
  let service: UserPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPlansService],
    }).compile();

    service = module.get<UserPlansService>(UserPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
