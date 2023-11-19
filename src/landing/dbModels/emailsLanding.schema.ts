import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailDocument = HydratedDocument<Email>;

@Schema({ collection: 'emails' })
export class Email{
  @Prop({
    default: () => uuidv4(),
    type: String,
    required: true, 
    primaryKey: true,
  })
  _id: string;

  @Prop({
    allowNull: false,
    unique: true
  })
  email: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);