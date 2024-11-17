import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  nodeId: String,
  displayName: String,
  username: String,
  profileUrl: String,
  photos: {
    value: String,
  },
  createdAt: Date,
  updateAt: Date,
});

export interface User extends mongoose.Document {
  id: string;
  nodeId: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: Array<{ value: string }>;
  createdAt: Date;
  updateAt: Date;
}
