import { JWT_SECRET } from '../config';
import { AppError } from '../middlewares/error.middleware';
import { IUser, User } from '../models/user.model';
import { IUserLogin, IUserSignup, RefreshTokenDecoded } from '../types/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import httpStatus from 'http-status';
import crypto from 'crypto';
import Token from '../models/token.model';

class AuthService {
  async signup(payload: IUserSignup) {
    try {
      const { username, email, password } = payload;

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

      const { password: _, ...rest } = newUser;

      return { user: rest };
    } catch (err) {
      throw err;
    }
  }

  async login(payload: IUserLogin) {
    try {
      const { username_or_email, password } = payload;

      const user = await User.findOne({
        $or: [{ email: username_or_email }, { username: username_or_email }],
      }).lean();
      if (!user) {
        console.log(user);
        throw new AppError(
          'Invalid Email or Password',
          httpStatus.UNAUTHORIZED
        );
      }
      const isCorrect = await compare(password, user.password);
      if (!isCorrect)
        throw new AppError(
          'Invalid Email or Password',
          httpStatus.UNAUTHORIZED
        );

      const authTokens = await this.generateAuthTokens(user.id);

      const { password: _, ...rest } = user;

      return {
        user: rest,
        token: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  private async generateAuthTokens(id: string) {
    const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const hashedRefreshToken = await hash(refreshToken, 10);

    const refreshTokenJWT = jwt.sign({ id, refreshToken }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await new Token({
      userId: id,
      token: hashedRefreshToken,
      type: 'refresh_token',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    return { accessToken, refreshToken: refreshTokenJWT };
  }

  async refreshAccessToken(refreshTokenJWT: string) {
    // Decode and verify the refresh token JWT
    const decoded = jwt.verify(
      refreshTokenJWT,
      JWT_SECRET
    ) as RefreshTokenDecoded;
    let { refreshToken } = decoded;
    const { id } = decoded;

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
    refreshToken = crypto.randomBytes(32).toString('hex');
    const hashedRefreshToken = await hash(refreshToken, 10);
    const refreshTokenJWTNew = jwt.sign({ id, refreshToken }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await Token.create({
      userId: id,
      token: hashedRefreshToken,
      type: 'refresh_token',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    return { accessToken, refreshTokenJWTNew };
  }
}

export default new AuthService();
