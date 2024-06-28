import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CourseEntity } from 'src/course/entities/course.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Chat' })
export class ChatEntity extends Model<ChatEntity> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  public chatId: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public userId: string;

  @ForeignKey(() => CourseEntity)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public courseId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    validate: {
      isBoolean: true,
    },
  })
  public active: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @CreatedAt
  public createdAt: Date;
}
