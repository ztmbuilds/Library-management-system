import { Router } from 'express';
import fineController from '../controllers/fine.controller';

const router = Router();

router.post('/:id/initiate-payment', fineController.initiateFinePayment);

router.patch('/:reference/verify', fineController.verifyFinePayment);

export default router;
