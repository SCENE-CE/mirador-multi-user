import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { CaslModule } from './casl/casl.module';
import { MediaModule } from './media/media.module';
import { UserGroupModule } from './user-group/user-group.module';
import { LinkGroupProjectModule } from './link-group-project/link-group-project.module';
import { LinkMediaGroupModule } from './link-media-group/link-media-group.module';
import { GroupProjectModule } from './group-project/group-project.module';
import { GroupMediaModule } from './group-media/group-media.module';
import { LinkUserGroupModule } from './link-user-group/link-user-group.module';
import { ManifestModule } from './manifest/manifest.module';
import { GroupManifestModule } from './group-manifest/group-manifest.module';
import dbConfiguration from './config/db.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/config/.env.dev',
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: process.env.SMT_DOMAIN,
          port: 25,
          secure: false,
          auth: {
            user: process.env.SMT_USER,
            pass: process.env.SMT_PASSWORD,
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMT_USER')}>`,
        },
      }),
    }),
    UsersModule,
    AuthModule,
    ProjectModule,
    CaslModule,
    MediaModule,
    UserGroupModule,
    LinkGroupProjectModule,
    LinkMediaGroupModule,
    GroupProjectModule,
    GroupMediaModule,
    LinkUserGroupModule,
    ManifestModule,
    GroupManifestModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
