import { Router } from 'express';
import authController from '../controllers/auth.controller';
import {
  loginValidationRules,
  requestEmailVerificationRules,
  signupValidationRules,
  verifyEmailValidationRules,
} from '../validation/auth.validation';
import validate from '../middlewares/validation-middleware';

const router = Router();

router.post('/signup', validate(signupValidationRules), authController.signup);

router.post('/login', validate(loginValidationRules), authController.login);

router.get('/refresh-access-token', authController.refreshAccessToken);

router.post(
  '/request-email-verification',
  validate(requestEmailVerificationRules),
  authController.requestEmailVerification
);

router.post(
  '/verify-email',
  validate(verifyEmailValidationRules),
  authController.verifyEmail
);
export default router;
