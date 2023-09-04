import { Injectable } from '@nestjs/common';
import { CreateOauthAccessTokenDto } from './dto/create-oauth_access_token.dto';
import { UpdateOauthAccessTokenDto } from './dto/update-oauth_access_token.dto';

@Injectable()
export class OauthAccessTokensService {
  create(createOauthAccessTokenDto: CreateOauthAccessTokenDto) {
    return 'This action adds a new oauthAccessToken';
  }

  findAll() {
    return `This action returns all oauthAccessTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauthAccessToken`;
  }

  update(id: number, updateOauthAccessTokenDto: UpdateOauthAccessTokenDto) {
    return `This action updates a #${id} oauthAccessToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauthAccessToken`;
  }
}
