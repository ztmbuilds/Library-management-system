import { Schema, model, Document, Types } from 'mongoose';

interface IPayment extends Document {
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  fineId: Types.ObjectId;
  transaction_refrence: string;
  paymentServiceId: string;
  currency: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    fineId: {
      type: Schema.Types.ObjectId,
      ref: 'Fine',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      required: true,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    transaction_refrence: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<IPayment>('Payment', paymentSchema);
