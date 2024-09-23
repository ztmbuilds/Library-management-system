import { AppError } from '../middlewares/error.middleware';
import Reservation, { IReservation } from '../models/reservation.model';
import { IUser } from '../models/user.model';
import BookService from './book.service';
import EmailService from './email.service';
import { Types } from 'mongoose';
import { IBook } from '../models/book.model';
import APIFeatures from '../utils/features';
import { QueryString } from '../types';
import { BorrowingService } from './borrowing.service';
import { Dayjs } from 'dayjs';

export class ReservationService {
  private user: IUser;
  constructor(user: IUser) {
    this.user = user;
  }
  async create(bookId: string) {
    try {
      const book = await BookService.getBook(bookId);

      if (!book) {
        throw new AppError('No book with that Id found', 404);
      }
      if (book.availableCopies > 0) {
        throw new AppError(
          'You cannot reserve this book as there are available copies',
          409
        );
      }

      const reservation = await Reservation.findOne({
        userId: this.user.id,
        bookId,
      });

      if (reservation)
        throw new AppError(
          'You have already created a reservation for  this book',
          409
        );

      const newReservation = await Reservation.create({
        userId: this.user.id,
        bookId,
      });

      await new EmailService(this.user).sendReservationSuccessMail(
        book.title,
        book.author
      );

      return newReservation;
    } catch (err) {
      throw err;
    }
  }

  async delete(reservationId: string) {
    try {
      const reservation = await Reservation.findById(reservationId);

      if (!reservation) {
        throw new AppError('No reservation with that Id found', 404);
      }

      const book = await BookService.getBook(reservation.bookId.toString());

      if (!book) {
        throw new AppError('Book no longer exists', 404);
      }

      await reservation.deleteOne();

      await new EmailService(this.user).sendReservationDeletedMail(
        book.title,
        book.author
      );
    } catch (err) {
      throw err;
    }
  }

  static async getAllReservationsForBook(
    bookId: string | Types.ObjectId,
    query?: QueryString
  ) {
    try {
      let reservations: IReservation[];
      if (query) {
        const features = new APIFeatures(Reservation.find({ bookId }), query)
          .filter()
          .sort()
          .limitFields()
          .paginate();
        reservations = await features.query;
      }

      reservations = await Reservation.find({ bookId });

      return reservations;
    } catch (err) {
      throw err;
    }
  }

  static async processNextReservation(bookId: string | Types.ObjectId) {
    const oldestReservation = await Reservation.findOne({
      bookId,
      status: 'pending',
    })
      .sort('createdAt')
      .populate<{ bookId: IBook; userId: IUser }>(['bookId', 'userId']);

    if (!oldestReservation) return;

    const { userId: user, bookId: book } = oldestReservation;

    await new EmailService(user).sendReservationClaimableMail(
      book.title,
      book.author
    );

    oldestReservation.status = 'notified';
    oldestReservation.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await oldestReservation.save();
  }

  static async checkAndUpdateReservations() {
    const expiredReservations = await Reservation.find({
      status: 'notified',
      expiresAt: { $lt: new Date() },
    });

    for (let reservation of expiredReservations) {
      reservation.status = 'expired';

      reservation.save();

      await this.processNextReservation(reservation.bookId);
    }
  }

  async getUserReservations(query: QueryString) {
    try {
      const features = new APIFeatures(
        Reservation.find({ userId: this.user.id }),
        query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const reservations = await features.query;

      return reservations;
    } catch (err) {
      throw err;
    }
  }

  async claimReservation(reservationId: string, returnDate: Dayjs) {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation)
      throw new AppError('No reservation with this id found', 404);

    if (reservation.status === 'expired')
      throw new AppError(
        'This resevation has expired and cannot be claimed',
        409
      );
    if (reservation.status === 'claimed') {
      throw new AppError('This reservation has already been claimed', 409);
    }

    if (reservation.status !== 'notified') {
      throw new AppError(
        'This reservation has not been notified and cannot be claimed',
        409
      );
    }

    const borrowRecord = await new BorrowingService(this.user.id).borrowBook(
      reservation.bookId,
      returnDate,
      true
    );

    reservation.status = 'claimed';

    await reservation.save();

    return borrowRecord;
  }
}
