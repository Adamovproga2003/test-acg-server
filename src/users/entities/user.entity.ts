import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { BCRYPT_HASH, NAME_REGEX, USERNAME_REGEX } from '../../common/consts/regex.const';

@Table({ tableName: 'users' })
export class UserEntity extends Model<UserEntity> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  public userId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    validate: {
      len: [3, 100],
      matches: NAME_REGEX,
    },
  })
  public name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 100],
      matches: USERNAME_REGEX,
    },
  })
  public username: string;

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
