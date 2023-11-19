import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandingModule } from './landing/landing.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CsrfMiddleware } from './csrf/csrf.middleware';
import { CsrfService } from './csrf/csrf.service';
import { CsrfController } from './csrf/csrf.controller';
import { APP_GUARD } from '@nestjs/core';
import { CsrfGuard } from './csrf/csrf.guard';



@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60, // Время жизни счетчика (в секундах)
      limit: 10, // Максимальное количество запросов за указанный период времени
    }]),
    MongooseModule.forRoot('mongodb+srv://ACG_server:1LZNEbYJ8SNT2x4E@landing.q5jufww.mongodb.net/landing?retryWrites=true&w=majority'),
    /*ConfigModule.forRoot(),*/
    /*SequelizeModule.forRoot({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'daniil555',
    database: 'test2',
    models: [],
    autoLoadModels: true,
    synchronize: true,
  }),*/
  LandingModule,
],
providers: [CsrfService],
controllers: [CsrfController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
