import { Column, Model, Table, Default, DataType, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Email extends Model {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    allowNull: false,
    unique: true
  })
  email: string;

  @BeforeCreate
  static generateId(instance: Email) {
    instance.id = uuidv4();
  }
}