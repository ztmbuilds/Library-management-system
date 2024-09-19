import mongoose from 'mongoose';

export interface IReservation extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  status: 'notified' | 'expired' | 'redeemed' | 'pending';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['notified', 'expired', 'redeemed', 'pending'],
      default: 'pending',
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
