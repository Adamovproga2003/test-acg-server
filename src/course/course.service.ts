import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { CourseEntity } from './entities/course.entity';
import { TopicEntity } from './entities/topic.entity';
import { SubtopicEntity } from './entities/subtopic.entity';
import { SubtopicLinkEntity } from './entities/subtopicLinks.entity';
import { IPlan } from './interfaces/plan.іnterface';
import { v4 as uuidv4, validate } from 'uuid';
import { compare, hash } from 'bcrypt';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { ITopic } from './interfaces/topic.interface';
import { ISubTopic } from './interfaces/subtopic.interface';
import { CommonService } from '../common/common.service';
import { IResponseCourseMapper } from './mappers/responseCourse.mapper';
import { IResponseTopicMapper } from './mappers/responseTopic.mapper';

import { GetCourseById } from './dtos/getCourseById.params';
import { ApiHttpService } from 'src/api/api.service';
  
@Injectable()
export class CourseService {
constructor(
    @InjectModel(CourseEntity)
    @InjectModel(TopicEntity)
    @InjectModel(SubtopicEntity)
    private readonly courseModel: typeof CourseEntity,
    private readonly topicModel: typeof TopicEntity,
    private readonly subtopicModel: typeof SubtopicEntity,
    private readonly SubtopicLinkModel: typeof SubtopicLinkEntity,
    private readonly commonService: CommonService,
    private readonly api: ApiHttpService,
) {}
public async createCourse(userId:string, descriptionChat:string, plan:IPlan): Promise<CourseEntity> {
    const course = await this.courseModel.create({
        userId: userId,
        active:true
    });
    let topics = plan.topics;
    for (let i=0;i<topics.length;i++ ) {
        this.createTopic(userId, descriptionChat, course.courseId, topics[i])
    }
    return course;
}

public async createTopic(userId:string, descriptionChat:string,courseId:string, topic:ITopic): Promise<TopicEntity> {
    const topicBD = await this.topicModel.create({
        courseId: courseId,
        title: topic.title
    });
    let subtopics = topic.subTopics;
    let subtopicsTitles = [];
    subtopics.forEach(subtopic=>{
        subtopicsTitles.push(subtopic.title)
    });
    let links = this.generateSubtopicLinks(userId,subtopicsTitles, descriptionChat);
    

    for (let i=0;i<subtopics.length;i++ ) {
        let subtopicLinks = [links[i]];

        this.createSubtopic(topicBD.topicId, subtopics[i],subtopicLinks)
    }
    return topicBD;
}

public async createSubtopic(topicId:string, subTopic:ISubTopic, links:any): Promise<SubtopicEntity> {
    const subTopicBD = await this.subtopicModel.create({
        topicId: topicId,
        title: subTopic.title
    });
    for(let i=0;i<links.links.length;i++){
        this.createSubtopicLink(subTopicBD.subtopicId,links.links[i],links.brief[i])
    }
    return subTopicBD;
}

public async createSubtopicLink(subTopicId:string, link:string, brief:string): Promise<SubtopicLinkEntity> {
    const subTopicLinkBD = await this.SubtopicLinkModel.create({
        subtopicId: subTopicId,
        link: link,
        brief: brief
    });
    return subTopicLinkBD;
}

public async generateSubtopicLinks(userId:string,subtopics:string[] ,descriptionChat:string): Promise<any>{
    let links = await this.api.axiosRef.post<any>(`/course/topic`, {
        userId,
        subtopics,
        descriptionChat,
    });
    return links;
}

public async findCourseById(id: GetCourseById): Promise<IResponseCourseMapper> {
    if (!validate(id.courseId)) {
        throw new BadRequestException('Invalid id');
    }
    let course = await this.courseModel.findByPk(id.courseId);
    let topicsId=[];
    let topics = await this.topicModel.findAll({
        where: {
          courseId: id.courseId,
        },
        order: [['createdAt', 'ASC']],
    });
    topics.forEach(topic=>{
        topicsId.push(topic.topicId)
    })
    return IResponseCourseMapper.map(course, topicsId);
}

public async findTopicById(id: GetCourseById): Promise<IResponseTopicMapper> {
    if (!validate(id.courseId)) {
        throw new BadRequestException('Invalid id');
    }
    let topic = await this.topicModel.findByPk(id.courseId);
    let subtopics=[];
    let subtopicsBD = await this.subtopicModel.findAll({
        where: {
            topicId: id.courseId,
        },
        order: [['createdAt', 'ASC']],
    });
    subtopicsBD.forEach(subtopic=>{
        let subtopicsLinksBD = this.subtopicModel.findAll({
            where: {
                subtopicId: subtopic.subtopicId,
            },
            order: [['createdAt', 'ASC']],
            attributes: ['link', 'brief']
        });
        subtopics.push({
            text: subtopic.text,
            title: subtopic.title,
            links: subtopicsLinksBD
        })
    })
    return IResponseTopicMapper.map(topic, subtopics);
}

}
  
