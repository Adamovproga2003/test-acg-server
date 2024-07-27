import { Injectable, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ApiTokenService {
  private accessToken: string;
  private refreshToken: string;
  private readonly logger = new Logger(ApiTokenService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }
    return await this.cacheManager.get('accessTokenApi');
  }

  async refreshAccessToken(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    try {
      console.log(refreshToken)
      let headers = {
        Authorization: `Bearer ${refreshToken}`,
      };
      const response = await firstValueFrom(
        this.httpService.post(`${this.configService.get<string>('modelApi.domain')}/refresh`, {},{headers}),
      );
      this.cacheManager.set('accessTokenApi',response.data.access_token);
      this.logger.log('Access token refreshed');
    } catch (error) {
      this.logger.error('Failed to refresh access token', error);
      throw new Error('Failed to access model');
    }
  }

  async getRefreshToken(): Promise<string> {
    if (!this.refreshToken) {
      await this.login();
    }
    return await this.cacheManager.get('refreshTokenApi');
  }

  async login(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.configService.get<string>('modelApi.domain')}/token`, {
            username: 'pro100Danya228',
            password: '3f7f658871bed86d6d3ac674ef9df9',
        }
        ),
      );
      this.cacheManager.set('accessTokenApi',response.data.access_token);
      this.cacheManager.set('refreshTokenApi',response.data.refresh_token);
      this.logger.log('Login sucsesfull');
    } catch (error) {
      this.logger.error('Failed login to api', error);
      throw new Error('Failed to access model');
    }
  }
}
