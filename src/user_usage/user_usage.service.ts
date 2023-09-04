import { Injectable } from '@nestjs/common';
import { CreateUserUsageDto } from './dto/create-user_usage.dto';
import { UpdateUserUsageDto } from './dto/update-user_usage.dto';

@Injectable()
export class UserUsageService {
  create(createUserUsageDto: CreateUserUsageDto) {
    return 'This action adds a new userUsage';
  }

  findAll() {
    return `This action returns all userUsage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userUsage`;
  }

  update(id: number, updateUserUsageDto: UpdateUserUsageDto) {
    return `This action updates a #${id} userUsage`;
  }

  remove(id: number) {
    return `This action removes a #${id} userUsage`;
  }
}
