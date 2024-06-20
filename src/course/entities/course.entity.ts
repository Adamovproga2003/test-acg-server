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
  
  @Table({ tableName: 'Course' })
  export class CourseEntity extends Model<CourseEntity> {
    @Default(uuidv4)
    @Column({
      type: DataType.UUID,
      primaryKey: true,
    })
    public courseId: string;
  
    @Column({
        type: DataType.UUID,
        allowNull: true
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