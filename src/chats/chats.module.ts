import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { Chat } from './entities/chat.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPlan } from 'src/user_plans/entities/user_plan.entity';
import { UserUsage } from 'src/user_usage/entities/user_usage.entity';
import { Plan } from 'src/plans/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, UserPlan, UserUsage, Plan])],
  controllers: [ChatsController],
  providers: [ChatsService, JwtService, UserPlan, UserUsage, Plan],
})
export class ChatsModule {}
