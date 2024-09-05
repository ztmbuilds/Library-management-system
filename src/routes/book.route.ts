import { Router } from 'express';
import bookController from '../controllers/book.controller';
import {
  borrowBookValidationRules,
  createBookValidationRules,
  editBookValidationRules,
} from '../validation/book.validation';
import validate from '../middlewares/validation-middleware';
import passport from '../strategies/jwt.passport.strategy';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';
import { User } from '../models/user.model';

const router = Router();

router
  .route('/')
  .post(
    passport.authenticate('jwt', { session: false }),
    restrictTo([UserRole.ADMIN]),
    validate(createBookValidationRules),
    bookController.createBook
  )
  .get(bookController.getAllBooks);

router.use(passport.authenticate('jwt', { session: false }));
router
  .route('/:id')

  .patch(
    restrictTo([UserRole.ADMIN]),
    validate(editBookValidationRules),
    bookController.editBook
  )

  .delete(restrictTo([UserRole.ADMIN]), bookController.deleteBook);

router.post(
  '/:id/borrow',
  restrictTo([UserRole.USER]),
  validate(borrowBookValidationRules),
  bookController.borrowBook
);

router.patch(
  '/:id/return',
  restrictTo([UserRole.USER]),

  bookController.returnBook
);

export default router;
