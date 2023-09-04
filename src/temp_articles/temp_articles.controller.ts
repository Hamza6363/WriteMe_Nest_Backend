import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TempArticlesService } from './temp_articles.service';
import { CreateTempArticleDto } from './dto/create-temp_article.dto';
import { UpdateTempArticleDto } from './dto/update-temp_article.dto';

@Controller('temp-articles')
export class TempArticlesController {
  constructor(private readonly tempArticlesService: TempArticlesService) {}

  @Post()
  create(@Body() createTempArticleDto: CreateTempArticleDto) {
    return this.tempArticlesService.create(createTempArticleDto);
  }

  @Get()
  findAll() {
    return this.tempArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tempArticlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTempArticleDto: UpdateTempArticleDto) {
    return this.tempArticlesService.update(+id, updateTempArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tempArticlesService.remove(+id);
  }
}
