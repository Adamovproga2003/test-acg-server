import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiTokenService } from './apiToken.service';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './apiAuth.interceptor';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
    }),
    
  ],
  providers: [
    ApiTokenService,
    ApiService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
  exports: [ApiService],
})
export class ApiModule {}
