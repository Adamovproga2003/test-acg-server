import { Controller, Get, Post, Req, Body, UseGuards  } from '@nestjs/common';
import { LandingService } from './landing.service';
import { CsrfToken } from '../csrf/csrf.decorator';
import { CsrfGuard } from '../csrf/csrf.guard';

@Controller('landing')
export class LandingController {
    constructor(private landingService: LandingService) {}
    /*
    @Get('getEmails')
    async showEmails(): Promise<string[]>{
        const emails = await this.landingService.getEmails();
        return emails;
    }
    */
    @Post('add-email')
    @CsrfToken()
    @UseGuards(CsrfGuard)
    async createUser(@Body('email') email: string): Promise<{status:string, message:string}> {
        let emailEnt = await this.landingService.saveEmail(email);
        return {status:`200`, message:`Email saved`};
    }
}
