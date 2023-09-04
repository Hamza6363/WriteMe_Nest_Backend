import { Module } from '@nestjs/common';
import { TempArticlesService } from './temp_articles.service';
import { TempArticlesController } from './temp_articles.controller';

@Module({
  controllers: [TempArticlesController],
  providers: [TempArticlesService],
})
export class TempArticlesModule {}
