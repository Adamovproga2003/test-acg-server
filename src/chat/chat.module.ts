import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiModule } from 'src/api/api.module';
import { MessageEntity } from 'src/message/entities/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatEntity } from './entities/chat.entity';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [SequelizeModule.forFeature([ChatEntity, MessageEntity]), ApiModule],
})
export class ChatModule {}
