import { config } from 'dotenv';
config();
import { PORT, REDIS_URL } from './config';
import './database/index';
import app from './app';
import { setupCronJobs } from './cron';
import { createClient } from 'redis';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥 Shutting Down....');
  console.log(err.name, err.message);
  process.exit(1);
});

const start = async () => {
  const redisClient = createClient({
    url: REDIS_URL,
  });
  redisClient.connect().catch((err: any) => {
    console.error('Error connecting to Redis: ', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  redisClient.on('ready', () => {
    console.log('Redis client is ready to use');
  });

  app.listen(PORT, async () => {
    console.log(`:::> 🚀 Server ready at http://localhost:${PORT}`);
    console.log(
      `:::> 🚀 View swagger documentation at http://localhost:${PORT}/api/docs`
    );
  });
  //cron jobs
  await setupCronJobs();
};

start();
