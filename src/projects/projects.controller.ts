import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private jwtService: JwtService
    ) {}


  @UseGuards(AuthGuard)
  @Post('create-project')
  async create_project(@Req() req, @Res() res, @Body() body) {
    await this.projectsService.create_project(req.user.sub, body.title, body.keyword)
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
  @Post('edit-project')
  async edit_project(@Req() req, @Res() res, @Body() body) {
    await this.projectsService.edit_project(body.project_id)
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
  @Get('get-project')
  async get_project(@Req() req, @Res() res, @Body() body) {
    await this.projectsService.get_project(req.user.sub)
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
  @Post('delete-project')
  async delete_project(@Req() req, @Res() res, @Body() body) {
    await this.projectsService.soft_delete_project(body.project_id)
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
  @Post('update-project')
  async update_project(@Req() req, @Res() res, @Body() body) {
    await this.projectsService.update_project(req.user.sub, body.id, body.title, body.keyword)
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
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
