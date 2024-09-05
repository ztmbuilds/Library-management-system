import { NextFunction, Request, Response } from 'express';
import bookService from '../services/book.service';
import { QueryString } from '../types/';

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
      const books = await bookService.getAllBooks(req.query as QueryString);
      res.status(200).json({
        books,
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
        req.user?.id as string,
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
        req.user?.id as string,
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
}

export default new BookController();
