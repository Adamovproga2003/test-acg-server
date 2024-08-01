import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { from, lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private readonly apiUrl: string;
  private readonly apiUsername: string;
  private readonly apiPassword: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {
    this.apiUrl = this.configService.get<string>('modelApi.domain');
    this.apiUsername = 'pro100Danya228';
    this.apiPassword = '3f7f658871bed86d6d3ac674ef9df9';

    if (!this.apiUrl || !this.apiUsername || !this.apiPassword) {
      throw new Error('API configuration is incomplete');
    }
  }

  private async getAccessToken(): Promise<string> {
    const cachedToken = await this.cacheManager.get<string>('access_token');
    if (cachedToken) {
      this.logger.debug('Using cached access token');
      return cachedToken;
    }
    this.logger.debug('No cached token, refreshing');
    return this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.cacheManager.get<string>('refresh_token');
    if (!refreshToken) {
      this.logger.debug('No refresh token, logging in with credentials');
      return this.loginWithCredentials();
    }

    try {
      this.logger.debug('Attempting to refresh token');
      const response = await lastValueFrom(
        this.httpService.post(`${this.apiUrl}/refresh`, {
          refresh_token: refreshToken,
        }),
      );
      const { access_token, refresh_token } = response.data;

      await this.cacheManager.set('access_token', access_token, 3600000);
      await this.cacheManager.set(
        'refresh_token',
        refresh_token,
        7 * 24 * 3600000,
      );

      this.logger.debug('Token refreshed successfully');
      return access_token;
    } catch (error) {
      this.logger.error('Error refreshing token:', error);
      return this.loginWithCredentials();
    }
  }

  private async loginWithCredentials(): Promise<string> {
    try {
      console.log('this.apiUrl: ', this.apiUrl);
      this.logger.debug('Logging in with credentials');
      const response = await lastValueFrom(
        this.httpService.post(`${this.apiUrl}/token`, {
          username: this.apiUsername,
          password: this.apiPassword,
        }),
      );

      console.log('response: ', response);
      const { access_token, refresh_token } = response.data;

      await this.cacheManager.set('access_token', access_token, 3600000);
      await this.cacheManager.set(
        'refresh_token',
        refresh_token,
        7 * 24 * 3600000,
      );

      this.logger.debug('Login successful');
      return access_token;
    } catch (error) {
      console.log(error);
      this.logger.error('Login failed:', error);
      throw new UnauthorizedException('Failed to authenticate with the API');
    }
  }

  request(method: string, path: string, data?: any): Observable<any> {
    return from(this.getAccessToken()).pipe(
      mergeMap((token) => this.makeRequest(method, path, data, token)),
      catchError((error: AxiosError) => {
        this.logger.error(
          `Request failed: ${error.message}`,
          error.response?.data,
        );
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 307)
        ) {
          this.logger.debug(
            'Unauthorized or redirect, refreshing token and retrying',
          );
          return from(this.refreshAccessToken()).pipe(
            mergeMap((newToken) =>
              this.makeRequest(method, path, data, newToken),
            ),
          );
        }
        return throwError(() => error);
      }),
    );
  }

  private makeRequest(
    method: string,
    path: string,
    data: any,
    token: string,
  ): Observable<AxiosResponse> {
    this.logger.debug(`Making ${method} request to ${path}`);
    return this.httpService
      .request({
        method,
        url: `${this.apiUrl}${path}`,
        data,
        headers: { Authorization: `Bearer ${token}` },
        maxRedirects: 5, // Allow some redirects
      })
      .pipe(
        tap((response) =>
          this.logger.debug(`Request successful: ${response.status}`),
        ),
        catchError((error: AxiosError) => {
          this.logger.error(
            `Request error: ${error.message}`,
            error.response?.data,
          );
          return throwError(() => error);
        }),
      );
  }

  get(path: string): Observable<any> {
    return this.request('GET', path);
  }

  post<T = any>(path: string, data?: any): Observable<AxiosResponse<T>> {
    return this.request('POST', path, data);
  }
}
