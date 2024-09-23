import dayjs, { Dayjs } from 'dayjs';
import { Types } from 'mongoose';
import { AppError } from '../middlewares/error.middleware';
import Borrowing from '../models/borrowing.model';
import { ReservationService } from './reservation.service';
import { IUser } from '../models/user.model';
import APIFeatures from '../utils/features';
import { QueryString } from '../types';
import { FineService } from './fine.service';
import { IFine } from '../models/Fine.model';
import BookService from './book.service';
import { IBook } from '../models/book.model';

export class BorrowingService {
  private userId: string | Types.ObjectId;
  constructor(userId: string | Types.ObjectId) {
    this.userId = userId;
  }
  async get(id: string) {
    try {
      const borrowRecord = await Borrowing.findById(id);
      if (!borrowRecord)
        throw new AppError('No borrow record with that id found', 404);
      return borrowRecord;
    } catch (err) {
      throw err;
    }
  }

  static async getAll(query: QueryString, id: string) {
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
  async borrowBook(
    bookId: string | Types.ObjectId,
    returnDate: Dayjs,
    isReservationClaim = false
  ) {
    try {
      const borrowRecord = await Borrowing.findOne({
        bookId,
        userId: this.userId,
        returned: false,
      });
      if (borrowRecord)
        throw new AppError('This book has already been borrowed by you', 409);

      const book = await BookService.getBook(bookId);

      if (book.availableCopies === 0)
        throw new AppError('There are no available copies of this book', 409);

      if (!isReservationClaim) {
        const reservations = await ReservationService.getAllReservationsForBook(
          bookId
        );

        const activeReservations = reservations.find(
          (el) => el.status === 'notified' || el.status === 'pending'
        );

        if (activeReservations)
          throw new AppError(
            'Unable to borrow this book due to existing active reservations.',
            409
          );
      }

      const newBorrowRecord = await Borrowing.create({
        userId: this.userId,
        bookId,
        returnDate,
      });

      book.availableCopies -= 1;
      await book.save();

      return newBorrowRecord;
    } catch (err) {
      throw err;
    }
  }

  async returnBook(borrowingId: string) {
    try {
      const borrowRecord = await Borrowing.findOne({
        _id: new Types.ObjectId(borrowingId),
        userId: this.userId,
        returned: false,
      }).populate<{ bookId: IBook }>('bookId');
      if (!borrowRecord) throw new AppError('No borrow record found', 404);

      borrowRecord.returned = true;
      borrowRecord.actualReturnDate = dayjs().toDate();

      const { bookId: book } = borrowRecord;
      book.availableCopies += 1;

      await book.save();
      await borrowRecord.save();

      await ReservationService.processNextReservation(book.id);

      return borrowRecord;
    } catch (err) {
      throw err;
    }
  }

  async renewBook(
    borrowingId: string,
    newReturnDate: Dayjs,
    query: QueryString
  ) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        _id: new Types.ObjectId(borrowingId),
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
      const reservations = await ReservationService.getAllReservationsForBook(
        borrowingRecord.bookId,
        query
      );

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

  async reportLost(borrowingId: string, description: string) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        _id: new Types.ObjectId(borrowingId),
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

  async reportDamaged(borrowingId: string, description: string) {
    try {
      const borrowingRecord = await Borrowing.findOne({
        _id: new Types.ObjectId(borrowingId),
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
