import mongoose from 'mongoose';
import { MONGO_URL } from '../config';

if (!MONGO_URL) {
  throw new Error('MONGO_URL must be defined');
}
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`:::>  Database connected`);
  })
  .catch((err) => {
    console.error(':::>  Error connecting to database: ', err);
  });
