import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
    Default,
    BelongsTo,
    AllowNull
  } from 'sequelize-typescript';
  import { BCRYPT_HASH, NAME_REGEX, SLUG_REGEX } from '../../common/consts/regex.const';
  import { v4 as uuidv4 } from 'uuid';
  
  @Table({ tableName: 'Topic' })
  export class TopicEntity extends Model<TopicEntity> {
    @Default(uuidv4)
    @Column({
      type: DataType.UUID,
      primaryKey: true,
    })
    public topicId: string;
  
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public courseId: string;

    @Column({
        type: DataType.STRING(255),
        defaultValue: false,
        allowNull: false,
    })
    public title: string;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    @CreatedAt
    public createdAt: Date;
  
  }