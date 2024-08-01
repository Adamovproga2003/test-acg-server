import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { validate } from 'uuid';
import { CommonService } from '../common/common.service';
import { CourseEntity } from './entities/course.entity';
import { SubtopicEntity } from './entities/subtopic.entity';
import { SubtopicLinkEntity } from './entities/subtopicLinks.entity';
import { TopicEntity } from './entities/topic.entity';
import { IResponseCourseMapper } from './mappers/responseCourse.mapper';
import { IResponseTopicMapper } from './mappers/responseTopic.mapper';

import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/api/api.service';
import { IPlan } from './interfaces/plan.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(CourseEntity)
    private readonly courseModel: typeof CourseEntity,
    @InjectModel(TopicEntity)
    private readonly topicModel: typeof TopicEntity,
    @InjectModel(SubtopicEntity)
    private readonly subtopicModel: typeof SubtopicEntity,
    @InjectModel(SubtopicLinkEntity)
    private readonly subtopicLinkModel: typeof SubtopicLinkEntity,
    private readonly commonService: CommonService,
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}
  public async createCourse(
    userId: string,
    descriptionChat: string,
    plan: IPlan,
  ): Promise<CourseEntity> {
    const course = await this.courseModel.create({
      userId: userId,
      active: true,
    });

    await Promise.all(
      Object.keys(plan).map((key) =>
        this.createTopic(
          userId,
          descriptionChat,
          course.courseId,
          key,
          plan[key],
        ),
      ),
    );
    return course;
  }

  public async createTopic(
    userId: string,
    descriptionChat: string,
    courseId: string,
    topic: string,
    subtopics: string[],
  ): Promise<TopicEntity> {
    const topicBD = await this.topicModel.create({
      courseId: courseId,
      title: topic,
    });

    const topicA: { [key: string]: string[] } = {
      [topic]: subtopics,
    };

    console.log('topicA', topicA);
    const links = await this.generateSubtopicLinks(
      userId,
      topicA,
      descriptionChat,
    );

    await Promise.all(
      subtopics.map((subtopic, i) =>
        this.createSubtopic(topicBD.topicId, subtopic, [links[i]]),
      ),
    );

    return topicBD;
  }

  public async createSubtopic(
    topicId: string,
    subTopic: string,
    links: any,
  ): Promise<SubtopicEntity> {
    const subTopicBD = await this.subtopicModel.create({
      topicId: topicId,
      title: subTopic,
    });

    await Promise.all(
      links.links.map((link, i) =>
        this.createSubtopicLink(subTopicBD.subtopicId, link, links.brief[i]),
      ),
    );

    return subTopicBD;
  }

  public async createSubtopicLink(
    subTopicId: string,
    link: string,
    brief: string,
  ): Promise<SubtopicLinkEntity> {
    const subTopicLinkBD = await this.subtopicLinkModel.create({
      subtopicId: subTopicId,
      link: link,
      brief: brief,
    });
    return subTopicLinkBD;
  }

  public async generateSubtopicLinks(
    userId: string,
    subtopics: { [key: string]: string[] },
    descriptionChat: string,
  ): Promise<any> {
    console.log('Starting generateSubtopicLinks:');
    console.log('subtopics:', subtopics);

    try {
      const links = await lastValueFrom(
        this.apiService.post('/course/links/', {
          user_id: userId,
          plan_part: subtopics,
          description: descriptionChat,
        }),
      );

      console.log('Received links:', links);
      return links;
    } catch (error) {
      console.error('Error in generateSubtopicLinks:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  }

  public async findCourseById(id: string): Promise<IResponseCourseMapper> {
    console.log('id.courseId:' + id);
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const course = await this.courseModel.findOne({
      where: {
        courseId: id,
      },
    });
    const topicsId = [];
    const topics = await this.topicModel.findAll({
      where: {
        courseId: id,
      },
      order: [['createdAt', 'ASC']],
    });
    topics.forEach((topic) => {
      topicsId.push(topic.topicId);
    });
    return IResponseCourseMapper.map(course, topicsId);
  }

  public async findTopicById(id: string): Promise<IResponseTopicMapper> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id');
    }
    const topic = await this.topicModel.findByPk(id);
    const subtopics = [];
    const subtopicsBD = await this.subtopicModel.findAll({
      where: {
        topicId: id,
      },
      order: [['createdAt', 'ASC']],
    });

    for (const subtopic of subtopicsBD) {
      const subtopicsLinksBD = await this.subtopicLinkModel.findAll({
        where: {
          subtopicId: subtopic.subtopicId,
        },
        order: [['createdAt', 'ASC']],
        attributes: ['link', 'brief'],
      });
      subtopics.push({
        text: subtopic.text,
        title: subtopic.title,
        links: subtopicsLinksBD,
      });
    }
    return IResponseTopicMapper.map(topic, subtopics);
  }
}
