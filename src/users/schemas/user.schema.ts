import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
