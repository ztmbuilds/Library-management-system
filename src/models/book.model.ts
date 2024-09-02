import mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  description?: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
}

const BookSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  availabe: {
    type: Boolean,
    default: true,
  },
  totalCopies: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IBook>('Book', BookSchema);
