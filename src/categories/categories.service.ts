import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly jwtService: JwtService,

  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async create_category(userId: number, projectId: number, title: string, parentId: number) {

    // let filterProjectData = await this.categoryRepository.findOne({ where: { title: title, project_id: projectId } });

    // if (filterProjectData !== null && filterProjectData.title === title) {
    //   return {
    //     status: 200,
    //     ok: true,
    //     message: "category already exist"
    //   };
    // }
    // else {
    //   const category = new Category();
    //   category.user_id = userId;
    //   category.project_id = projectId;
    //   category.parent_category_id = parentId;
    //   category.title = title;

    //   await this.categoryRepository.save(category);

    //   return {
    //     status: 200,
    //     ok: true,
    //     message: "category added successfully"
    //   };
    // }
  }

  async edit_category(id: number) {

    let getCategory =  await this.categoryRepository.find({ where: { id: id } });

    return {
      status: 200,
      ok: true,
      result: getCategory
    };
  }

  async get_category(projectId:number ) {

    // let getCategory =  await this.categoryRepository.find({ where: { project_id: projectId } });

    return {
      status: 200,
      ok: true,
      // result: getCategory
    };
  }

  async soft_delete_category(id: number) {

    const date = new Date();
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    // await this.categoryRepository.update(id, { deleted_at: time });

    return {
      status: 200,
      ok: true,
      message: "Project deleted successfully"
    };
  }

  async update_category(id: number, title: string, parentId: number) {

    // await this.categoryRepository.update(id, { title: title, parent_category_id: parentId });

    return {
      status: 200,
      ok: true,
      message: "category updated successfully"
    };
  }
}
