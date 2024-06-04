import {
    Column,
    CreatedAt,
    DataType,
    Model,
    Table,
    UpdatedAt,
    Default,
    BelongsTo
  } from 'sequelize-typescript';
  import { BCRYPT_HASH, NAME_REGEX, SLUG_REGEX } from '../../common/consts/regex.const';
  import { v4 as uuidv4 } from 'uuid';
  
  @Table({ tableName: 'users' })
  export class UserEntity extends Model<UserEntity> {
    @Default(uuidv4)
    @Column({
      type: DataType.UUID,
      primaryKey: true,
    })
    public user_id: string;
  
    @Column({
      type: DataType.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
        matches: NAME_REGEX,
      },
    })
    public name: string;

    @Column({
      type: DataType.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 255],
      },
    })
    public email: string;
  
    @Column({
      type: DataType.STRING(60),
      allowNull: false,
      validate: {
        len: [59, 60],
        matches: BCRYPT_HASH,
      },
    })
    public password: string;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isBoolean: true,
      },
    })
    public confirmed: boolean;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    @CreatedAt
    public createdAt: Date;
  
  }