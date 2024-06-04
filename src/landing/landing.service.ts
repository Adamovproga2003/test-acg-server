import { Injectable, Req , ConflictException,InternalServerErrorException,BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { InjectModel } from '@nestjs/sequelize';
import { Email} from './dbModels/emailsLanding.schema';
import * as geoipLite from 'geoip-lite';

@Injectable()
export class LandingService {
  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {}
    async createRecord(ip: string): Promise<string> {
      let new_user = new this.emailModel()
      const geo = geoipLite.lookup(ip);
      new_user.ip = ip;
      if(geo){
        let country = geo.country
        let timezone = geo.timezone 
        new_user.country = country;
        new_user.timezone = timezone;
      }
      new_user.save()
      let id = new_user._id;
      return id;
    }
    getDemoClick(id:string): void {
      const savedEmail = this.emailModel.findByIdAndUpdate(id, {isGetDemo: true}, { new: true }).exec();
    }
    learnMoreClick(id:string): void {
      const savedEmail = this.emailModel.findByIdAndUpdate(id, {isLearnMore: true}, { new: true }).exec();
    }
    async saveEmail(email: string, Ip:string, id:string): Promise<Email> {
      if(email == "")
      {
        throw new BadRequestException("Пустая почта");
      }
      try{
        const existingEmails = await this.emailModel.find({ emails: email }).exec();
        if (existingEmails.length > 0) {
          throw new ConflictException('Одна или несколько дополнительных почт уже используются в других записях');
        }
        const savedEmail = await this.emailModel.findById(id).exec();
        savedEmail.emails.push(email);
        if (savedEmail.country == "unknown" || !savedEmail.country)
        {
          const geo = geoipLite.lookup(Ip);
          let emailObj = {country: "unknown", timezone: "unknown"}
          if(geo){
            let country = geo.country
            let timezone = geo.timezone 
            emailObj.country = country;
            emailObj.timezone = timezone;
          }
          savedEmail.country = emailObj.country
          savedEmail.timezone = emailObj.timezone
        }
        //const savedEmail = await this.emailModel.findByIdAndUpdate(id, emailObj, { new: true }).exec();
        savedEmail.save();
        return savedEmail;
      }catch (error) {
        if (error instanceof ConflictException) {
          throw new ConflictException('Email already in database');
        }
        console.log(error);
        throw new InternalServerErrorException('Problem with database');
      }
    }
    /*
    async getEmails(): Promise<string[]> {
        let emails = await this.emailModel.find().exec();
        let emailsList = emails.map(email => email.email);
        return emailsList;
    }
    */

}




