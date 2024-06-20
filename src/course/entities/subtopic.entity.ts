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
  
  @Table({ tableName: 'Subtopic' })
  export class SubtopicEntity extends Model<SubtopicEntity> {
    @Default(uuidv4)
    @Column({
      type: DataType.UUID,
      primaryKey: true,
    })
    public subtopicId: string;
  
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public topicId: string;

    @Column({
        type: DataType.STRING(255),
        defaultValue: false,
        allowNull: false,
    })
    public title: string;

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