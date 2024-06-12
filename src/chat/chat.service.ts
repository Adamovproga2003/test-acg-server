import { Injectable } from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { ChatMentorDto } from './dtos/chatMentorDto'

@Injectable()
export class ChatService {
    constructor(
        private readonly commonService: CommonService
    ) {}
    public async sendMessageToModel(dto: ChatMentorDto): Promise<> {
        
    }
        
}
