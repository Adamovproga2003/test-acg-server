import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
