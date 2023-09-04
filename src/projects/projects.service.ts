import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()

export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly jwtService: JwtService,
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,

  ) { }

  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async create_project(id: number, title: string, projectKeyword: string[]) {

    let filterProjectData = await this.projectRepository.findOne({ where: { title: title } });

    if (filterProjectData !== null && filterProjectData.title === title) {
      return {
        status: 200,
        ok: true,
        message: "Project already exist"
      };
    }
    else {
      const project = new Project();
      project.user_id = id;
      project.title = title;

      let getCreatedData = await this.projectRepository.save(project);
      let getProjectId = getCreatedData.id;

      const keyword = new Keyword();
      keyword.user_id = id;
      keyword.project_id = getProjectId;


      projectKeyword.map(async item => {
        keyword.keyword = item;

        await this.keywordRepository.save(keyword);
      })

      return {
        status: 200,
        ok: true,
        message: "Porject added successfully"
      };

    }
  }

  async edit_project(id: number) {

    let getProject = await this.projectRepository.find({ where: { id: id } });
    let getKeyword = await this.keywordRepository.find({ where: { project_id: id } });

    return {
      status: 200,
      ok: true,
      result: {
        project: getProject,
        keyword: getKeyword
      }
    };
  }

  async get_project() {
    let getProjects = await this.projectRepository.find({ where: { deletedAt: null } });

    return {
      status: 200,
      ok: true,
      data: getProjects
    };
  }

  async soft_delete_project(id: number) {

    const date = new Date();
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    await this.projectRepository.update(id, { deletedAt: time });

    return {
      status: 200,
      ok: true,
      message: "Project deleted successfully"
    };
  }


  async update_project(userId: number, id: number, projectTitle: string, projectKeyword: string[]) {

    await this.projectRepository.update(id, { title: projectTitle });
    let getKeyword = await this.keywordRepository.find({ where: { project_id: id } });

    let DBkeywords = [];

    getKeyword.map(async item => {
      DBkeywords.push(item.keyword);
    })

    const keyword = new Keyword();
    keyword.user_id = userId;
    keyword.project_id = id;

    // addition
    projectKeyword.map(async item => {
      if (DBkeywords.includes(item) !== true) {
        keyword.keyword = item;
        await this.keywordRepository.save(keyword);
      }
    })

    // update
    getKeyword.map(async item => {

      if (projectKeyword.includes(item.keyword) !== true) {

        const date = new Date();
        let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

        // await this.keywordRepository.update(item.id, { deleted_at: time });
      }
    })

    return {
      status: 200,
      ok: true,
      // result: getProject
    };
  }
}
