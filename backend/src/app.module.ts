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
import dbConfiguration from './config/db.config';

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
    UsersModule,
    AuthModule,
    ProjectModule,
    CaslModule,
    MediaModule,
    UserGroupModule,
    LinkGroupProjectModule,
    LinkMediaGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
