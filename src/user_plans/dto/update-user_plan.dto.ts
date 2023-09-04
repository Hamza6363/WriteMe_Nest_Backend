import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPlanDto } from './create-user_plan.dto';

export class UpdateUserPlanDto extends PartialType(CreateUserPlanDto) {}
