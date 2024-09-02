import { validationResult, ValidationChain } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export default function validate(rules: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    rules.map((rule) => rule.run(req));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(errors);
    }
    next();
  };
}
