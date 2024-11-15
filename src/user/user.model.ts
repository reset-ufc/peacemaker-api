import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
    collection: 'users',
  },
);

export interface User extends mongoose.Document {
  [key: string]: any;
}
