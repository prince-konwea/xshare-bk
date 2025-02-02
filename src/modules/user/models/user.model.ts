import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, trim: true,  })
  password: string;

  @Prop({ type: Number, default: 0.0 }) 
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
