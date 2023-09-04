import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OauthAccessTokensService } from './oauth_access_tokens.service';
import { CreateOauthAccessTokenDto } from './dto/create-oauth_access_token.dto';
import { UpdateOauthAccessTokenDto } from './dto/update-oauth_access_token.dto';

@Controller('oauth-access-tokens')
export class OauthAccessTokensController {
  constructor(private readonly oauthAccessTokensService: OauthAccessTokensService) {}

  @Post()
  create(@Body() createOauthAccessTokenDto: CreateOauthAccessTokenDto) {
    return this.oauthAccessTokensService.create(createOauthAccessTokenDto);
  }

  @Get()
  findAll() {
    return this.oauthAccessTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauthAccessTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOauthAccessTokenDto: UpdateOauthAccessTokenDto) {
    return this.oauthAccessTokensService.update(+id, updateOauthAccessTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauthAccessTokensService.remove(+id);
  }
}
