import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './strategies/jwt.passport.strategy';
import { errorHandler, AppError } from './middlewares/error.middleware';
import morgan from 'morgan';

import authRoutes from './routes/auth.route';
import bookRoutes from './routes/book.route';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use(morgan('dev'));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

//Handling unhandled routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});

app.use(errorHandler);
export default app;
