import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { AuthGuard } from 'src/auths/auths.guard';
import { JwtService } from '@nestjs/jwt/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsService } from 'src/keywords/keywords.service';
import { Keyword } from '../keywords/entities/keyword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Keyword]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtService, AuthGuard, KeywordsService],
  exports: [JwtService],
})
export class ProjectsModule {}



