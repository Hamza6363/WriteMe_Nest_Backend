import { PartialType } from '@nestjs/mapped-types';
import { CreateUserUsageDto } from './create-user_usage.dto';

export class UpdateUserUsageDto extends PartialType(CreateUserUsageDto) {}
