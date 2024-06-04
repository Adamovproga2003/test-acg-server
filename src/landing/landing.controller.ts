import { Controller, Get, Post, Req, Body, UseGuards,  Ip , Res, HttpStatus  } from '@nestjs/common';
import { Request,Response } from 'express-serve-static-core';
import { LandingService } from './landing.service';
import { CsrfToken } from '../csrf/csrf.decorator';
import { CsrfGuard } from '../csrf/csrf.guard';
import { Public } from '../auth/decorators/public.decorator';

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
    @Public()
    @Post('visit')
    @CsrfToken()
    @UseGuards(CsrfGuard)
    async createRecord(@Req() request: Request, @Res() res: Response): Promise<void> {
        let ip = Array.isArray(request.headers['ip']) ? request.headers['ip'][0] : request.headers['ip'];
        let id = request.cookies['id'];
        if (!id) {
            id = await this.landingService.createRecord(ip);
            res.cookie('id', id, { 
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                encode: String,
                //domain: 'artcogen.com',
                expires: new Date(Date.now() + 30 *24 * 60 * 60 * 1000) 
            });   
        }
        res.status(HttpStatus.OK).send();
        
    }
    @Public()
    @Post('getDemoClick')
    @CsrfToken()
    @UseGuards(CsrfGuard)
    async getDemoClick(@Req() request: Request, @Res() res: Response): Promise<void> {
        let ip = Array.isArray(request.headers['ip']) ? request.headers['ip'][0] : request.headers['ip'];
        let id = request.cookies['id'];
        if (!id) {
            id = await this.landingService.createRecord(ip);
            res.cookie('id', id, { 
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                encode: String,
                //domain: 'artcogen.com',
                expires: new Date(Date.now() + 30 *24 * 60 * 60 * 1000) 
            });   
        }
        this.landingService.getDemoClick(id);
        res.status(HttpStatus.OK).send();
    }
    @Public()
    @Post('learnMoreClick')
    @CsrfToken()
    @UseGuards(CsrfGuard)
    async learnMoreClick(@Req() request: Request, @Res() res: Response): Promise<void> {
        let ip = Array.isArray(request.headers['ip']) ? request.headers['ip'][0] : request.headers['ip'];
        let id = request.cookies['id'];
        if (!id) {
            id = await this.landingService.createRecord(ip);
            res.cookie('id', id, { 
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                encode: String,
                //domain: 'artcogen.com',
                expires: new Date(Date.now() + 30 *24 * 60 * 60 * 1000) 
            });   
        }
        this.landingService.learnMoreClick(id);
        res.status(HttpStatus.OK).send();
    }

    @Public()
    @Post('add-email')
    @CsrfToken()
    @UseGuards(CsrfGuard)
    async saveEmail(@Req() request: Request, @Body('email') email: string, @Res() res: Response): Promise<{status:string, message:string}> {
        let ip = Array.isArray(request.headers['ip']) ? request.headers['ip'][0] : request.headers['ip'];
        let id = request.cookies['id'];
        if (!id) {
            id = await this.landingService.createRecord(ip);
            res.cookie('id', id, { 
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                encode: String,
                //domain: 'artcogen.com',
                expires: new Date(Date.now() + 30 *24 * 60 * 60 * 1000) 
            });   
        }
        
        let emailEnt = await this.landingService.saveEmail(email, ip, id);
        res.status(HttpStatus.OK).send();
        return {status:`200`, message:`Email saved`};
    }
}
