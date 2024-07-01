import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

console.log('dbName', process.env.DB_DATABASE);
console.log('dbhost', process.env.DB_HOST);
console.log('dbPort', process.env.DB_PORT);
console.log('dbusername', process.env.DB_USER);
console.log('dbpassword', process.env.DB_PASS);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
