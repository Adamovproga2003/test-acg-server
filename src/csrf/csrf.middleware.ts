import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfService } from './csrf.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly csrfService: CsrfService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/csrf-token' && req.method === 'GET') {
      return next();
    }
    const token = this.csrfService.generateToken();
    res.locals.csrfToken = token; // Make the token available to the views if needed
    res.cookie('csrfToken', token, { httpOnly: true });
    next();
  }
}