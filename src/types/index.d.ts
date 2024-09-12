import { IUser } from '../models/user.model';
import { ParsedQs } from 'qs';
export interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: string; //Index signature
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        role: UserRole;
        id: string;
      };
    }
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: IUser;
//   }
// }

//User

export interface IUserSignup {
  username: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  username_or_email: string;
  password: string;
}

export interface IUserUpdate {
  username: string;
  email: string;
}

export interface RefreshTokenDecoded extends Jwt.JwtPayload {
  refreshToken: string;
  id: string;
}

export interface IVerifyEmail {
  userId: string;
  verifyToken: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

//Book
export interface UpdateBookInput {
  title: string;
  author: string;
  genre: string;
  availabe: boolean;
  totalCopies: number;
  availableCopies: number;
}
