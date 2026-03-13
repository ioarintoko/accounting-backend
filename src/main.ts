/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Mengaktifkan CORS supaya bisa ditembak dari Next.js (Frontend)
  app.enableCors();

  // Mengaktifkan validasi input secara global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();