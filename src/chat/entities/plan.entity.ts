import {
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Model,
    Table,
    } from 'sequelize-typescript';
import { ChatEntity } from './chat.entity';

import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'Plan' })
export class PlanEntity extends Model<PlanEntity> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  public planId: string;

  @ForeignKey(() => ChatEntity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public chatId: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  public topics: object;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @CreatedAt
  public createdAt: Date;
}

  