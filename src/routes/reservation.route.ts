import { Router } from 'express';
import reservationController from '../controllers/reservation.controller';
import passport from '../strategies/jwt.passport.strategy';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';
const router = Router({ mergeParams: true });

router.use(passport.authenticate('jwt', { session: false }));
router
  .route('/')
  .post(restrictTo([UserRole.USER]), reservationController.createReservation);

router
  .route('/:reservationId')
  .delete(restrictTo([UserRole.USER]), reservationController.deleteReservation);

export default router;
