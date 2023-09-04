import { Injectable } from '@nestjs/common';
import { CreateTempArticleDto } from './dto/create-temp_article.dto';
import { UpdateTempArticleDto } from './dto/update-temp_article.dto';

@Injectable()
export class TempArticlesService {
  create(createTempArticleDto: CreateTempArticleDto) {
    return 'This action adds a new tempArticle';
  }

  findAll() {
    return `This action returns all tempArticles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tempArticle`;
  }

  update(id: number, updateTempArticleDto: UpdateTempArticleDto) {
    return `This action updates a #${id} tempArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} tempArticle`;
  }
}
