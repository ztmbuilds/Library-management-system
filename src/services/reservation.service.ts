import { AppError } from '../middlewares/error.middleware';
import Reservation from '../models/reservation.model';
import { IUser } from '../models/user.model';
import bookService from './book.service';
import EmailService from './email.service';

export class ReservationService {
  private user: IUser;
  constructor(user: IUser) {
    this.user = user;
  }
  async create(bookId: string) {
    try {
      const book = await bookService.getBook(bookId);

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

      const book = await bookService.getBook(reservation.bookId.toString());

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

  async getAllReservationsForBook(bookId: string) {
    try {
      const reservations = await Reservation.find({ bookId });

      return reservations;
    } catch (err) {
      throw err;
    }
  }
}
