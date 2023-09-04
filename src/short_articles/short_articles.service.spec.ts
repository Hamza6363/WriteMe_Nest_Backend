import { Test, TestingModule } from '@nestjs/testing';
import { ShortArticlesService } from './short_articles.service';

describe('ShortArticlesService', () => {
  let service: ShortArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortArticlesService],
    }).compile();

    service = module.get<ShortArticlesService>(ShortArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
