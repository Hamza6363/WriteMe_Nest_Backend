import { Injectable } from '@nestjs/common';
import { CreateShortArticleDto } from './dto/create-short_article.dto';
import { UpdateShortArticleDto } from './dto/update-short_article.dto';

@Injectable()
export class ShortArticlesService {
  create(createShortArticleDto: CreateShortArticleDto) {
    return 'This action adds a new shortArticle';
  }

  findAll() {
    return `This action returns all shortArticles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shortArticle`;
  }

  update(id: number, updateShortArticleDto: UpdateShortArticleDto) {
    return `This action updates a #${id} shortArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} shortArticle`;
  }
}
