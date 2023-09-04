import { Test, TestingModule } from '@nestjs/testing';
import { OauthAccessTokensService } from './oauth_access_tokens.service';

describe('OauthAccessTokensService', () => {
  let service: OauthAccessTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthAccessTokensService],
    }).compile();

    service = module.get<OauthAccessTokensService>(OauthAccessTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
