import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiHttpService } from 'src/api/api.service';
import { CourseService } from 'src/course/course.service';
import { IPlan } from 'src/course/interfaces/plan.іnterface';
import { MessageEntity } from 'src/message/entities/message.entity';
import { validate } from 'uuid';
import { ChatMentorDto } from './dtos/chatMentorDto';
import { ChatEntity } from './entities/chat.entity';

type History = { bot: string } | { user: string };

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatEntity) private readonly chatModel: typeof ChatEntity,
    @InjectModel(MessageEntity)
    private readonly messageModel: typeof MessageEntity,
    private readonly api: ApiHttpService,
    private readonly courseService: CourseService,
  ) {}
  async getUserChats(user_id): Promise<ChatEntity[]> {
    const chats = await this.chatModel.findAll({
      where: {
        userId: user_id,
      },
      order: [['createdAt', 'ASC']],
      attributes: ['chatId'],
    });
    return chats;
  }

  async getChatById(chat_id: string): Promise<ChatEntity> {
    if (!validate(chat_id)) {
      throw new BadRequestException('Invalid id');
    }
    return await this.chatModel.findByPk(chat_id);
  }
  async sendMessage(
    { message: ms }: ChatMentorDto,
    user_id: string,
    chat_id?: string,
  ): Promise<any> {
    let chatId = chat_id;

    const history: History[] = [];
    if (chat_id) {
      // find all messages in the chat of the user and bot
      const messages = await this.messageModel.findAll({
        where: {
          chatId,
        },
        order: [['createdAt', 'ASC']],
      });
      history.push(
        ...messages.map((m) => {
          return m.user ? { user: m.text } : { bot: m.text };
        }),
      );
    }
    // request to ACG
    type IResponse = {
      text: string;
      flag: boolean;
    };

    try {
      const {
        data: { text, flag },
      } = await this.api.axiosRef.post<IResponse>(`chat/mentor`, {
        user_input: ms,
        user_id,
        history: [{ bot: 'Hello' }, ...history],
      });

      const chat = await this.chatModel.create({
        userId: user_id,
      });
      chatId = chat.chatId;

      await this.messageModel.create({
        chatId,
        user: true,
        text: ms,
      });

      await this.messageModel.create({
        chatId,
        user: false,
        text,
      });

      if (flag) {
        return this.generatePlan(user_id, chatId);
      }

      return { chatId, text, flag, history };
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      return error;
    }
  }
  async generatePlan(user_id: string, chat_id: string): Promise<any> {
    const history: History[] = [{ bot: 'Hello' }];

    const messages = await this.messageModel.findAll({
      where: {
        chatId: chat_id,
      },
      order: [['createdAt', 'ASC']],
    });
    history.push(
      ...messages.map((m) => {
        return m.user ? { user: m.text } : { bot: m.text };
      }),
    );

    type IResponse = {
      dialog_description: string;
      plan: IPlan;
    };

    try {
      const {
        data: { dialog_description, plan },
      } = await this.api.axiosRef.post<IResponse>(`chat/generate_plan`, {
        user_id,
        history,
      });

      // create Plan entity
      // coming chatId
      const { courseId } = await this.courseService.createCourse(
        user_id,
        dialog_description,
        plan,
      );

      return { dialog_description, plan, courseId };
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      return error;
    }
  }
}
