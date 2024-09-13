import mongoose from 'mongoose';

export interface IFine extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  borrowingId: mongoose.Types.ObjectId;
  reason: 'OVERDUE' | 'DAMAGED' | 'LOST' | 'OTHER';
  amount: number;
  status: 'PENDING' | 'PAID';
  paidAt?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fineSchema = new mongoose.Schema(
  {
    borrowingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrowing',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: ['OVERDUE', 'DAMAGED', 'LOST', 'OTHER'],
      required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },

    paidAt: Date,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFine>('Fine', fineSchema);
