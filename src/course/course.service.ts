import {
    BadRequestException,
    Injectable
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { validate } from 'uuid'
import { CommonService } from '../common/common.service'
import { CourseEntity } from './entities/course.entity'
import { SubtopicEntity } from './entities/subtopic.entity'
import { SubtopicLinkEntity } from './entities/subtopicLinks.entity'
import { TopicEntity } from './entities/topic.entity'
import { IResponseCourseMapper } from './mappers/responseCourse.mapper'
import { IResponseTopicMapper } from './mappers/responseTopic.mapper'

import { ApiHttpService } from 'src/api/api.service'
import { GetCourseById } from './dtos/getCourseById.params'
import { IPlan } from './interfaces/plan.interface'
  
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
    private readonly api: ApiHttpService,
) {}
public async createCourse(userId:string, descriptionChat:string, plan: IPlan): Promise<CourseEntity> {
    const course = await this.courseModel.create({
        userId: userId,
        active:true
    });

    Object.keys(plan).forEach(async key => {
        await this.createTopic(userId, descriptionChat, course.courseId, key, plan[key])
    })
    return course;
}

public async createTopic(userId:string, descriptionChat:string,courseId:string, topic: string, subtopics: string[]): Promise<TopicEntity> {
    const topicBD = await this.topicModel.create({
        courseId: courseId,
        title: topic
    });

    let links = await this.generateSubtopicLinks(userId, subtopics, descriptionChat);
    

    for (let i=0;i<subtopics.length;i++ ) {
        let subtopicLinks = [links[i]];

        await this.createSubtopic(topicBD.topicId, subtopics[i],subtopicLinks)
    }
    return topicBD;
}

public async createSubtopic(topicId:string, subTopic:string, links:any): Promise<SubtopicEntity> {
    const subTopicBD = await this.subtopicModel.create({
        topicId: topicId,
        title: subTopic
    });
    for(let i=0;i<links.links.length;i++){
        await this.createSubtopicLink(subTopicBD.subtopicId,links.links[i],links.brief[i])
    }
    return subTopicBD;
}

public async createSubtopicLink(subTopicId:string, link:string, brief:string): Promise<SubtopicLinkEntity> {
    const subTopicLinkBD = await this.subtopicLinkModel.create({
        subtopicId: subTopicId,
        link: link,
        brief: brief
    });
    return subTopicLinkBD;
}

public async generateSubtopicLinks(userId:string,subtopics:string[] ,descriptionChat:string): Promise<any>{
    let links = await this.api.axiosRef.post<any>(`/course/links/`, {
        user_id: userId,
        topics: subtopics,
        description: descriptionChat,
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
  
