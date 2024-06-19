import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiHttpService } from './api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: `http://${process.env.ACG_HOST}:${process.env.ACG_PORT}/`,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    ConfigModule,
  ],
  providers: [
    {
      provide: ApiHttpService,
      useExisting: HttpService,
    },
  ],
  exports: [ApiHttpService],
})
export class ApiModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}
  onModuleInit() {
    this.httpService.axiosRef.defaults.headers.common['Accept'] =
      'application/json';
  }
}
