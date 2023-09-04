import { Test, TestingModule } from '@nestjs/testing';
import { TempArticlesService } from './temp_articles.service';

describe('TempArticlesService', () => {
  let service: TempArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempArticlesService],
    }).compile();

    service = module.get<TempArticlesService>(TempArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
