import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';
import { OpenAIModule } from '@platohq/nestjs-openai';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  
  @UseGuards(AuthGuard)
  @Post('create-aricle')
  async create_project(@Req() req, @Res() res, @Body() body) {
    await this.articleService.create_aricle(req.user.sub, body.project_id, body.title, body.language, body.word_length, body.intent, body.article_heading)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }
  
  @UseGuards(AuthGuard)
  @Post('get-aricle')
  async get_aricle(@Req() req, @Res() res, @Body() body) {
    await this.articleService.get_aricle(req.user.sub, body.project_id, body.article_id)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @UseGuards(AuthGuard)
  @Post('update-article')
  async update_article(@Req() req, @Res() res, @Body() body) {
    await this.articleService.update_article(body.article_id, body.title)
      .then(response => {
        return res.status(200).json({
          status: 200,
          response,
        });
      })
      .catch(error => {
        // Handle error
        return res.status(500).json({
          status: 500,
          code: 'error',
          message: 'An error occurred.',
        });
      });
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
