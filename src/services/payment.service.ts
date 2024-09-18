import { Paystack } from 'paystack-sdk';
import Payment from '../models/payment.model';
import { PAYSTACK_SECRET_KEY } from '../config';
import { FineService } from './fine.service';
import { AppError } from '../middlewares/error.middleware';

class PaymentService {
  private paystack: Paystack;
  constructor() {
    this.paystack = new Paystack(PAYSTACK_SECRET_KEY);
  }
  async initializePayment(fineId: string) {
    try {
      const fine = await FineService.getFine(fineId);
      if (!fine) throw new AppError('No fine with that id found', 404);

      const payload = {
        email: fine.userId.email,
        amount: `${fine.amount * 100}`, // Paystack expects amount in kobo
        currency: 'NGN',
      };

      const response = await this.paystack.transaction.initialize(payload);

      const newPayment = await Payment.create({
        fineId,
        amount: fine.amount,
        status: 'pending',
        transaction_refrence: response.data?.reference,
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await this.paystack.transaction.verify(reference);

      const status =
        response.data?.status === 'success' ? 'completed' : 'failed';

      const payment = await Payment.findOne({
        transaction_refrence: reference,
      });

      if (!payment)
        throw new AppError(
          'No payment with that transaction reference found',
          404
        );

      payment.status = status;

      await payment.save();
      return payment;
    } catch (err) {
      throw err;
    }
  }
}

export default new PaymentService();
