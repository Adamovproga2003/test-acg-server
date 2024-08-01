import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express-serve-static-core';
import { CsrfService } from './csrf.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('csrf-token')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}
  @Public()
  @Get()
  getCsrfToken(@Res() res: Response): void {
    const csrfToken = this.csrfService.generateToken();
    res.cookie('_csrf', csrfToken, { 
      httpOnly: true,
      secure: true,
      
      sameSite: 'lax',
      encode: String,
      //domain: 'artcogen.com',
      expires: new Date(Date.now() + 60 * 60 * 1000) 
    });
    res.json({ csrfToken });
  }
}
