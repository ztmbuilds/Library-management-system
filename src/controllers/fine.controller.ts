import { NextFunction, Request, Response } from 'express';
import PaymentService from '../services/payment.service';

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
      const payment = await PaymentService.verifyPayment(req.params.reference);

      res.status(200).json({
        payment,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new FineController();
