import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './strategies/jwt.passport.strategy';
import { errorHandler, AppError } from './middlewares/error.middleware';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './routes/auth.route';
import bookRoutes from './routes/book.route';
import userRoutes from './routes/user.route';
import reservationRoutes from './routes/reservation.route';
import borrowingRoutes from './routes/borrowing.route';
import fineRouter from './routes/fine.route';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import emailQueue from './queues/email.queue';

//Bull-board Configs
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use(morgan('dev'));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/fines', fineRouter);

//Bull-board route
app.use('/admin/queues', serverAdapter.getRouter());

const swagDoc = YAML.load(path.join(__dirname, './docs/bundled_doc.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swagDoc));

//Handling unhandled routes.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //whatever is passed into next() will be assumed as an err
});

app.use(errorHandler);
export default app;
