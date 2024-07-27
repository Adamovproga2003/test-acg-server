import { Body, Controller, Param, Post, Get } from '@nestjs/common';
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
    console.log(user_id)
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

  @Get('/:id')
  @ApiCreatedResponse({
    description: 'Get chat by id',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async getChatById(
    @Param('id') chat_id: string,
  ): Promise<any> {
    return await this.chatService.getChatById(chat_id);
  }

  @Get('/chats')
  @ApiCreatedResponse({
    description: 'Get chats',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async getUserChats(
    @CurrentUser() user_id: string,
    
  ): Promise<any> {
    return await this.chatService.getUserChats(user_id);
  }

  @Post('/generate/:id')
  @ApiCreatedResponse({
    description: 'Get chats',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  public async generateCourse(
    @CurrentUser() user_id: string,
    @Param('id') chat_id: string,
  ): Promise<any> {
    return await this.chatService.generateCourse(user_id,chat_id);
  }
}
