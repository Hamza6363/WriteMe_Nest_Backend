import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { AuthGuard } from 'src/auths/auths.guard';
import { JwtService } from '@nestjs/jwt/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenAIModule } from '@platohq/nestjs-openai';


@Module({

  imports: [
    TypeOrmModule.forFeature([Article]),
    OpenAIModule.register({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, JwtService, AuthGuard],
  exports: [JwtService],
})




export class ArticleModule { }
