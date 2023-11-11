import { Controller, Get, Post, Req, Body } from '@nestjs/common';

import { LandingService } from './landing.service';

@Controller('landing')
export class LandingController {
    constructor(private landingService: LandingService) {}
    @Post('allEmails')
    async showEmails(): Promise<string>{
        const emails = await this.landingService.showEmails();
        return emails.join('\n');
    }
    @Post('saveEmail')
    async createUser(@Body('email') email: string): Promise<string> {
        const emailEnt = await this.landingService.saveEmail(email);
        return `Email saved successfully!`;
    }
}
