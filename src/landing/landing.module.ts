import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
/*import { Email } from './dbModels/emailsLanding.model';*/
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './dbModels/emailsLanding.schema';

@Module({
  imports: [/*SequelizeModule.forFeature([Email])*/
  MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),],
  providers: [LandingService],
  controllers: [LandingController],
})
export class LandingModule {}