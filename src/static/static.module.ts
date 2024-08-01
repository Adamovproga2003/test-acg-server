import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
  imports: [],
  providers: [StaticService],
  controllers: [StaticController],
})
export class StaticModule {}
