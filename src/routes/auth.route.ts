import { Router } from 'express';
import authController from '../controllers/auth.controller';
import passport from 'passport';

const router = Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/refresh-access-token', authController.refreshAccessToken);
export default router;
