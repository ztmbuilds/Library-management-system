import { Router } from 'express';
import bookController from '../controllers/book.controller';
import {
  borrowBookValidationRules,
  createBookValidationRules,
  deleteBookValidationRules,
  editBookValidationRules,
} from '../validation/book.validation';
import validate from '../middlewares/validation-middleware';
import passport from '../strategies/jwt.passport.strategy';
import { restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../types/enums';

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
  .post(
    restrictTo([UserRole.USER]),
    validate(borrowBookValidationRules),
    bookController.borrowBook
  )
  .delete(
    restrictTo([UserRole.ADMIN]),
    validate(deleteBookValidationRules),
    bookController.deleteBook
  );

export default router;
