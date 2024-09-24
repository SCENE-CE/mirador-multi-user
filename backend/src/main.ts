import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();


  const config = new DocumentBuilder()
    .setTitle(Process.env.SWAGGER_TITLE)
    .setDescription(Process.env.SWAGGER_DESCRIPTION)
    .setVersion(Process.env.SWAGGER_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(Process.env.SWAGGER_RELATIVE_PATH, app, document);

  await app.listen(Process.env.BACKEND_PORT);
}
bootstrap();
