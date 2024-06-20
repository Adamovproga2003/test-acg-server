import { IResponseSubTopic } from './responseSubTopic.interface';

export interface IResponseTopic {
    topicId: string;
    subtopics: IResponseSubTopic[];
    title: string;
    createdAt: string;
}