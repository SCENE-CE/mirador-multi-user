import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/config/.env.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      cache: false,
    }),
    UsersModule,
    AuthModule,
    ProjectModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
