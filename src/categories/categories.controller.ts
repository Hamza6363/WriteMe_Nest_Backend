import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private jwtService: JwtService
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-category')
  async create_project(@Req() req, @Res() res, @Body() body) {
    await this.categoriesService.create_category(req.user.sub, body.project_id , body.title, body.parent_id)
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
  @Post('edit-category')
  async edit_category(@Req() req, @Res() res, @Body() body) {
    await this.categoriesService.edit_category(body.id)
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
  @Post('update-category')
  async update_category(@Req() req, @Res() res, @Body() body) {
    await this.categoriesService.update_category(body.id , body.title, body.parent_id)
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
  @Post('delete-category')
  async delete_category(@Req() req, @Res() res, @Body() body) {
    await this.categoriesService.soft_delete_category(body.id)
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
  @Post('get-category')
  async get_category(@Req() req, @Res() res, @Body() body) {
    await this.categoriesService.get_category(body.project_id)
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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
