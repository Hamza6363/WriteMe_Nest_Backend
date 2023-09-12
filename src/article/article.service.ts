import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly jwtService: JwtService,

  ) { }

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  async create_aricle(userId: number, projectId: number, title: string, language: string, wordLength: number, intent: string, articleHeading: string) {

    const article = new Article();
    article.user_id = userId;
    article.project_id = projectId;
    article.title = title;
    article.language = language;
    article.words_length = wordLength;
    article.intent = intent;
    article.article_heading = JSON.stringify(articleHeading);

    let getDataFromArticle = await this.articleRepository.findOne({ where: { title: title, project_id: projectId, user_id: userId } })

    if (getDataFromArticle == null) {
      await this.articleRepository.save(article);

      return {
        status: 200,
        ok: true,
        message: "Article added successfully"
      };
    }
    else {
      return {
        status: 200,
        ok: false,
        message: "Article already exist"
      };
    }
  }

  async get_aricle(userId: number, projectId: number) {

    let getArticles = await this.articleRepository.find({ where: { user_id: userId, project_id: projectId } });

    return {
      status: 200,
      ok: true,
      result: getArticles
    };
  }

  async get_edit_aricle(userId: number, project_id: number, articleId: number) {

    let getArticles = await this.articleRepository.find({ where: { user_id: userId, project_id: project_id, id: articleId } });

    return {
      status: 200,
      ok: true,
      result: getArticles
    };
  }

  async update_article(id: number, title: string) {

    await this.articleRepository.update(id, { title: title });
    return {
      status: 200,
      ok: true,
      message: "Article updated successfully"
    };
  }

  async delete_article(userId: number, project_id: number, id: number) {

    const date = new Date();
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    await this.articleRepository.update(id, { deletedAt: time });

    return {
      status: 200,
      ok: true,
      message: "Article deleted successfully"
    };
  }

  async update_article_generator(userId: number, project_id: number, id: number, article: string ){
    let getArticleData = await this.articleRepository.update(id, { article: article });
    console.log(getArticleData);
  }
}

