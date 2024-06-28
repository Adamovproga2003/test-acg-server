import { ISubTopic } from './subtopic.interface';

export interface ITopic {
    title: string;
    subTopics: ISubTopic[];
}