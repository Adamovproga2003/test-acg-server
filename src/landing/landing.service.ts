import { Injectable, Req , ConflictException,InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { InjectModel } from '@nestjs/sequelize';
import { Email} from './dbModels/emailsLanding.schema';

@Injectable()
export class LandingService {
  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {}
    async saveEmail(email: string): Promise<Email> {
      try{
        const existingEmail = await this.emailModel.findOne({ email: email }).exec();
        if (existingEmail) {
          throw new ConflictException('Email already in database');
        }
        const createdEmail = new this.emailModel({ email: email });
        return createdEmail.save();
      }catch (error) {
        if (error instanceof ConflictException) {
          throw new ConflictException('Email already in database');
        }
        console.log(error);
        throw new InternalServerErrorException('Problem with database');
      }
    }
    async getEmails(): Promise<string[]> {
        let emails = await this.emailModel.find().exec();
        let emailsList = emails.map(email => email.email);
        return emailsList;
    }

}




