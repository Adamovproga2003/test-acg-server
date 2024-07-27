import { Injectable, UseInterceptors } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTokenService } from './apiToken.service';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AuthInterceptor } from './apiAuth.interceptor';

@Injectable()
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: ApiTokenService,
  ) {}

  @UseInterceptors(AuthInterceptor)
  async get(url: string, config?: AxiosRequestConfig): Promise<any> {
    const token = await this.tokenService.getAccessToken();
    const headers = {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    };

    return firstValueFrom(this.httpService.get(url, { ...config, headers }));
  }

  @UseInterceptors(AuthInterceptor)
  async post(url: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    const token = await this.tokenService.getAccessToken();
    const headers = {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    };

    return firstValueFrom(this.httpService.post(url, data, { ...config, headers }));
  }

  // Добавить методы для PUT, DELETE и других типов запросов по аналогии
}
