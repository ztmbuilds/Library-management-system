import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/user.model';
import { BorrowingService } from '../services/borrowing.service';

class BorrowingController {
  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowRecord = await new BorrowingService(
        req.user?.id as string
      ).returnBook(req.params.id);
      res.status(200).json({
        message: 'Book returned successfully',
        borrowRecord,
      });
    } catch (err) {
      next(err);
    }
  }

  async renewBook(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowingRecord = await new BorrowingService(
        req.user?.id as string
      ).renewBook(req.params.id, req.body.newReturnDate, req.query);

      res.status(200).json({
        message: 'Book renewed successfully',
        borrowingRecord,
      });
    } catch (err) {
      next(err);
    }
  }

  async reportDamangedBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrowingRecord, newFine } = await new BorrowingService(
        req.user?.id as string
      ).reportDamaged(req.params.id, req.body.description);

      res.status(200).json({
        borrowingRecord,
        fine: newFine,
      });
    } catch (err) {
      next(err);
    }
  }

  async reportLostBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrowingRecord, newFine } = await new BorrowingService(
        req.user?.id as string
      ).reportLost(req.params.id, req.body.description);

      res.status(200).json({
        borrowingRecord,
        fine: newFine,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new BorrowingController();
