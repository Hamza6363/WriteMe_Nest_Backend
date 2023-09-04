import { Test, TestingModule } from '@nestjs/testing';
import { UserUsageService } from './user_usage.service';

describe('UserUsageService', () => {
  let service: UserUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUsageService],
    }).compile();

    service = module.get<UserUsageService>(UserUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
