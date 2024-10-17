import nodemailer, { TransportOptions } from 'nodemailer';
import { MAILER } from '../config';
import { AppError } from '../middlewares/error.middleware';
import { IUser } from '../models/user.model';

export default class EmailService {
  user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  private async sendMail(subject: string, message: string, receipient: string) {
    const transporter = nodemailer.createTransport({
      host: MAILER.HOST,
      port: MAILER.PORT,
      auth: {
        user: MAILER.USER,
        pass: MAILER.PASSWORD,
      },
    } as TransportOptions);

    const result = await transporter.sendMail({
      from: `Admin <${MAILER.USER}>`,
      to: receipient,
      subject,
      text: message,
    });
    if (!result) throw new AppError('Error sending email', 500);

    return result;
  }

  async sendEmailVerificationOTPMail(token: string) {
    const subject = 'Email Verification';
    const message = `Hey ${this.user.username}. \n Your OTP is ${token}`;
    const receipient = this.user.email;

    return await this.sendMail(subject, message, receipient);
  }

  async sendVerificationSuccessMail() {
    const subject = 'Email Verification Success';
    const message = ` Hey ${this.user.username} Your email has been verified successfully`;
    const receipient = this.user.email;

    return await this.sendMail(subject, message, receipient);
  }

  async sendReservationSuccessMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Created Successfully';
    const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been created successfully`;

    return await this.sendMail(subject, message, this.user.email);
  }

  async sendReservationCancelMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Canceled Successfully';

    const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been canceled successfully`;

    return await this.sendMail(subject, message, this.user.email);
  }

  async sendReservationClaimableMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Claimable';
    const message = `Hey ${this.user.username}, \n Your reservation for ${bookTitle} by ${bookAuthor} is now claimable. Please log in to the library system to claim it.`;

    return await this.sendMail(subject, message, this.user.email);
  }
}
