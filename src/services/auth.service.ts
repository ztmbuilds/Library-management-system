import { JWT_SECRET } from '../config';
import { AppError } from '../middlewares/error.middleware';
import { IUser, User } from '../models/user.model';
import {
  IUserLogin,
  IUserSignup,
  IVerifyEmail,
  RefreshTokenDecoded,
} from '../types';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import httpStatus from 'http-status';
import crypto from 'crypto';
import Token from '../models/token.model';
import { generateOtp } from '../utils/generate-otp';
import EmailService from './email.service';

class AuthService {
  async signup(data: IUserSignup) {
    try {
      const { username, email, password } = data;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new AppError('User already exists', httpStatus.CONFLICT);
      }
      const newUser = new User({
        username,
        email,
        password,
      });

      await newUser.save();

      return {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async requestEmailVerification(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new AppError('User does not exist', 404);
      if (user.isVerified) throw new AppError('User is already verified', 400);

      const verifyToken = generateOtp();

      const hashedToken = await hash(verifyToken, 10);
      const expiresAt = Date.now() + 1000 * 60 * 15;
      await Token.create({
        userId: user.id,
        token: hashedToken,
        type: 'verify_email',
        expiresAt,
      });
      await new EmailService(user).sendEmailVerificationOTPMail(verifyToken);

      return new Date(expiresAt);
    } catch (err) {
      throw err;
    }
  }

  async verifyEmail(data: IVerifyEmail) {
    const { userId, verifyToken } = data;
    try {
      const user = await User.findById(userId);
      if (!user) throw new AppError('User not found', 404);
      if (user.isVerified) throw new AppError('Email already verified', 409);

      const token = await Token.findOne({ type: 'verify_email', userId });
      if (!token)
        throw new AppError('Invalid or expired verification token', 400);

      if (token.expiresAt < new Date(Date.now()))
        throw new AppError('Invalid or expired verification token', 400);

      const isValid = compare(verifyToken, token.token);
      if (!isValid)
        throw new AppError('Invalid or expired verification token', 400);

      user.isVerified = true;
      await user.save();
      await token.deleteOne();

      await new EmailService(user).sendVerificationSuccessMail();
    } catch (err) {
      throw err;
    }
  }

  async login(data: IUserLogin) {
    try {
      const { username_or_email, password } = data;

      const user = await User.findOne({
        $or: [{ email: username_or_email }, { username: username_or_email }],
      });
      if (!user) {
        console.log(user);
        throw new AppError('Invalid credentials', 401);
      }
      const isCorrect = await compare(password, user.password);
      if (!isCorrect) throw new AppError('Invalid credentials', 401);

      console.log(user.id);
      const { accessToken, refreshToken } = await this.generateAuthTokens(
        user.id
      );

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  private async generateAuthTokens(id: string) {
    try {
      const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

      const refreshToken = crypto.randomBytes(32).toString('hex');
      const hashedRefreshToken = await hash(refreshToken, 10);

      const refreshTokenJWT = jwt.sign({ id, refreshToken }, JWT_SECRET, {
        expiresIn: '7d',
      });

      await Token.create({
        userId: id,
        token: hashedRefreshToken,
        type: 'refresh_token',
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      return { accessToken, refreshToken: refreshTokenJWT };
    } catch (err) {
      throw err;
    }
  }

  async refreshAccessToken(refreshTokenJWT: string) {
    try {
      // Decode and verify the refresh token JWT
      const decoded = jwt.verify(
        refreshTokenJWT,
        JWT_SECRET
      ) as RefreshTokenDecoded;
      console.log(decoded);

      const { id, refreshToken } = decoded;

      const user = await User.findById(id);
      if (!user) throw new AppError('User does not exist', 404);

      // Check if the refresh token is valid
      const hashedRefreshTokens = await Token.find({
        userId: id,
        type: 'refresh_token',
      });

      if (hashedRefreshTokens.length === 0)
        throw new AppError('Invalid or expired refresh token', 401);

      let tokenExists = false;
      for (const token of hashedRefreshTokens) {
        const isValid = await compare(refreshToken, token.token);
        if (isValid) {
          tokenExists = true;
          break;
        }
      }

      if (!tokenExists)
        throw new AppError('Invalid or expired refresh token', 401);

      // Issue new access token and refresh token
      const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

      // Generate and hash new refresh token
      const refreshTokenNew = crypto.randomBytes(32).toString('hex');
      const hashedRefreshTokenNew = await hash(refreshTokenNew, 10);
      const refreshTokenJWTNew = jwt.sign(
        { id, refreshToken: refreshTokenNew },
        JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );

      await Token.create([
        {
          userId: id,
          token: hashedRefreshTokenNew,
          type: 'refresh_token',
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      ]);

      return { accessToken, refreshTokenJWTNew };
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
