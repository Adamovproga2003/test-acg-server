import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Email } from './dbModels/emailsLanding.model';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';

@Module({
  imports: [SequelizeModule.forFeature([Email])],
  providers: [LandingService],
  controllers: [LandingController],
})
export class LandingModule {}