import { Module } from '@nestjs/common';
import { OauthAccessTokensService } from './oauth_access_tokens.service';
import { OauthAccessTokensController } from './oauth_access_tokens.controller';

@Module({
  controllers: [OauthAccessTokensController],
  providers: [OauthAccessTokensService],
})
export class OauthAccessTokensModule {}
