import dayjs from 'dayjs';
import { AppError } from '../middlewares/error.middleware';
import Fine, { IFine } from '../models/Fine.model';
import Borrowing from '../models/borrowing.model';
import { IUser } from '../models/user.model';

export class FineService {
  // In Naira
  static DAILY_OVERDUE_RATE: number = 100;
  static DAMAGED_BOOK_FEE: number = 2000;
  static LOST_BOOK_FEE: number = 10000;

  private static async createFine(
    borrowingId: string,
    reason: IFine['reason'],
    amount: number,
    description: string
  ) {
    const borrowingRecord = await Borrowing.findById(borrowingId);
    if (!borrowingRecord) throw new AppError('Borrowing record not found', 404);

    const newFine = await Fine.create({
      borrowingId,
      userId: borrowingRecord.userId,
      reason,
      amount,
      description,
    });

    await newFine.save();

    return newFine;
  }

  private static async calculateOverdueFine(borrowingId: string) {
    const borrowingRecord = await Borrowing.findById(borrowingId);
    if (!borrowingRecord) throw new AppError('Borrowing record not found', 404);

    const daysLate = dayjs().diff(borrowingRecord.returnDate, 'day');

    const amount = daysLate * this.DAILY_OVERDUE_RATE;

    return this.createFine(
      borrowingRecord.id,
      'OVERDUE',
      amount,
      `${daysLate} days overdue`
    );
  }

  static async updateOverdueFine() {
    const overdueBorrowings = await Borrowing.find({
      returned: false,
      returnDate: { $lt: new Date() },
    }).populate<{ fines: IFine[] }>({
      path: 'fines',
      match: { reason: 'OVERDUE', status: 'PENDING' }, //will return an empty array if there are no matches
    });

    for (let borrowing of overdueBorrowings) {
      if (borrowing.fines.length > 0) {
        const daysLate = dayjs().diff(borrowing.returnDate, 'day');
        borrowing.fines[0].amount = daysLate * this.DAILY_OVERDUE_RATE;

        await borrowing.save();
      } else {
        await this.calculateOverdueFine(borrowing.id);
      }
    }
  }

  static createDamagedBookFine(borrowingId: string, description: string) {
    return this.createFine(
      borrowingId,
      'DAMAGED',
      this.DAMAGED_BOOK_FEE,
      description
    );
  }
  static async createLostBookFine(borrowingId: string, description: string) {
    return this.createFine(
      borrowingId,
      'LOST',
      this.LOST_BOOK_FEE,
      description
    );
  }

  async getAllFines(userId: string) {
    const fines = await Fine.find({ userId });

    return fines;
  }

  static async getFine(fineId: string) {
    const fine = await Fine.findById(fineId).populate<{ userId: IUser }>(
      'userId'
    );

    return fine;
  }
}
