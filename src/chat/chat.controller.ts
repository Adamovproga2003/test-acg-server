import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    Patch,
    UnauthorizedException,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';
import { ChatMentorDto } from './dtos/chatMentorDto'


@ApiTags('Chat')
@Controller('chat')
export class ChatController {
constructor(
    private readonly configService: ConfigService,
    private chatService: ChatService,
    ) {}
    /*
    @Post('/mentor')
    @ApiCreatedResponse({
        description: 'Send users message and returns the answer',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not logged in.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    public async mentor(
        @Body() chatMentorDto: ChatMentorDto,

    ): Promise<> {
        return await this.chatService.sendMessage(chatMentorDto);
    }
    */
}
