import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShortArticlesService } from './short_articles.service';
import { CreateShortArticleDto } from './dto/create-short_article.dto';
import { UpdateShortArticleDto } from './dto/update-short_article.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';

@Controller('short-articles')
export class ShortArticlesController {
  constructor(private readonly shortArticlesService: ShortArticlesService) {}

  @UseGuards(AuthGuard)
  @Post('short-article-save')
  async short_article_save(@Req() req, @Res() res, @Body() body) {
    
    await this.shortArticlesService.short_article_save(req.user.sub, body.article)
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
  @Get('get-short-article')
  async short_article_get(@Req() req, @Res() res, @Body() body) {
    
    await this.shortArticlesService.short_article_get(req.user.sub)
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
  create(@Body() createShortArticleDto: CreateShortArticleDto) {
    return this.shortArticlesService.create(createShortArticleDto);
  }

  @Get()
  findAll() {
    return this.shortArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortArticlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShortArticleDto: UpdateShortArticleDto) {
    return this.shortArticlesService.update(+id, updateShortArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortArticlesService.remove(+id);
  }
}
