import mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  description?: string;

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
