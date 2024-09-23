import { Response, NextFunction, Request } from 'express';
import userService from '../services/user.service';
import { BorrowingService } from '../services/borrowing.service';
import { ReservationService } from '../services/reservation.service';
import { IUser } from '../models/user.model';

class UserController {
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.user?.id as string, req.body);
      res.status(200).json({
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.get(req.user?.id as string);
      res.status(200).json({
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBorrowingHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowingHistory = await BorrowingService.getAll(
        req.query,
        req.user?.id as string
      );

      res.status(200).json({
        borrowingHistory,
      });
    } catch (err) {
      next(err);
    }
  }

  async getReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await new ReservationService(
        req.user as IUser
      ).getUserReservations(req.query);

      res.status(200).json({
        reservations,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
