import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { OauthAccessToken } from '../oauth_access_tokens/entities/oauth_access_token.entity';
import { UserPlan } from 'src/user_plans/entities/user_plan.entity';
import { UserUsage } from 'src/user_usage/entities/user_usage.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OauthAccessToken, UserPlan, UserUsage, Plan, Project]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, UserPlan, UserUsage, Plan, Project],
  exports: [JwtService],
})
export class UsersModule {}
