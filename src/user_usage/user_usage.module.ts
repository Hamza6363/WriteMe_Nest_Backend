import { Module } from '@nestjs/common';
import { UserUsageService } from './user_usage.service';
import { UserUsageController } from './user_usage.controller';

@Module({
  controllers: [UserUsageController],
  providers: [UserUsageService],
})
export class UserUsageModule {}
