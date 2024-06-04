import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailDocument = HydratedDocument<Email>;

@Schema({ collection: 'statistics' })
export class Email{
  @Prop({
    default: () => uuidv4(),
    type: String,
    required: true, 
    primaryKey: true,
  })
  _id: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  
  @Prop([String])
  emails: string[];
  @Prop({
    allowNull: true,
    unique: false
  })
  country: string;
  @Prop({
    allowNull: true,
    unique: false
  })
  timezone: string;
  @Prop({
    allowNull: true,
    unique: false
  })
  ip: string;
  @Prop({ default: false })
  isLearnMore: boolean;
  @Prop({ default: false })
  isGetDemo: boolean;
}

export const EmailSchema = SchemaFactory.createForClass(Email);