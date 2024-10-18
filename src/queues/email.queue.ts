import Queue from 'bull';
import { REDIS_URL } from '../config';
import EmailService from '../services/email.service';

const emailQueue = new Queue('email', REDIS_URL);

emailQueue.process(async (job, done) => {
  await new EmailService(job.data.user).sendMail(
    job.data.subject,
    job.data.message,
    job.data.receipient
  );
  job.progress(100);
  done();
});

export default emailQueue;
