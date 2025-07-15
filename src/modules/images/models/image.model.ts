import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  type: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop()
  category?: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image); 