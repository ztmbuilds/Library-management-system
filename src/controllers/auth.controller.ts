import authService from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email } = req.body;
      const { user } = await authService.signup({
        username,
        password,
        email,
      });

      res.status(201).json({
        message: 'User created Successfully',
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username_or_email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login({
        username_or_email,
        password,
      });

      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
      });

      res.status(200).json({
        message: 'User login Sucessful',
        accessToken,
        user,
      });
    } catch (err) {
      next(err);
      console.log(err);
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshTokenJWTNew } =
        await authService.refreshAccessToken(req.cookies.refreshToken);

      res.clearCookie('refreshToken');
      res.cookie('refreshToken', refreshTokenJWTNew, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
      });

      res.status(200).json({
        message: 'Access Token refreshed successfully',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async requestEmailVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const expiresAt = await authService.requestEmailVerification(
        req.body.email
      );

      res.status(200).json({
        message: 'OTP sent to email successfully',
        expiresAt,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyEmail(req.body);
      res.status(200).json({
        message: 'Email verified successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
