import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auths/auths.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auths/entities/auth.entity'
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { OauthAccessTokensModule } from './oauth_access_tokens/oauth_access_tokens.module';
import { UserPlansModule } from './user_plans/user_plans.module';
import { KeywordsModule } from './keywords/keywords.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticleModule } from './article/article.module';
import { ShortArticlesModule } from './short_articles/short_articles.module';
import { TempArticlesModule } from './temp_articles/temp_articles.module';
import { PlansModule } from './plans/plans.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserUsageModule } from './user_usage/user_usage.module';

@Module({
  controllers: [AppController],
  providers: [AppService],

  imports: [
    ConfigModule.forRoot(),
    AuthsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([Auth]),
    UsersModule,
    ProjectsModule,
    OauthAccessTokensModule,
    UserPlansModule,
    KeywordsModule,
    CategoriesModule,
    ArticleModule,
    ShortArticlesModule,
    TempArticlesModule,
    PlansModule,
    ChatsModule,
    NotificationsModule,
    UserUsageModule,
  ],
})

export class AppModule {
}
