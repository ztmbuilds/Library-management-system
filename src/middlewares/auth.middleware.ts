import { Response, Request, NextFunction } from 'express';
import { UserRole } from '../types';
import { AppError } from './error.middleware';

export function restrictTo(roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
}
