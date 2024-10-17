import { NextFunction, Request, Response } from 'express';
import PaymentService from '../services/payment.service';
import crypto from 'crypto';
import { PAYSTACK_SECRET_KEY } from '../config';
import { FineService } from '../services/fine.service';

class FineController {
  async initiateFinePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PaymentService.initializePayment(req.params.id);

      res.status(200).json({
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyFinePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash == req.headers['x-paystack-signature']) {
        await PaymentService.verifyPayment(req.body);
      }

      res.send(200);
    } catch (err) {
      next(err);
    }
  }

  async getFine(req: Request, res: Response, next: NextFunction) {
    try {
      const fine = await FineService.getFine(req.params.id);

      res.status(200).json({
        fine,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new FineController();
