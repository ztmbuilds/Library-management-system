import { Router } from 'express';
import fineController from '../controllers/fine.controller';
import passport from 'passport';

const router = Router();

router.post('/:id/initiate-payment', fineController.initiateFinePayment);

//Webhook endpoint
router.post('/verify', fineController.verifyFinePayment);

router.use(passport.authenticate('jwt', { session: false }));

router.get('/:id', fineController.getFine);

export default router;
