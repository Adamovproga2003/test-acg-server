import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { config } from './config/config';
import { validationSchema } from './config/config.schema';
import { CourseModule } from './course/course.module';
import { CsrfController } from './csrf/csrf.controller';
import { CsrfService } from './csrf/csrf.service';
import { JwtModule } from './jwt/jwt.module';
import { LandingModule } from './landing/landing.module';
import { MailerModule } from './mailer/mailer.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('sequelizeConfig.host'),
        port: configService.get<number>('sequelizeConfig.port'),
        username: configService.get<string>('sequelizeConfig.username'),
        password: configService.get<string>('sequelizeConfig.password'),
        database: configService.get<string>('sequelizeConfig.database'),
        autoLoadModels: true, // Добавьте это, если вам нужно автоматическое загрузка моделей
        synchronize: true, // Добавьте это, если вам нужна автоматическая синхронизация с базой данных
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://ACG_server:1LZNEbYJ8SNT2x4E@landing.q5jufww.mongodb.net/landing?retryWrites=true&w=majority',
    ),
    /*
    CacheModule.register({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('cache.ttl'), //milliseconds
        isGlobal: true,
        max: configService.get('cache.max'), // maximum number of items in cache
      }),
      inject: [ConfigService],
    }),
    */
    CacheModule.register({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    LandingModule,
    CommonModule,
    UsersModule,
    AuthModule,
    JwtModule,
    MailerModule,
    ChatModule,
    CourseModule,
    // StaticModule,
    ApiModule,
  ],
  providers: [
    CsrfService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [CsrfController, AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
