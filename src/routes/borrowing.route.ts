import { Router } from 'express';
import borrowingController from '../controllers/borrowing.controller';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';
import {
  renewBookValidationRules,
  reportDamagedOrLostValidationRules,
} from '../validation/borrowing.validation';
import validate from '../middlewares/validation-middleware';
import passport from '../strategies/jwt.passport.strategy';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

router.patch(
  '/:id/return',
  restrictTo([UserRole.USER]),
  borrowingController.returnBook
);

router.patch(
  '/:id/renew',
  restrictTo([UserRole.USER]),
  validate(renewBookValidationRules),
  borrowingController.renewBook
);

router.patch(
  '/:id/report-lost',
  restrictTo([UserRole.USER]),
  validate(reportDamagedOrLostValidationRules),
  borrowingController.reportLostBook
);

router.patch(
  '/:id/report-damanged',
  restrictTo([UserRole.USER]),
  validate(reportDamagedOrLostValidationRules),
  borrowingController.reportDamangedBook
);

export default router;
