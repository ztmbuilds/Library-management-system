import { Router } from 'express';
import bookController from '../controllers/book.controller';
import {
  createBookValidationRules,
  deleteBookValidationRules,
  editBookValidationRules,
} from '../validation/book.validation';
import validate from '../middlewares/validation-middleware';

const router = Router();

router
  .route('/')
  .post(validate(createBookValidationRules), bookController.createBook)
  .get(bookController.getAllBooks);

router
  .route('/:id')
  .patch(validate(editBookValidationRules), bookController.editBook)
  .delete(validate(deleteBookValidationRules), bookController.deleteBook);

export default router;
