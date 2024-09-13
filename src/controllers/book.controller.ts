import { NextFunction, Request, Response } from 'express';
import bookService from '../services/book.service';
import { QueryString } from '../types/';
import { IUser } from '../models/user.model';
import { BorrowingService } from '../services/borrowing.service';

class BookController {
  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.createBook(req.body);

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
      const books = await bookService.getAllBooks(req.query);
      res.status(200).json({
        books,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.getBook(req.params.id);

      res.status(200).json({
        book,
      });
    } catch (err) {
      next(err);
    }
  }

  async editBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.editBook(req.params.id, req.body);
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
      await bookService.deleteBook(req.params.id);
      res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      next(err);
    }
  }

  async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowRecord = await bookService.borrowBook(
        req.user as IUser,
        req.params.id,
        req.body.returnDate
      );
      res.status(200).json({
        borrowRecord,
      });
    } catch (err) {
      next(err);
    }
  }

  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await bookService.returnBook(
        req.user as IUser,
        req.params.id
      );

      res.status(200).json({
        message: 'Book returned successfully',
        book,
      });
    } catch (err) {
      next(err);
    }
  }

  async renewBook(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowingRecord = await new BorrowingService(
        req.user?.id as string
      ).renewBook(req.params.id, req.body.newReturnDate);

      res.status(200).json({
        message: 'Book renewed successfully',
        borrowingRecord,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBorrowingHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const borrowingHistory = await new BorrowingService('').getAll(
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

  async reportDamangedBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrowingRecord, newFine } = await new BorrowingService(
        req.user?.id as string
      ).reportDamaged(req.params.id, req.body.description);

      res.status(200).json({
        borrowingRecord,
        fine: newFine,
      });
    } catch (err) {
      next(err);
    }
  }

  async reportLostBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrowingRecord, newFine } = await new BorrowingService(
        req.user?.id as string
      ).reportLost(req.params.id, req.body.description);

      res.status(200).json({
        borrowingRecord,
        fine: newFine,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new BookController();
