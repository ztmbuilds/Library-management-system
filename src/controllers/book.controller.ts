import { NextFunction, Request, Response } from 'express';
import BookService from '../services/book.service';
import { BorrowingService } from '../services/borrowing.service';

import { IUser } from '../models/user.model';

class BookController {
  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await BookService.createBook(req.body);

      res.status(201).json({
        message: 'Book created Successfully',
        book,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await BookService.getAllBooks(req.query);
      res.status(200).json({
        books,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await BookService.getBook(req.params.id);

      res.status(200).json({
        book,
      });
    } catch (err) {
      next(err);
    }
  }

  async editBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await BookService.editBook(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        book,
      });
    } catch (err) {
      next(err);
    }
  }
  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      await BookService.deleteBook(req.params.id);
      res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      next(err);
    }
  }

  async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowRecord = await new BorrowingService(
        req.user?.id as string
      ).borrowBook(req.params.id, req.body.returnDate);

      res.status(200).json({
        borrowRecord,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBorrowingHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowingHistory = await BorrowingService.getAll(
        req.query,
        req.params.id
      );
      res.status(200).json({
        borrowingHistory,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new BookController();
