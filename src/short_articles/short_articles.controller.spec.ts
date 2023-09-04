import { Test, TestingModule } from '@nestjs/testing';
import { ShortArticlesController } from './short_articles.controller';
import { ShortArticlesService } from './short_articles.service';

describe('ShortArticlesController', () => {
  let controller: ShortArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortArticlesController],
      providers: [ShortArticlesService],
    }).compile();

    controller = module.get<ShortArticlesController>(ShortArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
