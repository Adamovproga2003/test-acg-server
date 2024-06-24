import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CourseEntity } from './entities/course.entity';
import { TopicEntity } from './entities/topic.entity';
import { SubtopicEntity } from './entities/subtopic.entity';
import { SubtopicLinkEntity } from './entities/subtopicLinks.entity';
import { ApiModule } from 'src/api/api.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [SequelizeModule.forFeature([CourseEntity, TopicEntity,SubtopicEntity,SubtopicLinkEntity]), ApiModule,CommonModule],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule {}