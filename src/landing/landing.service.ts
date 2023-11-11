import { Injectable, Req , ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Email} from './dbModels/emailsLanding.model.js';

@Injectable()
export class LandingService {
    constructor(
        @InjectModel(Email)
        private readonly emailModel: typeof Email,
    ) {}
    async saveEmail(email: string): Promise<Email> {
        const existingUser = await this.emailModel.findOne({
          where: { email },
        });
    
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
    

        return this.emailModel.create({ email });
    }
    async showEmails(): Promise<Email[]> {
        const emails = await this.emailModel.findAll();
        return emails;
    }

}




