import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
    email: string;

  @Prop({ required: true })
    passwordHash: string;

  @Prop({ required: true })
    name: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
    role: string;

  @Prop({ default: Date.now })
    createdAt: Date;

  @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
