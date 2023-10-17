import { Module } from '@nestjs/common';
import { ShortArticlesService } from './short_articles.service';
import { ShortArticlesController } from './short_articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortArticle } from './entities/short_article.entity';
import { AuthGuard } from 'src/auths/auths.guard';
import { JwtService } from '@nestjs/jwt/dist';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortArticle]),
  ],
  controllers: [ShortArticlesController],
  providers: [ShortArticlesService, JwtService, AuthGuard],
  exports: [JwtService],
})
export class ShortArticlesModule { }
