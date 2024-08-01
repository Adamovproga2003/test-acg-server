import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/api/api.service';
import { CourseService } from 'src/course/course.service';
import { IPlan } from 'src/course/interfaces/plan.interface';
import { MessageEntity } from 'src/message/entities/message.entity';
import { validate } from 'uuid';
import { ChatMentorDto } from './dtos/chatMentorDto';
import { ChatEntity } from './entities/chat.entity';
import { PlanEntity } from './entities/plan.entity';

type History = { bot: string } | { user: string };

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatEntity)
    private readonly chatModel: typeof ChatEntity,
    @InjectModel(MessageEntity)
    private readonly messageModel: typeof MessageEntity,
    @InjectModel(PlanEntity)
    private readonly planModel: typeof PlanEntity,
    private readonly apiService: ApiService,
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
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
    if (!chat_id) {
      const chat = await this.chatModel.create({
        userId: user_id,
      });
      chatId = chat.chatId;
    } else {
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

    await this.messageModel.create({
      chatId,
      user: true,
      text: ms,
    });

    // request to ACG
    type IResponse = {
      answer: string;
      summary: string | null;
      plan_size: string | null;
      fix: boolean | null;
    };

    try {
      const {
        data: { answer, summary, plan_size },
      } = await lastValueFrom(
        this.apiService.post<IResponse>('/chat/mentor/', {
          user_input: ms,
          user_id,
          history: [{ bot: 'Hello' }, ...history],
        }),
      );

      await this.messageModel.create({
        chatId,
        user: false,
        text: answer,
      });

      if (summary != null) {
        return this.generatePlan(user_id, chatId, summary, plan_size);
      }

      return { chatId, answer, history, plan_size };
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

  async generatePlan(
    user_id: string,
    chatId: string,
    summary: string,
    plan_size: string,
  ): Promise<any> {
    const history: History[] = [{ bot: 'Hello' }];

    const messages = await this.messageModel.findAll({
      where: {
        chatId: chatId,
      },
      order: [['createdAt', 'ASC']],
    });
    history.push(
      ...messages.map((m) => {
        return m.user ? { user: m.text } : { bot: m.text };
      }),
    );

    type IResponse = {
      plan: IPlan;
      description: string;
    };

    try {
      const {
        data: { plan, description },
      } = await lastValueFrom(
        this.apiService.post<IResponse>('/chat/generate_plan/', {
          user_id,
          history,
          summary,
          plan_size,
        }),
      );

      const { courseId } = await this.courseService.createCourse(
        user_id,
        summary,
        plan,
      );

      return { dialog_description: summary, plan, courseId };
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
  async generateCourse(user_id: string, chatId: string) {
    const { topics, summary, planSize } = await this.planModel.findOne({
      where: {
        chatId: chatId,
      },
    });
    console.log('topicsSSSSSSSSs');
    console.log(topics);
    const plan: IPlan = topics as IPlan;
    console.log(plan);
    const { courseId } = await this.courseService.createCourse(
      user_id,
      summary,
      plan,
    );
    return { courseId };
  }
}
