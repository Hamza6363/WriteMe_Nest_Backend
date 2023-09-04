import { Module } from '@nestjs/common';
import { ShortArticlesService } from './short_articles.service';
import { ShortArticlesController } from './short_articles.controller';

@Module({
  controllers: [ShortArticlesController],
  providers: [ShortArticlesService],
})
export class ShortArticlesModule {}
