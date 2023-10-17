import { Controller, Get, Req, Res, UseGuards, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserPlanDto } from './dto/create-user_plan.dto';
import { UpdateUserPlanDto } from './dto/update-user_plan.dto';
import { UserPlansService } from './user_plans.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auths/auths.guard';

@Controller('user-plans')
export class UserPlansController {
  constructor(
    private readonly userPlansService: UserPlansService,
    private jwtService: JwtService
  ) { }


  
  @UseGuards(AuthGuard)
  @Get('user-usage')
  async user_usage(@Req() req, @Res() res) {
    await this.userPlansService.user_usage(req.user.sub)
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
  @Get('getUserPlan')
  async getUserPlan(@Req() req, @Res() res) {
    await this.userPlansService.getUserPlan(req.user.sub)
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
  create(@Body() createUserPlanDto: CreateUserPlanDto) {
    return this.userPlansService.create(createUserPlanDto);
  }

  @Get()
  findAll() {
    return this.userPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPlansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPlanDto: UpdateUserPlanDto) {
    return this.userPlansService.update(+id, updateUserPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPlansService.remove(+id);
  }

}
