import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    "origin": "https://artcogen.com:3000",
    "methods": "GET,POST",
    "credentials":true
  });
  app.use(cookieParser());
  
  await app.listen(3001);
}
bootstrap();
