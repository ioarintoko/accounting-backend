import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  server(req, res);
};