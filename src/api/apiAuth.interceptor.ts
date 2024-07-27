import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiTokenService } from './apiToken.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.response?.status === 401) {
          return from(this.apiTokenService.refreshAccessToken()).pipe(
            switchMap(() => next.handle()),
            catchError((innerError) => {
              if (innerError.response?.status === 401) {
                return from(this.apiTokenService.login()).pipe(
                  switchMap(() => next.handle()),
                  catchError((finalError) => throwError(() => new HttpException(finalError.response?.data || finalError.message, HttpStatus.UNAUTHORIZED))),
                );
              }
              return throwError(() => new HttpException(innerError.response?.data || innerError.message, HttpStatus.UNAUTHORIZED));
            }),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
