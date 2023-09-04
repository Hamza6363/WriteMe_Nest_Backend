import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
