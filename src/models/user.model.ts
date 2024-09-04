import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { UserRole } from '../types';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const hashedPassword = await hash(this.password as string, 10);

  this.password = hashedPassword;
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
