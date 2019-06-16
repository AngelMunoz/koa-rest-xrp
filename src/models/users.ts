import { Schema, model, Document } from 'mongoose';

export interface IUserSchema {
  email: string;
  password: string;
  name: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserModel extends Document, IUserSchema { }

const UserSchema = new Schema<IUserSchema>({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true })

export const User = model<IUserModel>('User', UserSchema, 'users');
User.createIndexes();

