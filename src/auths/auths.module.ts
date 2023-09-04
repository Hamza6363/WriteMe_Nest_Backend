import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { OauthAccessToken } from '../oauth_access_tokens/entities/oauth_access_token.entity';
import { UserPlan } from '../user_plans/entities/user_plan.entity';
import { UserUsage } from '../user_usage/entities/user_usage.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OauthAccessToken, UserPlan, UserUsage, Plan, Project]),
  ],
  controllers: [AuthsController],
  providers: [AuthsService, JwtService, UsersService, UsersModule, Plan, Project],
})
export class AuthsModule {}
