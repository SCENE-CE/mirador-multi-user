import { Logger, Module } from '@nestjs/common';
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
import { LinkUserGroupModule } from './link-user-group/link-user-group.module';
import { ManifestModule } from './manifest/manifest.module';
import dbConfiguration from './config/db.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailServerModule } from './email/email.module';
import { CustomLogger } from './Logger/CustomLogger.service';
import { LinkManifestGroupModule } from "./link-manifest-group/link-manifest-group.module";

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
    MailerModule.forRoot({
      transport: {
        host: String(process.env.SMTP_DOMAIN),
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        socketTimeout: 5000,
        connectionTimeout: 5000,
      },
      template: {
        dir: __dirname + './template/notification',
        adapter: new PugAdapter({ inlineCssEnabled: true }),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
    ProjectModule,
    CaslModule,
    MediaModule,
    UserGroupModule,
    LinkGroupProjectModule,
    LinkMediaGroupModule,
    LinkUserGroupModule,
    LinkManifestGroupModule,
    ManifestModule,
    EmailServerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Logger,
      useClass: CustomLogger,
    },
  ],
})
export class AppModule {}