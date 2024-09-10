import { NextFunction, Request, Response } from 'express';
import { ReservationService } from '../services/reservation.service';
import { IUser } from '../models/user.model';

class ReservationController {
  async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await new ReservationService(
        req.user as IUser
      ).create(req.params.id);
      res.status(201).json({
        message: 'Reservation created successfully',
        reservation,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteReservation(req: Request, res: Response, next: NextFunction) {
    try {
      await new ReservationService(req.user as IUser).delete(
        req.params.reservationId
      );

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export default new ReservationController();
