import { Dayjs } from 'dayjs';
import { AppError } from '../middlewares/error.middleware';
import Borrowing from '../models/borrowing.model';

export class BorrowingService {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
  async get(id: string) {
    try {
      const borrowRecord = await Borrowing.findById(id);
      if (!history)
        throw new AppError('No borrow record with that id found', 404);
      return borrowRecord;
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      const borrowingHistory = await Borrowing.find({
        userId: this.userId,
      });
      return borrowingHistory;
    } catch (err) {
      throw err;
    }
  }
  async borrow(bookId: string, returnDate: Dayjs) {
    try {
      const borrowRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
      });
      if (borrowRecord)
        throw new AppError('This book has already been borrowed by you', 409);

      const newBorrowRecord = await Borrowing.create({
        userId: this.userId,
        bookId,
        returnDate,
      });

      return newBorrowRecord;
    } catch (err) {
      throw err;
    }
  }

  async return(bookId: string) {
    try {
      const borrowRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
        returned: false,
      });
      if (!borrowRecord) throw new AppError('No borrow record found', 404);

      borrowRecord.returned = true;
      await borrowRecord.save();
    } catch (err) {
      throw err;
    }
  }
}
