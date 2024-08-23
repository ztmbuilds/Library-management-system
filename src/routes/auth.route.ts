import { Router } from 'express';
import authController from '../controllers/auth.controller';
import passport from 'passport';

const router = Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/refresh-access-token', authController.refreshAccessToken);

router.post(
  '/request-email-verification',
  authController.requestEmailVerification
);

router.post('/verify-email', authController.verifyEmail);
export default router;
