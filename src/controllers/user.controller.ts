import { Response, NextFunction, Request } from 'express';
import userService from '../services/user.service';
import { BorrowingService } from '../services/borrowing.service';

class UserController {
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(req.user?.id as string, req.body);
      res.status(200).json({
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
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
      const borrowingHistory = await new BorrowingService('').getAll(
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
}

export default new UserController();
