import mongoose from 'mongoose';

interface IReservation extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
