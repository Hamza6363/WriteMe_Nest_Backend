import { PartialType } from '@nestjs/mapped-types';
import { CreateOauthAccessTokenDto } from './create-oauth_access_token.dto';

export class UpdateOauthAccessTokenDto extends PartialType(CreateOauthAccessTokenDto) {}
