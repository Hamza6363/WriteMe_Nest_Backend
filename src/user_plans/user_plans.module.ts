import { Module } from '@nestjs/common';
import { UserPlansService } from './user_plans.service';
import { UserPlansController } from './user_plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserPlan } from './entities/user_plan.entity';
import { AuthGuard } from 'src/auths/auths.guard';
import { JwtService } from '@nestjs/jwt/dist';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserPlan]),
  ],
  controllers: [UserPlansController],
  providers: [AuthGuard, UserPlansService, JwtService],
  exports: [JwtService],
})
export class UserPlansModule {}
