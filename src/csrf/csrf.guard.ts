import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const csrfRequired = this.reflector.get<boolean>('csrf', context.getHandler());
    if (!csrfRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const csrfToken = request.cookies['_csrf'];
    const headerToken = request.headers['x-csrf-token'];
    if (!csrfToken) {
      throw new ForbiddenException('CSRF token is missing in cookies');
    }
    if (!headerToken) {
      throw new ForbiddenException('CSRF token is missing in header');
    }
    if (csrfToken !== headerToken){
      throw new ForbiddenException('CSRF token dont match');
    }
    return true;
  }
}