import cron from 'node-cron';
import { ReservationService } from './services/reservation.service';

export async function setupCronJobs() {
  //Check and update reservations every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running reservation check...');
    await ReservationService.checkAndUpdateReservations();
  });
}
