import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import passport from '../strategies/jwt.passport.strategy';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';
import validate from '../middlewares/validation-middleware';
import { borrowBookValidationRules } from '../validation/book.validation';
const router = Router({ mergeParams: true });

router.use(passport.authenticate('jwt', { session: false }));
router
  .route('/')
  .post(restrictTo([UserRole.USER]), reservationController.createReservation);

router
  .route('/:id')
  .delete(restrictTo([UserRole.USER]), reservationController.cancelReservation);

router.patch(
  '/:id/claim',
  restrictTo([UserRole.USER]),
  validate(borrowBookValidationRules),
  reservationController.claimReservation
);

router.patch(
  '/:id/cancel',
  restrictTo([UserRole.USER]),
  reservationController.cancelReservation
);
export default router;
