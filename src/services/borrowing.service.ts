import dayjs, { Dayjs } from 'dayjs';
import { AppError } from '../middlewares/error.middleware';
import Borrowing from '../models/borrowing.model';
import { ReservationService } from './reservation.service';
import { IUser } from '../models/user.model';
import APIFeatures from '../utils/features';
import { QueryString } from '../types';
import { FineService } from './fine.service';

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

  async getAll(query: QueryString, id: string) {
    try {
      const features = new APIFeatures(
        Borrowing.find({
          $or: [{ userId: id }, { bookId: id }],
        }),
        query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const borrowingHistory = await features.query;
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
        returned: false,
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
      borrowRecord.actualReturnDate = dayjs().toDate();
      await borrowRecord.save();
    } catch (err) {
      throw err;
    }
  }

  async renewBook(bookId: string, newReturnDate: Dayjs) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
        returned: false,
      });

      if (!borrowingRecord)
        throw new AppError('No borrowing record found', 404);

      if (dayjs(borrowingRecord.returnDate) >= newReturnDate)
        throw new AppError(
          'New return date cannot be before or on the same day as the existing return date',
          422
        );
      const reservations = await new ReservationService(
        {} as IUser
      ).getAllReservationsForBook(bookId); // {} because i don't want to pass in req.user .

      if (reservations.length !== 0)
        throw new AppError(
          'You cannot renew this book because it has existing reservations',
          409
        );

      borrowingRecord.returnDate = newReturnDate.toDate();
      borrowingRecord.renewed = true;

      await borrowingRecord.save();

      return borrowingRecord;
    } catch (err) {
      throw err;
    }
  }

  async reportLost(bookId: string, description: string) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
        returned: false,
      });

      if (!borrowingRecord)
        throw new AppError('No borrowing record found', 404);

      const newFine = await FineService.createLostBookFine(
        borrowingRecord.id,
        description
      );

      return { borrowingRecord, newFine };
    } catch (err) {
      throw err;
    }
  }

  async reportDamaged(bookId: string, description: string) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
        returned: false,
      });

      if (!borrowingRecord)
        throw new AppError('No borrowing record found', 404);

      const newFine = await FineService.createDamagedBookFine(
        borrowingRecord.id,
        description
      );

      return { borrowingRecord, newFine };
    } catch (err) {
      throw err;
    }
  }
}
