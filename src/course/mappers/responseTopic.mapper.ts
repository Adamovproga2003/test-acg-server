import { ApiProperty } from '@nestjs/swagger';
import { IResponseTopic } from '../interfaces/responseTopic.interface';
import { IResponseSubTopic } from '../interfaces/responseSubTopic.interface';
import { TopicEntity } from '../entities/topic.entity';

export class IResponseTopicMapper implements IResponseTopic {
  @ApiProperty({
    description: 'Course id',
    type: String,
  })
  public topicId: string;

  @ApiProperty({
    description: 'Course description',
    type: String,
  })
  public title: string;

  @ApiProperty({
    description: 'Course topics',
    type: [String],
  })
  public subtopics: IResponseSubTopic[];

  @ApiProperty({
    description: 'Course creation date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public createdAt: string;

  constructor(values: IResponseTopic) {
    Object.assign(this, values);
  }

  public static map(topic: TopicEntity, subtopics:IResponseSubTopic[]): IResponseTopicMapper {
    return new IResponseTopicMapper({
        topicId: topic.topicId,
        title: topic.title,
        subtopics: subtopics,
        createdAt: topic.createdAt.toISOString()
    });
  }
}