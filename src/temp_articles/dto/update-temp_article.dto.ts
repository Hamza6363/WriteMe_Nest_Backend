import { PartialType } from '@nestjs/mapped-types';
import { CreateTempArticleDto } from './create-temp_article.dto';

export class UpdateTempArticleDto extends PartialType(CreateTempArticleDto) {}
