import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Message' })
export class MessageEntity extends Model<MessageEntity> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  public messageId: string;

  @ForeignKey(() => ChatEntity)
  @Column({ field: 'CHAT_ID' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public chatId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isBoolean: true,
    },
  })
  public user: boolean;

  @Column({
    type: DataType.TEXT,
    defaultValue: false,
    allowNull: true,
  })
  public text: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @CreatedAt
  public createdAt: Date;
}
