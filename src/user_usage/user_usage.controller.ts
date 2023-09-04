import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserUsageService } from './user_usage.service';
import { CreateUserUsageDto } from './dto/create-user_usage.dto';
import { UpdateUserUsageDto } from './dto/update-user_usage.dto';

@Controller('user-usage')
export class UserUsageController {
  constructor(private readonly userUsageService: UserUsageService) {}

  @Post()
  create(@Body() createUserUsageDto: CreateUserUsageDto) {
    return this.userUsageService.create(createUserUsageDto);
  }

  @Get()
  findAll() {
    return this.userUsageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userUsageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserUsageDto: UpdateUserUsageDto) {
    return this.userUsageService.update(+id, updateUserUsageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userUsageService.remove(+id);
  }
}
