import { Test, TestingModule } from '@nestjs/testing';
import { TempArticlesController } from './temp_articles.controller';
import { TempArticlesService } from './temp_articles.service';

describe('TempArticlesController', () => {
  let controller: TempArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempArticlesController],
      providers: [TempArticlesService],
    }).compile();

    controller = module.get<TempArticlesController>(TempArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
