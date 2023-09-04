import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShortArticlesService } from './short_articles.service';
import { CreateShortArticleDto } from './dto/create-short_article.dto';
import { UpdateShortArticleDto } from './dto/update-short_article.dto';

@Controller('short-articles')
export class ShortArticlesController {
  constructor(private readonly shortArticlesService: ShortArticlesService) {}

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
