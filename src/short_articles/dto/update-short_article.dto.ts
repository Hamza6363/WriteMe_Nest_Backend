import { PartialType } from '@nestjs/mapped-types';
import { CreateShortArticleDto } from './create-short_article.dto';

export class UpdateShortArticleDto extends PartialType(CreateShortArticleDto) {}
