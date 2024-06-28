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
  
  @Table({ tableName: 'SubtopicLink' })
  export class SubtopicLinkEntity extends Model<SubtopicLinkEntity> {
    @Default(uuidv4)
    @Column({
      type: DataType.UUID,
      primaryKey: true,
    })
    public subtopicLinkId: string;
  
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    public subtopicId: string;

    @Column({
        type: DataType.STRING(255),
        defaultValue: false,
        allowNull: false,
    })
    public link: string;

    @Column({
        type: DataType.TEXT,
        defaultValue: false,
        allowNull: true,
    })
    public brief: string;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    @CreatedAt
    public createdAt: Date;
  
  }