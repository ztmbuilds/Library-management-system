import Book, { IBook } from '../models/book.model';
import APIFeatures from '../utils/features';
import { QueryString } from '../types';
import { UpdateBookInput } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { BorrowingService } from './borrowing.service';
import { Dayjs } from 'dayjs';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';
import { ReservationService } from './reservation.service';

class BookService {
  async createBook(book: IBook) {
    try {
      const newBook = await Book.create(book);

      return newBook;
    } catch (err) {
      throw err;
    }
  }

  async getBook(bookId: string | Types.ObjectId) {
    try {
      const book = await Book.findById(bookId);

      if (!book) throw new AppError('No book with that ID found', 404);

      return book;
    } catch (err) {
      throw err;
    }
  }

  async getAllBooks(query: QueryString) {
    try {
      const features = new APIFeatures(Book.find(), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const books = await features.query;
      return books;
    } catch (err) {
      throw err;
    }
  }

  async editBook(id: string, data: UpdateBookInput) {
    try {
      const book = await Book.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!book) throw new AppError('No book with that ID found', 404);
      return book;
    } catch (err) {
      throw err;
    }
  }

  async deleteBook(id: string) {
    try {
      const book = await Book.findByIdAndDelete(id);
      if (!book) throw new AppError('No book with that ID found', 404);
    } catch (err) {
      throw err;
    }
  }

  async returnBook(user: IUser, bookId: string) {
    try {
      const book = await Book.findById(bookId);
      if (!book) throw new AppError('No book with that ID found', 404);

      const borrowRecord = await new BorrowingService(user.id).returnBook(
        bookId
      );

      book.availableCopies += 1;
      await book.save();

      return { borrowRecord, book };
    } catch (err) {
      throw err;
    }
  }
}

export default new BookService();
