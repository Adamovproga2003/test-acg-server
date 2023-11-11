import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandingModule } from './landing/landing.module';


@Module({
  imports: [
    SequelizeModule.forRoot({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'daniil555',
    database: 'test2',
    models: [],
    autoLoadModels: true,
    synchronize: true,
  }),
  LandingModule,
],

})
export class AppModule {}
