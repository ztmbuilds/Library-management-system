import { Router } from 'express';
import userController from '../controllers/user.controller';
import passport from '../strategies/jwt.passport.strategy';
import validate from '../middlewares/validation-middleware';
import { userUpdateValidationRules } from '../validation/user.validation';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
router
  .route('/me')
  .post(validate(userUpdateValidationRules), userController.updateMe)
  .get(userController.getMe);

router.get(
  '/borrowing-history',
  restrictTo([UserRole.USER]),
  userController.getBorrowingHistory
);

export default router;
