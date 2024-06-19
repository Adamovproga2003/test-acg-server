import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { ChatMentorDto } from './dtos/chatMentorDto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('/')
  @ApiCreatedResponse({
    description: 'Send users message and returns the answer',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async init(
    @Body() chatMentorDto: ChatMentorDto,
    @CurrentUser() user_id: string,
  ): Promise<any> {
    return await this.chatService.sendMessage(chatMentorDto, user_id);
  }

  @Post('/:id')
  @ApiCreatedResponse({
    description: 'Send users message and returns the answer',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async talk(
    @Body() chatMentorDto: ChatMentorDto,
    @CurrentUser() user_id: string,
    @Param('id') chat_id: string,
  ): Promise<any> {
    return await this.chatService.sendMessage(chatMentorDto, user_id, chat_id);
  }

  @Post('/:id/plan')
  @ApiCreatedResponse({
    description: 'Get plan for user',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async plan(
    @CurrentUser() user_id: string,
    @Param('id') chat_id: string,
  ): Promise<any> {
    return await this.chatService.generatePlan(user_id, chat_id);
  }
}
