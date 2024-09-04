import { validationResult, ValidationChain } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware';

export default function validate(rules: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return next(
      //   // new AppError(
      //   //   errors
      //   //     .array()
      //   //     .map((err) => err.msg)
      //   //     .join('. '),
      //   //   400
      //   // )

      //   new Err
      // );

      return res.status(422).json({
        message: 'Validation Failed',
        errors: errors.array(),
      });
    } else {
      next();
    }
  };
}
