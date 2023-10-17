import { Injectable } from '@nestjs/common';
import { CreateShortArticleDto } from './dto/create-short_article.dto';
import { UpdateShortArticleDto } from './dto/update-short_article.dto';
import { ShortArticle } from './entities/short_article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShortArticlesService {

  constructor(
    @InjectRepository(ShortArticle)
    private readonly shortArticleRepository: Repository<ShortArticle>,
  ) { }

  async short_article_save(user_id, articleText) {
    let getArticles = await this.shortArticleRepository.find({ where: { user_id } });
    let articleData = [articleText];
    

    if (getArticles.length <= 0) {
      const shortArticle = new ShortArticle();
      shortArticle.user_id = user_id;
      shortArticle.article = JSON.stringify( articleData );
      shortArticle.current_article = shortArticle.article;

      await this.shortArticleRepository.save(shortArticle);
      
    }
    else{
      let id = getArticles[0].id;

      let currentArticle = JSON.stringify( articleData );

      let updateArticle = JSON.parse(getArticles[0].article);
      updateArticle.push(articleText);

     return await this.shortArticleRepository.update(id, { current_article: currentArticle, article:  JSON.stringify(updateArticle)})
    }
  }

  async short_article_get (user_id){
    let getShortArticle = await this.shortArticleRepository.find({ where: { user_id } });
    

    return {
      ok : true,
      status: 200,
      data: getShortArticle
    }
  }

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
