import { Paystack } from 'paystack-sdk';
import Payment from '../models/payment.model';
import { PAYSTACK_SECRET_KEY } from '../config';
import { FineService } from './fine.service';
import { AppError } from '../middlewares/error.middleware';
import { IFine } from '../models/Fine.model';

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

      await Payment.create({
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

  async verifyPaymentWebhook(event: any) {
    try {
      const reference = event.data?.offline_reference;
      const status = event.data?.status === 'success' ? 'completed' : 'failed';

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
    } catch (err) {
      throw err;
    }
  }

  async verifyPayment(reference: string) {
    const response = await this.paystack.transaction.verify(reference);

    const payment = await Payment.findOne({
      transaction_refrence: reference,
    }).populate<{ fineId: IFine }>('fineId');

    if (!payment)
      throw new AppError(
        'No payment with that transaction reference found',
        404
      );

    switch (response.data?.status) {
      case 'success':
        payment.status = 'completed';
        payment.fineId.status = 'PAID';

        break;
      case 'failed':
        payment.status = 'failed';
        break;
      default:
        payment.status = 'pending';
        break;
    }

    await payment.save();
    await payment.fineId.save();
    return payment;
  }
}

export default new PaymentService();
