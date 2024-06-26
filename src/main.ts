
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.enableCors({ 
    //"origin": "https://artcogen.com:3000",
    "origin": "http://localhost:3000",
    //"methods": "GET,POST,DELETE",
    "credentials":true
  });
  
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  
  const config = new DocumentBuilder()
  .setTitle('ACG API')
  .setDescription('ACG API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+process.env.APP_PORT);
}
bootstrap();
