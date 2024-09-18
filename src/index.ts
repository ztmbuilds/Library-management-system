import { config } from 'dotenv';
config();
import { PORT } from './config';
import './database/index';
import app from './app';
import { setupCronJobs } from './cron';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥 Shutting Down....');
  console.log(err.name, err.message);
  process.exit(1);
});

const start = async () => {
  app.listen(PORT, async () => {
    console.log(`:::> 🚀 Server ready at http://localhost:${PORT}`);
  });
  //cron jobs
  await setupCronJobs();
};

start();
