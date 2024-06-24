import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApiModule } from 'src/api/api.module'
import { CommonModule } from '../common/common.module'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { CourseEntity } from './entities/course.entity'
import { SubtopicEntity } from './entities/subtopic.entity'
import { SubtopicLinkEntity } from './entities/subtopicLinks.entity'
import { TopicEntity } from './entities/topic.entity'

@Module({
  imports: [SequelizeModule.forFeature([CourseEntity, TopicEntity,SubtopicEntity,SubtopicLinkEntity]), ApiModule,CommonModule],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}