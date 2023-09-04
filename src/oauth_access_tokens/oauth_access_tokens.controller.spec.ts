import { Test, TestingModule } from '@nestjs/testing';
import { OauthAccessTokensController } from './oauth_access_tokens.controller';
import { OauthAccessTokensService } from './oauth_access_tokens.service';

describe('OauthAccessTokensController', () => {
  let controller: OauthAccessTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthAccessTokensController],
      providers: [OauthAccessTokensService],
    }).compile();

    controller = module.get<OauthAccessTokensController>(OauthAccessTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
