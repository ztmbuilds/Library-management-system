import nodemailer, { TransportOptions } from 'nodemailer';
import { MAILER } from '../config';
import { AppError } from '../middlewares/error.middleware';
import { IUser } from '../models/user.model';
import emailQueue from '../queues/email.queue';

export default class EmailService {
  user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  async sendMail(subject: string, message: string, receipient: string) {
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

    emailQueue.add({ subject, message, receipient, user: this.user });
  }

  async sendVerificationSuccessMail() {
    const subject = 'Email Verification Success';
    const message = ` Hey ${this.user.username} Your email has been verified successfully`;
    const receipient = this.user.email;

    emailQueue.add({ subject, message, receipient, user: this.user });
  }

  async sendReservationSuccessMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Created Successfully';
    const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been created successfully`;

    emailQueue.add({
      subject,
      message,
      recepient: this.user.email,
      user: this.user,
    });
  }

  async sendReservationCancelMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Canceled Successfully';

    const message = `Hey ${this.user.username}, \n Your reservation for  ${bookTitle} by ${bookAuthor} has been canceled successfully`;
    emailQueue.add({
      subject,
      message,
      receipient: this.user.email,
      user: this.user,
    });
  }

  async sendReservationClaimableMail(bookTitle: string, bookAuthor: string) {
    const subject = 'Reservation Claimable';
    const message = `Hey ${this.user.username}, \n Your reservation for ${bookTitle} by ${bookAuthor} is now claimable. Please log in to the library system to claim it.`;

    emailQueue.add({
      subject,
      message,
      receipient: this.user.email,
      user: this.user,
    });
  }
}
