import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Course' })
export class CourseEntity extends Model<CourseEntity> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  public courseId: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public userId: string;

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
    type: DataType.TEXT,
    defaultValue: false,
    allowNull: true,
  })
  public description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @CreatedAt
  public createdAt: Date;
}
