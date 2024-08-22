import mongoose from 'mongoose';

interface IBook extends mongoose.Document {
  title: string;
  author: string;
  genre: string;
  description?: string;
  available: boolean;
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
});

export default mongoose.model<IBook>('Book', BookSchema);
