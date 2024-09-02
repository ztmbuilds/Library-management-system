import mongoose from 'mongoose';

interface IBorrowing extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowDate: Date;
  returnDate: Date;
  renewed: boolean;
}

const borrowingSchema: mongoose.Schema = new mongoose.Schema({
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
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: true,
  },

  renewed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IBorrowing>('Borrowing', borrowingSchema);
